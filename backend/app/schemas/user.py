from pydantic import BaseModel


class UserRequest(BaseModel):
    email: str
    name: str | None = None
    avatar_url: str | None = None
    expertise: str | None = None
    sql_level: str | None = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: str | None = None
    avatar_url: str | None = None
    expertise: str | None = None
    sql_level: str | None = None
