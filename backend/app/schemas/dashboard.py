from pydantic import BaseModel


class LevelCount(BaseModel):
    level: str
    count: int


class IndependenceRate(BaseModel):
    clean: int
    hinted: int
    peeked: int


class ActivityDay(BaseModel):
    date: str
    count: int


class DashboardResponse(BaseModel):
    total_score: int
    tier: str
    tier_min: int
    tier_max: int | None
    solved: int
    attempted: int
    solve_rate: float
    current_streak: int
    longest_streak: int
    by_level: list[LevelCount]
    independence: IndependenceRate
    activity: list[ActivityDay]
