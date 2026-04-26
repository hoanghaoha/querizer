import os
import sqlite3
import tempfile
from fastapi import HTTPException
from app.schemas.database import (
    DatabaseGenerateRequest,
    DatabaseGenerateResponse,
    DatabaseQueryResponse,
    DatabaseResponse,
    UpdateDatabaseRequest,
)
from app.services.database.utils import DatabaseGenerator
from app.supabase import db
from app.config import settings


async def generate_database(
    user_id: str, database_generate_request: DatabaseGenerateRequest
) -> DatabaseGenerateResponse:
    _ensure_bucket_exists("databases")
    os.makedirs(settings.databases_path, exist_ok=True)

    generator = DatabaseGenerator(database_generate_request)
    uploaded = False

    try:
        await generator.generate()

        storage_path = f"{user_id}/{generator.database_id}"
        _upload_to_storage(generator.db_path, storage_path)
        uploaded = True

        db.table("databases").insert(
            {
                "id": generator.database_id,
                "user_id": user_id,
                "name": generator.name,
                "industry": generator.industry,
                "description": generator.description,
                "size": generator.size,
                "row_count": generator.row_count,
                "db_schema": generator.schema,
                "db_path": storage_path,
            }
        ).execute()

        return DatabaseGenerateResponse.model_validate({"id": generator.database_id})

    except HTTPException:
        raise
    except Exception as e:
        if uploaded:
            try:
                db.storage.from_("databases").remove(
                    [f"{user_id}/{generator.database_id}"]
                )
            except Exception:
                pass
        raise HTTPException(
            status_code=500, detail=f"Database generation failed: {e}"
        ) from e

    finally:
        if os.path.exists(generator.db_path):
            os.remove(generator.db_path)


def _ensure_bucket_exists(bucket_name: str) -> None:
    try:
        names = [b.name for b in db.storage.list_buckets()]
        if bucket_name not in names:
            raise HTTPException(
                status_code=503,
                detail=f"Storage bucket '{bucket_name}' does not exist",
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Cannot reach storage: {e}") from e


def _upload_to_storage(local_path: str, storage_path: str) -> None:
    try:
        with open(local_path, "rb") as f:
            db.storage.from_("databases").upload(
                path=storage_path,
                file=f,
                file_options={"content-type": "application/octet-stream"},
            )
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail=f"Cannot upload to storage: {storage_path}, {e}",
        ) from e


def get_database(database_id: str, user_id: str) -> DatabaseResponse:
    result = (
        db.table("databases")
        .select("*")
        .eq("user_id", user_id)
        .eq("id", database_id)
        .single()
        .execute()
    )
    return DatabaseResponse.model_validate(result.data)


def query_database(db_path: str, dql: str) -> DatabaseQueryResponse:
    res = db.storage.from_("databases").download(db_path)

    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        tmp.write(res)
        tmp_path = tmp.name

    try:
        conn = sqlite3.connect(tmp_path)
        cursor = conn.cursor()
        cursor.execute(dql)
        rows = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        conn.close()
    finally:
        os.remove(tmp_path)

    return DatabaseQueryResponse.model_validate({"rows": rows, "columns": columns})


def update_database(body: UpdateDatabaseRequest, database_id: str, user_id: str):
    existing = (
        db.table("databases")
        .select("id")
        .eq("id", database_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not existing.data:
        raise HTTPException(status_code=404, detail="Database not found")

    updates = body.model_dump(exclude_none=True)

    result = (
        db.table("databases")
        .update(updates)
        .eq("id", database_id)
        .eq("user_id", user_id)
        .execute()
    )

    return DatabaseResponse.model_validate(result.data[0])


def delete_database(database_id: str, user_id: str) -> None:
    result = (
        db.table("databases")
        .select("id, db_path")
        .eq("id", database_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Database not found")

    db.table("databases").delete().eq("id", database_id).eq(
        "user_id", user_id
    ).execute()

    db.storage.from_("databases").remove([result.data["db_path"]])  # type: ignore
