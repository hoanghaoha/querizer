import uuid
from fastapi import HTTPException
from app.schemas.challenge import ChallengeGenerateRequest, ChallengeResponse, UpdateChallengeRequest
from app.services.challenge.utils import ChallengeGenerator
from app.supabase import db


def get_challenges(user_id: str, database_id: str | None = None) -> list[ChallengeResponse]:
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


def update_challenge(challenge_id: str, user_id: str, body: UpdateChallengeRequest) -> ChallengeResponse:
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
    db.table("challenges").delete().eq("id", challenge_id).eq("user_id", user_id).execute()


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
