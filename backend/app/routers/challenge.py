from typing import Optional

from fastapi import APIRouter, Depends

from app.auth import verify_token
from app.schemas.challenge import (
    ChallengeGenerateRequest,
    ChallengeHintResponse,
    ChallengeResponse,
    ChallengeSubmitRequest,
    UpdateChallengeRequest,
)
from app.services.challenge.functions import (
    delete_challenge,
    generate_challenge,
    get_challenge,
    get_challenges,
    hint_challenge,
    submit_challenge,
    update_challenge,
)

router = APIRouter()


@router.post("")
async def generate_challenge_endpoint(
    body: ChallengeGenerateRequest, user_id: str = Depends(verify_token)
) -> ChallengeResponse:
    return await generate_challenge(user_id, body)


@router.get("/challenges")
async def get_challenges_endpoint(
    database_id: Optional[str] = None,
    user_id: str = Depends(verify_token),
) -> list[ChallengeResponse]:
    return get_challenges(user_id, database_id)


@router.get("/{challenge_id}")
async def get_challenge_endpoint(
    challenge_id: str,
    user_id: str = Depends(verify_token),
) -> ChallengeResponse:
    return get_challenge(challenge_id, user_id)


@router.patch("/{challenge_id}")
async def update_challenge_endpoint(
    challenge_id: str,
    body: UpdateChallengeRequest,
    user_id: str = Depends(verify_token),
) -> ChallengeResponse:
    return update_challenge(challenge_id, user_id, body)


@router.delete("/{challenge_id}", status_code=204)
async def delete_challenge_endpoint(
    challenge_id: str, user_id: str = Depends(verify_token)
) -> None:
    delete_challenge(challenge_id, user_id)


@router.post("/submit/{challenge_id}")
async def submit_challenge_endpoint(
    challenge_id: str,
    body: ChallengeSubmitRequest,
    user_id: str = Depends(verify_token),
):
    return submit_challenge(challenge_id, user_id, body)


@router.post("/hint/{challenge_id}")
async def hint_challenge_endpoint(
    challenge_id: str,
    body: ChallengeSubmitRequest,
    user_id: str = Depends(verify_token),
) -> ChallengeHintResponse:
    return await hint_challenge(challenge_id, user_id, body)
