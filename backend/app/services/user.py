from app.supabase import db
from app.schemas.user import UserPlan, UserResponse, UserSqlLevel


def create_or_get_user(
    user_id: str,
    email: str,
    name: str | None,
    avatar_url: str | None,
) -> UserResponse:
    result = (
        db.table("users")
        .upsert(
            {
                "id": user_id,
                "email": email,
                "name": name,
                "avatar_url": avatar_url,
            }
        )
        .execute()
    )

    return UserResponse.model_validate(result.data[0])


def update_user(
    user_id,
    name: str | None,
    expertise: str | None,
    sql_level: UserSqlLevel | None,
    plan: UserPlan | None,
):
    return UserResponse.model_validate({})
