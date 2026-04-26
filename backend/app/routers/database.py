from fastapi import APIRouter, Depends
from app.auth import verify_token
from app.schemas.database import (
    DatabaseGenerateRequest,
    DatabaseGenerateResponse,
    DatabaseQueryRequest,
    DatabaseQueryResponse,
    DatabaseResponse,
    UpdateDatabaseRequest,
)
from app.services.database.functions import (
    delete_database,
    generate_database,
    get_database,
    query_database,
    update_database,
)
from app.supabase import db


router = APIRouter()


@router.post("")
async def generate_database_endpoint(
    body: DatabaseGenerateRequest, user_id: str = Depends(verify_token)
) -> DatabaseGenerateResponse:
    return await generate_database(user_id, body)


@router.get("/databases")
async def get_databases_endpoint(
    user_id: str = Depends(verify_token),
) -> list[DatabaseResponse]:
    result = db.table("databases").select("*").eq("user_id", user_id).execute()
    return [DatabaseResponse.model_validate(row) for row in result.data]


@router.get("/{database_id}")
async def get_database_endpoint(
    database_id: str,
    user_id: str = Depends(verify_token),
) -> DatabaseResponse:
    return get_database(database_id, user_id)


@router.post("/query/{database_id}")
async def query_database_endpoint(
    body: DatabaseQueryRequest, database_id: str, user_id: str = Depends(verify_token)
) -> DatabaseQueryResponse:
    database = get_database(database_id, user_id)

    return query_database(database.db_path, body.dql)


@router.patch("/{database_id}")
async def update_database_endpoint(
    body: UpdateDatabaseRequest, database_id: str, user_id: str = Depends(verify_token)
):
    return update_database(body, database_id, user_id)


@router.delete("/{database_id}")
async def delete_database_endpoint(
    database_id: str, user_id: str = Depends(verify_token)
):
    return delete_database(database_id, user_id)
