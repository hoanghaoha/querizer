from enum import Enum
from typing import Any
from pydantic.main import BaseModel


class DatabaseSize(str, Enum):
    SMALL = "Small"
    MEDIUM = "Medium"
    LARGE = "Large"


class DatabaseResponse(BaseModel):
    id: str
    user_id: str
    name: str
    industry: str
    size: DatabaseSize
    description: str
    row_count: int
    db_schema: dict
    db_path: str
    created_at: str


class DatabaseGenerateRequest(BaseModel):
    name: str
    industry: str
    size: DatabaseSize
    description: str | None = None


class DatabaseQueryRequest(BaseModel):
    dql: str


class DatabaseQueryResponse(BaseModel):
    rows: list[list[Any]]
    columns: list[str]


class DatabaseUpdateRequest(BaseModel):
    name: str
    description: str
