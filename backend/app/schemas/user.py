from enum import Enum
from pydantic import BaseModel


class UserRequest(BaseModel):
    email: str
    name: str | None = None
    avatar_url: str | None = None


class UserPlan(str, Enum):
    FREE = "Free"
    PRO = "Pro"
    MAX = "Max"


class UserPlanStatus(str, Enum):
    ACTIVE = "active"
    CANCELED = "canceled"


class UserSqlLevel(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class UserUpdateRequest(BaseModel):
    name: str | None = None
    expertise: str | None = None
    sql_level: UserSqlLevel | None = None
    plan: UserPlan | None = None
    plan_status: UserPlanStatus | None = None
    plan_expires_at: str | None = None
    polar_customer_id: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str | None = None
    avatar_url: str | None = None
    expertise: str | None = None
    sql_level: str | None = None
    plan: UserPlan
    plan_status: UserPlanStatus
    plan_expires_at: str | None = None
    polar_customer_id: str | None = None
    created_at: str
