from datetime import date, datetime, timedelta
from typing import Any, cast

from app.schemas.dashboard import (
    ActivityDay,
    DashboardResponse,
    IndependenceRate,
    LevelCount,
)
from app.supabase import db

TIERS = [
    ("Bronze", 0, 150),
    ("Silver", 150, 500),
    ("Gold", 500, 1500),
    ("Platinum", 1500, 3500),
    ("Diamond", 3500, 7000),
    ("Master", 7000, 12000),
    ("Challenger", 12000, None),
]

LEVEL_ORDER = ["Beginner", "Easy", "Medium", "Hard", "Hell"]


def _get_tier(score: int) -> tuple[str, int, int | None]:
    for name, tier_min, tier_max in TIERS:
        if tier_max is None or score < tier_max:
            return name, tier_min, tier_max
    return "Challenger", 12000, None


def _compute_streaks(solved_dates: set[date]) -> tuple[int, int]:
    if not solved_dates:
        return 0, 0

    today = date.today()
    check = today if today in solved_dates else today - timedelta(days=1)
    current = 0
    while check in solved_dates:
        current += 1
        check -= timedelta(days=1)

    sorted_dates = sorted(solved_dates)
    longest, run = 1, 1
    for i in range(1, len(sorted_dates)):
        if sorted_dates[i] - sorted_dates[i - 1] == timedelta(days=1):
            run += 1
            longest = max(longest, run)
        else:
            run = 1

    return current, longest


def get_dashboard(user_id: str) -> DashboardResponse:
    result = (
        db.table("challenge_attempts")
        .select("solved, n_hints, solution_used, score, created_at, challenges(level)")
        .eq("user_id", user_id)
        .execute()
    )
    attempts = result.data or []

    attempts = cast(list[dict[str, Any]], attempts)

    total_score = sum(a["score"] for a in attempts if a["solved"])
    solved_count = sum(1 for a in attempts if a["solved"])
    attempted_count = len(attempts)
    solve_rate = (
        round(solved_count / attempted_count * 100, 1) if attempted_count else 0.0
    )

    tier, tier_min, tier_max = _get_tier(total_score)

    level_counts: dict[str, int] = {}
    for a in attempts:
        if a["solved"] and a.get("challenges"):
            level = a["challenges"]["level"]
            level_counts[level] = level_counts.get(level, 0) + 1
    by_level = [
        LevelCount(level=level, count=level_counts.get(level, 0))
        for level in LEVEL_ORDER
    ]

    clean = sum(
        1
        for a in attempts
        if a["solved"] and a["n_hints"] == 0 and not a["solution_used"]
    )
    hinted = sum(
        1
        for a in attempts
        if a["solved"] and a["n_hints"] > 0 and not a["solution_used"]
    )
    peeked = sum(1 for a in attempts if a["solved"] and a["solution_used"])

    solved_dates: set[date] = set()
    activity_map: dict[date, int] = {}
    for a in attempts:
        if a["solved"] and a.get("created_at"):
            d = datetime.fromisoformat(a["created_at"]).date()
            solved_dates.add(d)
            activity_map[d] = activity_map.get(d, 0) + 1

    current_streak, longest_streak = _compute_streaks(solved_dates)

    today = date.today()
    activity = [
        ActivityDay(
            date=str(today - timedelta(days=83 - i)),
            count=activity_map.get(today - timedelta(days=83 - i), 0),
        )
        for i in range(84)
    ]

    return DashboardResponse(
        total_score=total_score,
        tier=tier,
        tier_min=tier_min,
        tier_max=tier_max,
        solved=solved_count,
        attempted=attempted_count,
        solve_rate=solve_rate,
        current_streak=current_streak,
        longest_streak=longest_streak,
        by_level=by_level,
        independence=IndependenceRate(clean=clean, hinted=hinted, peeked=peeked),
        activity=activity,
    )
