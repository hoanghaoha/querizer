from datetime import datetime, timezone
from typing import Any, Literal, cast

from fastapi import HTTPException

from app.schemas.user import UserPlan, UserPlanStatus
from app.supabase import db

PLAN_LIMITS: dict[str, dict[str, int | None]] = {
    "Free": {"db": 2, "challenge": 10, "hint": 30},
    "Pro": {"db": 10, "challenge": 30, "hint": 90},
    "Max": {"db": None, "challenge": None, "hint": None},
}

QuotaAction = Literal["db", "challenge", "hint"]

ACTION_FIELD: dict[QuotaAction, str] = {
    "db": "n_db_generated",
    "challenge": "n_challenge_generated",
    "hint": "n_hints_used",
}

ACTION_LABEL: dict[QuotaAction, str] = {
    "db": "database generations",
    "challenge": "challenge generations",
    "hint": "hints",
}


def check_quota(user_id: str, action: QuotaAction) -> None:
    users_result = (
        db.table("users")
        .select("plan,plan_status,plan_expires_at")
        .eq("id", user_id)
        .execute()
    )
    user = cast(dict[str, Any], users_result.data[0]) if users_result.data else {}
    raw_plan: str = user["plan"]
    now = datetime.now(timezone.utc)

    if raw_plan != UserPlan.FREE:
        status = user.get("plan_status")
        expires_at = user.get("plan_expires_at")
        if status == UserPlanStatus.ACTIVE:
            plan = raw_plan
        elif status == UserPlanStatus.CANCELED and expires_at:
            plan = (
                raw_plan if datetime.fromisoformat(expires_at) > now else UserPlan.FREE
            )
        else:
            plan = UserPlan.FREE
    else:
        plan = UserPlan.FREE

    limit = PLAN_LIMITS.get(plan, PLAN_LIMITS["Free"])[action]

    if limit is None:
        return

    usage_result = (
        db.table("user_usages")
        .select(f"reset_at,{ACTION_FIELD[action]}")
        .eq("user_id", user_id)
        .execute()
    )

    if not usage_result.data:
        return

    usage = cast(dict[str, Any], usage_result.data[0])

    reset_at = datetime.fromisoformat(usage["reset_at"])

    if reset_at <= now:
        return

    used: int = usage.get(ACTION_FIELD[action]) or 0
    if used >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"Monthly limit reached: {limit} {ACTION_LABEL[action]} on the {plan} plan",
        )
