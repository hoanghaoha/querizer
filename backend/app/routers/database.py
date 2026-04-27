from fastapi import APIRouter, Depends
from app.auth import verify_token
from app.schemas.database import (
    DatabaseGenerateRequest,
    DatabaseGenerateResponse,
    DatabaseQueryRequest,
    DatabaseQueryResponse,
    DatabaseResponse,
    DatabaseUpdateRequest,
)
from app.services.database.functions import (
    delete_database,
    generate_database,
    get_database,
    get_databases,
    query_database,
    update_database,
)


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
    return get_databases(user_id)


@router.get("/{database_id}")
async def get_database_endpoint(
    database_id: str,
    user_id: str = Depends(verify_token),
) -> DatabaseResponse:
    return get_database(database_id, user_id)


@router.patch("/{database_id}")
async def update_database_endpoint(
    database_id: str, body: DatabaseUpdateRequest, user_id: str = Depends(verify_token)
) -> DatabaseResponse:
    return update_database(database_id, user_id, body)


@router.delete("/{database_id}", status_code=204)
async def delete_database_endpoint(
    database_id: str, user_id: str = Depends(verify_token)
) -> None:
    delete_database(database_id, user_id)


@router.post("/query/{database_id}")
async def query_database_endpoint(
    database_id: str, body: DatabaseQueryRequest, user_id: str = Depends(verify_token)
) -> DatabaseQueryResponse:
    database = get_database(database_id, user_id)

    return query_database(database.db_path, body.dql)
