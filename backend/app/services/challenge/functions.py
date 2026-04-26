import json
import uuid
from fastapi import HTTPException
from app.schemas.challenge import (
    ChallengeGenerateRequest,
    ChallengeHintResponse,
    ChallengeResponse,
    ChallengeSubmitRequest,
    ChallengeSubmitResponse,
    UpdateChallengeRequest,
)
from app.services.challenge.prompt import HINT_PROMPT, build_hint_prompt
from app.services.challenge.utils import ChallengeGenerator
from app.services.database.functions import get_database, query_database
from app.services.utils import str_json_to_dict
from app.supabase import db
from .utils import client


def get_challenges(
    user_id: str, database_id: str | None = None
) -> list[ChallengeResponse]:
    query = db.table("challenges").select("*").eq("user_id", user_id)
    if database_id:
        query = query.eq("database_id", database_id)
    result = query.execute()
    return [ChallengeResponse.model_validate(row) for row in result.data]


def get_challenge(challenge_id: str, user_id: str) -> ChallengeResponse:
    result = (
        db.table("challenges")
        .select("*")
        .eq("id", challenge_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return ChallengeResponse.model_validate(result.data)


def update_challenge(
    challenge_id: str, user_id: str, body: UpdateChallengeRequest
) -> ChallengeResponse:
    result = (
        db.table("challenges")
        .update({"public": body.public})
        .eq("id", challenge_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return ChallengeResponse.model_validate(result.data[0])


def delete_challenge(challenge_id: str, user_id: str) -> None:
    db.table("challenges").delete().eq("id", challenge_id).eq(
        "user_id", user_id
    ).execute()


async def generate_challenge(
    user_id: str, body: ChallengeGenerateRequest
) -> ChallengeResponse:
    result = (
        db.table("databases")
        .select("industry,db_schema")
        .eq("id", body.database_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    database = result.data

    if not database:
        raise HTTPException(status_code=404, detail="Database not found")

    generator = ChallengeGenerator(
        industry=database["industry"],  # type: ignore
        db_schema=database["db_schema"],  # type: ignore
        topics=body.topics or "",
        level=body.level,
        context=body.context or "",
        max_retries=3,
    )

    result = await generator.generate()

    row = (
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
                "solution": result["solution"],
                "public": False,
            }
        )
        .execute()
    )

    return ChallengeResponse.model_validate(row.data[0])


def submit_challenge(challenge_id: str, user_id: str, body: ChallengeSubmitRequest):
    challenge = get_challenge(challenge_id, user_id)
    database = get_database(body.database_id, user_id)

    user_result = query_database(database.db_path, body.dql)
    solution_result = query_database(database.db_path, challenge.solution)

    solved = user_result.columns == solution_result.columns and sorted(
        map(tuple, user_result.rows)
    ) == sorted(map(tuple, solution_result.rows))

    return ChallengeSubmitResponse.model_validate(
        {"solved": solved, "result": user_result}
    )


async def hint_challenge(
    challenge_id: str, user_id: str, body: ChallengeSubmitRequest
) -> ChallengeHintResponse:
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

    text: str = message.content[0].text  # type: ignore
    try:
        data = str_json_to_dict(text)
        return ChallengeHintResponse.model_validate(data)
    except (json.JSONDecodeError, ValueError):
        print(f"[hint] AI returned non-JSON, falling back to raw text:\n{text}")
        return ChallengeHintResponse(dql=text.strip())
