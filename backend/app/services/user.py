from app.supabase import db
from app.schemas.user import UserResponse


def create_or_get_user(
    user_id: str,
    email: str,
    name: str | None,
    avatar_url: str | None,
    expertise: str | None,
    sql_level: str | None,
) -> UserResponse:
    result = (
        db.table("users")
        .upsert(
            {
                "id": user_id,
                "email": email,
                "name": name,
                "avatar_url": avatar_url,
                "expertise": expertise,
                "sql_level": sql_level,
            }
        )
        .execute()
    )

    return UserResponse(**result.data[0])
