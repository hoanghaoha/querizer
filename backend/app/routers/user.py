from fastapi import APIRouter, BackgroundTasks, Depends
from app.auth import verify_token
from app.schemas.user import UserRequest, UserResponse, UserUpdateRequest
from app.services.database.functions import generate_starter_database
from app.services.user import get_or_create_user, update_user

router = APIRouter()


@router.post("")
async def get_or_create_user_endpoint(
    body: UserRequest,
    background_tasks: BackgroundTasks,
    user_id: str = Depends(verify_token),
) -> UserResponse:
    user, is_new = get_or_create_user(user_id, body)
    if is_new:
        print(f"[starter] scheduling background task for new user {user_id}")
        background_tasks.add_task(generate_starter_database, user_id)
    return user


@router.post("/update")
def update_user_endpoint(
    body: UserUpdateRequest, user_id: str = Depends(verify_token)
) -> UserResponse:
    return update_user(user_id, body)
