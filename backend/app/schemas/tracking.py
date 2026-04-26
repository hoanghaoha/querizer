from pydantic import BaseModel


class UsageResponse(BaseModel):
    year: int
    month: int
    n_db_generated: int = 0
    n_challenge_generated: int = 0
    n_hints_used: int = 0


class AttemptResponse(BaseModel):
    challenge_id: str
    solved: bool = False
    n_hints: int = 0
    solution_used: bool = False
    score: int = 0
