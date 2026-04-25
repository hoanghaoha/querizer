from fastapi import APIRouter, Depends
from app.auth import verify_token
from app.schemas.database import DatabaseGenerateRequest, DatabaseGenerateResponse
from app.services.database.functions import generate_database


router = APIRouter()


@router.post("")
async def database_generate_endpoint(
    body: DatabaseGenerateRequest, user_id: str = Depends(verify_token)
) -> DatabaseGenerateResponse:
    return await generate_database(user_id, body)
