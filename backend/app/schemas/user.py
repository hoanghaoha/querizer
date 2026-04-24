from enum import Enum
from pydantic import BaseModel


class UserRequest(BaseModel):
    email: str
    name: str | None = None
    avatar_url: str | None = None


class UserPlan(str, Enum):
    FREE = "Free"
    PRO = "Pro"


class UserSqlLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class UserUpdateRequest(BaseModel):
    name: str | None = None
    expertise: str | None = None
    sql_level: UserSqlLevel | None = None
    plan: UserPlan | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str | None = None
    plan: UserPlan
    avatar_url: str | None = None
    expertise: str | None = None
    sql_level: str | None = None
