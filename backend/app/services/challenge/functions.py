import uuid
from fastapi import HTTPException
from app.schemas.challenge import ChallengeGenerateRequest, ChallengeResponse
from app.services.challenge.utils import ChallengeGenerator
from app.supabase import db


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
