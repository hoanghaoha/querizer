from fastapi import APIRouter, Depends
from app.auth import verify_token
from app.schemas.user import UserRequest, UserResponse, UserUpdateRequest
from app.services.user import get_or_create_user, update_user

router = APIRouter()


@router.post("")
def get_or_create_user_endpoint(
    body: UserRequest, user_id: str = Depends(verify_token)
) -> UserResponse:
    return get_or_create_user(user_id, body)


@router.post("/update")
def update_user_endpoint(
    body: UserUpdateRequest, user_id: str = Depends(verify_token)
) -> UserResponse:
    return update_user(user_id, body)
