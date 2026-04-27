import uuid
from datetime import datetime, timezone

from app.services._supabase import first
from app.supabase import db

LEVEL_BASE_SCORE = {
    "Beginner": 10,
    "Easy": 20,
    "Medium": 40,
    "Hard": 70,
    "Hell": 100,
}


def compute_score(level: str, n_hints: int, solution_used: bool) -> int:
    base = LEVEL_BASE_SCORE.get(level, 10)
    if solution_used:
        return max(1, base // 10)
    hint_penalty = round(base * 0.05)
    return max(1, base - n_hints * hint_penalty)


def track_hint_used(user_id: str, challenge_id: str):
    _log_action(user_id, "hint_used", {"challenge_id": challenge_id})

    attempt = _get_attempt(user_id, challenge_id)
    if attempt:
        db.table("challenge_attempts").update(
            {
                "n_hints": attempt["n_hints"] + 1,
                "updated_at": _now_iso(),
            }
        ).eq("id", attempt["id"]).execute()
    else:
        db.table("challenge_attempts").insert(
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "challenge_id": challenge_id,
                "solved": False,
                "n_hints": 1,
                "solution_used": False,
                "score": 0,
            }
        ).execute()

    _increment_usage(user_id, n_hints_used=1)


def track_solution_viewed(user_id: str, challenge_id: str):
    _log_action(user_id, "solution_viewed", {"challenge_id": challenge_id})

    attempt = _get_attempt(user_id, challenge_id)
    if attempt:
        db.table("challenge_attempts").update(
            {
                "solution_used": True,
                "updated_at": _now_iso(),
            }
        ).eq("id", attempt["id"]).execute()
    else:
        db.table("challenge_attempts").insert(
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "challenge_id": challenge_id,
                "solved": False,
                "n_hints": 0,
                "solution_used": True,
                "score": 0,
            }
        ).execute()


def track_submission(user_id: str, challenge_id: str, solved: bool, level: str):
    action_type = "submit_success" if solved else "submit_failed"
    _log_action(user_id, action_type, {"challenge_id": challenge_id})

    if not solved:
        return

    attempt = _get_attempt(user_id, challenge_id)
    if attempt:
        if not attempt["solved"]:
            score = compute_score(level, attempt["n_hints"], attempt["solution_used"])
            db.table("challenge_attempts").update(
                {
                    "solved": True,
                    "score": score,
                    "updated_at": _now_iso(),
                }
            ).eq("id", attempt["id"]).execute()
    else:
        score = compute_score(level, 0, False)
        db.table("challenge_attempts").insert(
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "challenge_id": challenge_id,
                "solved": True,
                "n_hints": 0,
                "solution_used": False,
                "score": score,
            }
        ).execute()


def track_db_generated(user_id: str, database_id: str):
    _log_action(user_id, "db_generated", {"database_id": database_id})
    _increment_usage(user_id, n_db_generated=1)


def track_challenge_generated(user_id: str, challenge_id: str):
    _log_action(user_id, "challenge_generated", {"challenge_id": challenge_id})
    _increment_usage(user_id, n_challenge_generated=1)


def _log_action(user_id: str, action_type: str, metadata: dict):
    db.table("user_actions").insert(
        {
            "id": str(uuid.uuid4()),
            "user_id": user_id,
            "action_type": action_type,
            "metadata": metadata,
        }
    ).execute()


def _cycle_reset_at() -> str:
    from dateutil.relativedelta import relativedelta

    return (datetime.now(timezone.utc) + relativedelta(months=1)).isoformat()


def _increment_usage(user_id: str, **fields: int) -> None:
    now = datetime.now(timezone.utc)

    usage_result = db.table("user_usages").select("*").eq("user_id", user_id).execute()

    if usage_result.data:
        row = first(usage_result)
        reset_at = datetime.fromisoformat(row["reset_at"])
        if reset_at <= now:
            db.table("user_usages").update(
                {
                    "n_db_generated": 0,
                    "n_challenge_generated": 0,
                    "n_hints_used": 0,
                    "reset_at": _cycle_reset_at(),
                    **{k: v for k, v in fields.items()},
                }
            ).eq("id", row["id"]).execute()
        else:
            updates = {k: (row.get(k) or 0) + v for k, v in fields.items()}
            db.table("user_usages").update(updates).eq("id", row["id"]).execute()
    else:
        db.table("user_usages").insert(
            {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "reset_at": _cycle_reset_at(),
                **fields,
            }
        ).execute()


def _get_attempt(user_id: str, challenge_id: str) -> dict | None:
    attempt_result = (
        db.table("challenge_attempts")
        .select("*")
        .eq("user_id", user_id)
        .eq("challenge_id", challenge_id)
        .execute()
    )
    return first(attempt_result) if attempt_result.data else None


def _now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()
