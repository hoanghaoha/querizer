from enum import Enum
from typing import Any
from pydantic.main import BaseModel


class DatabaseIndustry(str, Enum):
    ECOM = "E-commerce"
    HEALTHCARE = "Healthcare"
    FINANCE = "Finance"
    RETAIL = "Retail"
    TECH = "Technology"
    EDU = "Education"
    LOGISTICS = "Logistics"
    MR = "Market Research"
    MANUFACTURING = "Manufacturing"
    RE = "Real Estate"
    MEDIA = "Media & Entertainment"
    HR = "HR / Workforce"
    FNB = "Food & Beverage"
    OTHER = "Other"


class DatabaseSize(str, Enum):
    SMALL = "Small"
    MEDIUM = "Medium"
    LARGE = "Large"


class DatabaseResponse(BaseModel):
    id: str
    user_id: str
    name: str
    industry: DatabaseIndustry
    size: DatabaseSize
    description: str
    row_count: int
    db_schema: dict
    db_path: str
    created_at: str


class DatabaseGenerateRequest(BaseModel):
    name: str
    industry: DatabaseIndustry
    size: DatabaseSize
    description: str | None = None


class DatabaseGenerateResponse(BaseModel):
    id: str


class DatabaseQueryRequest(BaseModel):
    dql: str


class DatabaseQueryResponse(BaseModel):
    rows: list[list[Any]]
    columns: list[str]


class UpdateDatabaseRequest(BaseModel):
    name: str
    description: str
