from fastapi import APIRouter, Depends
from app.auth import verify_token
from app.schemas.user import UserRequest, UserResponse, UserUpdateRequest
from app.services.user import create_or_get_user, update_user

router = APIRouter()


@router.post("")
def user_endpoint(
    body: UserRequest, user_id: str = Depends(verify_token)
) -> UserResponse:
    return create_or_get_user(
        user_id,
        body.email,
        body.name,
        body.avatar_url,
    )


@router.post("/update")
def update_user_endpoint(
    body: UserUpdateRequest, user_id: str = Depends(verify_token)
) -> UserResponse:
    return update_user(user_id, body.name, body.expertise, body.sql_level, body.plan)
