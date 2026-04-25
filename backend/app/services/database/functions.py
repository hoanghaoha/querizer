import os
from fastapi import HTTPException
from app.schemas.database import DatabaseGenerateRequest, DatabaseGenerateResponse
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

        _upload_to_storage(generator.db_path, f"{user_id}/{generator.database_id}")
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
                "db_path": generator.db_path,
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
