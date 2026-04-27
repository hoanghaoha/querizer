from fastapi import APIRouter, Depends

from app.auth import verify_token
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard import get_dashboard

router = APIRouter()


@router.get("")
def dashboard_endpoint(user_id: str = Depends(verify_token)) -> DashboardResponse:
    return get_dashboard(user_id)
