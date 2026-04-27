import uuid

from fastapi import HTTPException
from app.schemas.challenge import (
    ChallengeGenerateRequest,
    ChallengeHintResponse,
    ChallengeResponse,
    ChallengeSubmitRequest,
    ChallengeSubmitResponse,
    ChallengeUpdateRequest,
)
from app.services._supabase import first, require_first, require_one
from app.services.challenge.prompt import HINT_PROMPT, build_hint_prompt
from app.services.challenge._utils import ChallengeGenerator
from app.services.database.functions import get_database, query_database
from app.services.quota import check_quota
from app.services.tracking import (
    track_challenge_generated,
    track_hint_used,
    track_submission,
)
from app.services._utils import message_text, parse_llm_json
from app.supabase import db
from ._utils import client


async def generate_challenge(
    user_id: str, body: ChallengeGenerateRequest
) -> ChallengeResponse:
    check_quota(user_id, "challenge")
    db_result = (
        db.table("databases")
        .select("industry,db_schema")
        .eq("id", body.database_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    database = require_one(db_result, "Database")

    generator = ChallengeGenerator(
        industry=database["industry"],
        db_schema=database["db_schema"],
        topics=body.topics or "",
        level=body.level,
        context=body.context or "",
        max_retries=3,
    )

    generated = await generator.generate()

    insert_result = (
        db.table("challenges")
        .insert(
            {
                "id": str(uuid.uuid4()),
                "database_id": body.database_id,
                "user_id": user_id,
                "name": generator.name,
                "description": generator.description,
                "level": body.level,
                "topics": generator.generated_topics,
                "solution": generated["solution"],
                "public": False,
            }
        )
        .execute()
    )

    inserted = first(insert_result)
    track_challenge_generated(user_id, inserted["id"])
    return ChallengeResponse.model_validate(inserted)


def get_challenges(
    user_id: str, database_id: str | None = None
) -> list[ChallengeResponse]:
    query = db.table("challenges").select("*").eq("user_id", user_id)
    if database_id:
        query = query.eq("database_id", database_id)
    list_result = query.execute()
    return [ChallengeResponse.model_validate(row) for row in list_result.data]


def get_challenge(challenge_id: str, user_id: str) -> ChallengeResponse:
    get_result = (
        db.table("challenges")
        .select("*")
        .eq("id", challenge_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return ChallengeResponse.model_validate(require_one(get_result, "Challenge"))


def update_challenge(
    challenge_id: str, user_id: str, body: ChallengeUpdateRequest
) -> ChallengeResponse:
    update_result = (
        db.table("challenges")
        .update({"public": body.public})
        .eq("id", challenge_id)
        .eq("user_id", user_id)
        .execute()
    )
    return ChallengeResponse.model_validate(require_first(update_result, "Challenge"))


def delete_challenge(challenge_id: str, user_id: str) -> None:
    db.table("challenges").delete().eq("id", challenge_id).eq(
        "user_id", user_id
    ).execute()


def submit_challenge(
    challenge_id: str, user_id: str, body: ChallengeSubmitRequest
) -> ChallengeSubmitResponse:
    challenge = get_challenge(challenge_id, user_id)
    database = get_database(body.database_id, user_id)

    user_result = query_database(database.db_path, body.dql)
    solution_result = query_database(database.db_path, challenge.solution)

    solved = user_result.columns == solution_result.columns and sorted(
        map(tuple, user_result.rows)
    ) == sorted(map(tuple, solution_result.rows))

    track_submission(user_id, challenge_id, solved, challenge.level)

    return ChallengeSubmitResponse.model_validate(
        {"solved": solved, "result": user_result}
    )


async def get_challenge_hint(
    challenge_id: str, user_id: str, body: ChallengeSubmitRequest
) -> ChallengeHintResponse:
    check_quota(user_id, "hint")
    challenge = get_challenge(challenge_id, user_id)
    database = get_database(body.database_id, user_id)

    student_error: str | None = None
    is_valid = False
    if body.dql.strip():
        try:
            student_result = query_database(database.db_path, body.dql)
            solution_result = query_database(database.db_path, challenge.solution)
            is_valid = student_result.columns == solution_result.columns and sorted(
                map(tuple, student_result.rows)
            ) == sorted(map(tuple, solution_result.rows))
        except HTTPException as e:
            student_error = str(e.detail)

    message = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=8192,
        system=HINT_PROMPT,
        messages=[
            {
                "role": "user",
                "content": build_hint_prompt(
                    body.dql,
                    database.db_schema,
                    challenge.name,
                    challenge.description,
                    challenge.solution,
                    is_valid=is_valid,
                    student_error=student_error,
                ),
            }
        ],
    )

    data = parse_llm_json(message_text(message))
    track_hint_used(user_id, challenge_id)

    return ChallengeHintResponse.model_validate(data)
