from fastapi import APIRouter, Depends

from app.auth import verify_token
from app.schemas.feedback import FeedbackRequest
from app.services._utils import now_iso
from app.supabase import db

router = APIRouter()


@router.post("")
def feedback_endpoint(body: FeedbackRequest, user_id: str = Depends(verify_token)):
    db.table("feedbacks").insert(
        {
            "user_id": user_id,
            "type": body.type,
            "message": body.message,
            "created_at": now_iso(),
        }
    ).execute()
