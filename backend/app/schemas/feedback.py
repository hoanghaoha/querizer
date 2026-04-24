from enum import Enum
from pydantic import BaseModel


class FeedbackType(str, Enum):
    GENERAL = "general"
    FEATURE = "features"
    BUG = "bug"


class FeedbackRequest(BaseModel):
    type: FeedbackType
    message: str
