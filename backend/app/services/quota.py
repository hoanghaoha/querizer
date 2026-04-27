from datetime import datetime, timezone
from typing import Literal

from fastapi import HTTPException

from app.services._supabase import first, one
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
    user_result = db.table("users").select("plan").eq("id", user_id).single().execute()
    plan: str = one(user_result)["plan"] if user_result.data else "Free"
    limit = PLAN_LIMITS.get(plan, PLAN_LIMITS["Free"])[action]

    if limit is None:
        return

    now = datetime.now(timezone.utc)
    usage_result = (
        db.table("user_usages")
        .select(f"reset_at,{ACTION_FIELD[action]}")
        .eq("user_id", user_id)
        .execute()
    )

    if not usage_result.data:
        return

    row = first(usage_result)
    reset_at = datetime.fromisoformat(row["reset_at"])

    if reset_at <= now:
        return

    used: int = row.get(ACTION_FIELD[action]) or 0
    if used >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"Monthly limit reached: {limit} {ACTION_LABEL[action]} on the {plan} plan",
        )
