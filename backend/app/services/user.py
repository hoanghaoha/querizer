from app.supabase import db
from app.schemas.user import (
    UserRequest,
    UserResponse,
    UserUpdateRequest,
)


def get_or_create_user(user_id: str, body: UserRequest) -> UserResponse:
    upsert_result = (
        db.table("users")
        .upsert(
            {
                "id": user_id,
                "email": body.email,
                "name": body.name,
                "avatar_url": body.avatar_url,
            }
        )
        .execute()
    )

    return UserResponse.model_validate(upsert_result.data[0])


def update_user(user_id: str, body: UserUpdateRequest) -> UserResponse:
    update_data = body.model_dump(exclude_none=True)

    if not update_data:
        raise ValueError("No fields provided to update")

    update_result = db.table("users").update(update_data).eq("id", user_id).execute()

    if not update_result.data:
        raise ValueError(f"User id {user_id} not found")

    return UserResponse.model_validate(update_result.data[0])
