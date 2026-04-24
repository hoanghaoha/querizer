from fastapi import APIRouter, Depends
from app.auth import verify_token
from app.schemas.user import UserRequest, UserResponse
from app.services.user import create_or_get_user

router = APIRouter()


@router.post("")
def user_endpoint(
    body: UserRequest, user_id: str = Depends(verify_token)
) -> UserResponse:
    return create_or_get_user(
        user_id, body.email, body.name, body.avatar_url, body.expertise, body.sql_level
    )
