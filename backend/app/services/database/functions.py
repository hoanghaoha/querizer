import logging
import os
import sqlite3
import tempfile
from typing import Any, cast
from fastapi import HTTPException
from app.schemas.database import (
    DatabaseGenerateRequest,
    DatabaseQueryResponse,
    DatabaseResponse,
    DatabaseUpdateRequest,
)
from app.services._utils import now_iso
from app.services.database._utils import DatabaseGenerator
from app.services.quota import check_quota
from app.services.tracking import track_db_generated
from app.supabase import db
from app.config import settings

logger = logging.getLogger(__name__)

BUCKET = "databases"


async def generate_database(
    user_id: str, body: DatabaseGenerateRequest
) -> DatabaseResponse:
    check_quota(user_id, "db")
    _ensure_bucket()
    os.makedirs(settings.databases_path, exist_ok=True)

    generator = DatabaseGenerator(body)
    uploaded = False

    try:
        await generator.generate()

        storage_path = f"{user_id}/{generator.database_id}"
        _upload_file(generator.db_path, storage_path)
        uploaded = True

        databases_result = (
            db.table("databases")
            .insert(
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
                    "created_at": now_iso(),
                }
            )
            .execute()
        )

        if not databases_result.data:
            raise HTTPException(status_code=404, detail="Database not found")

        database = cast(dict[str, Any], databases_result.data[0])

        track_db_generated(user_id, database["id"])
        return DatabaseResponse.model_validate(database)

    except HTTPException:
        raise
    except Exception as e:
        if uploaded:
            try:
                db.storage.from_(BUCKET).remove([f"{user_id}/{generator.database_id}"])
            except Exception:
                pass
        logger.exception("database generation failed")
        raise HTTPException(status_code=500, detail="Database generation failed") from e

    finally:
        if os.path.exists(generator.db_path):
            os.remove(generator.db_path)


def get_databases(user_id: str) -> list[DatabaseResponse]:
    databases_result = (
        db.table("databases").select("*").eq("user_id", user_id).execute()
    )
    return [DatabaseResponse.model_validate(row) for row in databases_result.data]


def get_database(database_id: str, user_id: str) -> DatabaseResponse:
    databases_result = (
        db.table("databases")
        .select("*")
        .eq("user_id", user_id)
        .eq("id", database_id)
        .execute()
    )

    if not databases_result.data:
        raise HTTPException(status_code=404, detail="Database not found")

    database = cast(dict[str, Any], databases_result.data[0])

    return DatabaseResponse.model_validate(database)


def update_database(
    database_id: str, user_id: str, body: DatabaseUpdateRequest
) -> DatabaseResponse:
    assert get_database(database_id, user_id)

    updates = body.model_dump(exclude_none=True)

    databases_result = (
        db.table("databases")
        .update(updates)
        .eq("id", database_id)
        .eq("user_id", user_id)
        .execute()
    )

    if not databases_result.data:
        raise HTTPException(status_code=404, detail="Database not found")

    database = cast(dict[str, Any], databases_result.data[0])

    return DatabaseResponse.model_validate(database)


def delete_database(database_id: str, user_id: str) -> None:
    database = get_database(database_id, user_id)

    db.table("databases").delete().eq("id", database_id).eq(
        "user_id", user_id
    ).execute()

    db.storage.from_(BUCKET).remove([database.db_path])


def query_database(db_path: str, dql: str) -> DatabaseQueryResponse:
    try:
        file_bytes = db.storage.from_(BUCKET).download(db_path)
    except Exception as e:
        logger.exception("cannot reach storage")
        raise HTTPException(status_code=503, detail="Cannot reach storage") from e

    with tempfile.NamedTemporaryFile(suffix=".db", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        conn = sqlite3.connect(tmp_path)
        cursor = conn.cursor()
        try:
            cursor.execute(dql)
            rows = cursor.fetchall()
            columns = (
                [col[0] for col in cursor.description] if cursor.description else []
            )
        except sqlite3.Error as e:
            raise HTTPException(status_code=400, detail=str(e)) from e
        finally:
            conn.close()
    finally:
        os.remove(tmp_path)

    return DatabaseQueryResponse.model_validate({"rows": rows, "columns": columns})


def _ensure_bucket() -> None:
    try:
        names = [b.name for b in db.storage.list_buckets()]
        if BUCKET not in names:
            logger.error("storage bucket missing")
            raise HTTPException(
                status_code=503,
                detail=f"Storage bucket '{BUCKET}' does not exist",
            )
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("cannot reach storage")
        raise HTTPException(status_code=503, detail="Cannot reach storage") from e


def _upload_file(local_path: str, storage_path: str) -> None:
    try:
        with open(local_path, "rb") as f:
            db.storage.from_(BUCKET).upload(
                path=storage_path,
                file=f,
                file_options={"content-type": "application/octet-stream"},
            )
    except Exception as e:
        logger.exception("cannot upload to storage")
        raise HTTPException(status_code=503, detail="Cannot upload to storage") from e
