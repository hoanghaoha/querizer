from datetime import datetime, timezone
from typing import Any, cast

from fastapi import HTTPException

from app.services._utils import now_iso
from app.supabase import db
from app.schemas.user import (
    UserPlan,
    UserPlanStatus,
    UserRequest,
    UserResponse,
    UserUpdateRequest,
)


def _downgrade_if_expired(user: dict[str, Any]) -> dict[str, Any]:
    if user.get("plan") == UserPlan.FREE:
        return user
    if user.get("plan_status") != UserPlanStatus.CANCELED:
        return user
    expires_at = user.get("plan_expires_at")
    if not expires_at or datetime.fromisoformat(expires_at) > datetime.now(timezone.utc):
        return user
    db.table("users").update({"plan": UserPlan.FREE}).eq("id", user["id"]).execute()
    return {**user, "plan": UserPlan.FREE}


def get_or_create_user(user_id: str, body: UserRequest) -> tuple[UserResponse, bool]:
    """Returns (user, is_new)."""
    users_result = db.table("users").select("*").eq("id", user_id).execute()

    if users_result.data:
        user = _downgrade_if_expired(cast(dict[str, Any], users_result.data[0]))
        return UserResponse.model_validate(user), False

    users_result = (
        db.table("users")
        .insert(
            {
                "id": user_id,
                "email": body.email,
                "name": body.name,
                "avatar_url": body.avatar_url,
                "expertise": None,
                "sql_level": None,
                "plan": UserPlan.FREE,
                "plan_status": UserPlanStatus.ACTIVE,
                "plan_expires_at": None,
                "polar_customer_id": None,
                "created_at": now_iso(),
            }
        )
        .execute()
    )

    return UserResponse.model_validate(users_result.data[0]), True


def update_user(user_id: str, body: UserUpdateRequest) -> UserResponse:
    update_data = body.model_dump(exclude_none=True)

    if not update_data:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    users_result = db.table("users").update(update_data).eq("id", user_id).execute()

    return UserResponse.model_validate(users_result.data[0])
