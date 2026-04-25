from fastapi import APIRouter, Depends
from app.auth import verify_token
from app.schemas.database import (
    DatabaseGenerateRequest,
    DatabaseGenerateResponse,
    DatabaseResponse,
)
from app.services.database.functions import generate_database
from app.supabase import db


router = APIRouter()


@router.post("")
async def database_generate_endpoint(
    body: DatabaseGenerateRequest, user_id: str = Depends(verify_token)
) -> DatabaseGenerateResponse:
    return await generate_database(user_id, body)


@router.get("/databases")
async def get_databases_endpoint(
    user_id: str = Depends(verify_token),
) -> list[DatabaseResponse]:
    result = db.table("databases").select("*").eq("user_id", user_id).execute()
    return [DatabaseResponse.model_validate(row) for row in result.data]
