from app.supabase import db
from app.schemas.user import (
    UserRequest,
    UserResponse,
    UserUpdateRequest,
)


def create_or_get_user(
    user_id: str,
    user_request: UserRequest,
) -> UserResponse:
    result = (
        db.table("users")
        .upsert(
            {
                "id": user_id,
                "email": user_request.email,
                "name": user_request.name,
                "avatar_url": user_request.avatar_url,
            }
        )
        .execute()
    )

    return UserResponse.model_validate(result.data[0])


def update_user(
    user_id,
    user_update_request: UserUpdateRequest,
):
    update_data = user_update_request.model_dump(exclude_none=True)

    if not update_data:
        raise ValueError("No fields provided to update")

    result = db.table("users").update(update_data).eq("id", user_id).execute()

    if not result.data:
        raise ValueError(f"User id {user_id} not found")

    return UserResponse.model_validate(result.data[0])
