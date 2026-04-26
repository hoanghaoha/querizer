from enum import Enum

from pydantic import BaseModel


class ChallengeLevel(str, Enum):
    BEGINNER = "Beginner"
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"
    HELL = "Hell"


class ChallengeGenerateRequest(BaseModel):
    database_id: str
    level: ChallengeLevel
    topics: str | None
    context: str | None


class UpdateChallengeRequest(BaseModel):
    public: bool


class ChallengeResponse(BaseModel):
    id: str
    database_id: str
    user_id: str
    name: str
    topics: list[str]
    description: str
    level: ChallengeLevel
    solution: str
    public: bool
    created_at: str
