from fastapi import HTTPException

from app.services._utils import now_iso
from app.supabase import db
from app.schemas.user import (
    UserRequest,
    UserResponse,
    UserUpdateRequest,
)


def get_or_create_user(user_id: str, body: UserRequest) -> UserResponse:
    users_result = db.table("users").select("*").eq("id", user_id).execute()

    if users_result:
        return UserResponse.model_validate(users_result.data[0])

    users_result = (
        db.table("users")
        .insert(
            {
                "id": user_id,
                "email": body.email,
                "name": body.name,
                "avatar_url": body.avatar_url,
                "created_at": now_iso(),
            }
        )
        .execute()
    )

    return UserResponse.model_validate(users_result.data[0])


def update_user(user_id: str, body: UserUpdateRequest) -> UserResponse:
    update_data = body.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    users_result = db.table("users").update(update_data).eq("id", user_id).execute()

    return UserResponse.model_validate(users_result.data[0])
