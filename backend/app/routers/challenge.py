from fastapi import APIRouter, Depends

from app.auth import verify_token
from app.schemas.challenge import (
    ChallengeGenerateRequest,
    ChallengeHintResponse,
    ChallengeResponse,
    ChallengeSubmitRequest,
    ChallengeUpdateRequest,
)
from app.services.challenge.functions import (
    delete_challenge,
    generate_challenge,
    get_challenge,
    get_challenge_hint,
    get_challenges,
    submit_challenge,
    update_challenge,
)
from app.services.tracking import track_solution_viewed

router = APIRouter()


@router.post("")
async def generate_challenge_endpoint(
    body: ChallengeGenerateRequest, user_id: str = Depends(verify_token)
) -> ChallengeResponse:
    return await generate_challenge(user_id, body)


@router.get("/challenges")
async def get_challenges_endpoint(
    database_id: str | None = None,
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
    body: ChallengeUpdateRequest,
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


@router.post("/solution/{challenge_id}", status_code=204)
async def solution_viewed_endpoint(
    challenge_id: str,
    user_id: str = Depends(verify_token),
) -> None:
    track_solution_viewed(user_id, challenge_id)


@router.post("/hint/{challenge_id}")
async def get_challenge_hint_endpoint(
    challenge_id: str,
    body: ChallengeSubmitRequest,
    user_id: str = Depends(verify_token),
) -> ChallengeHintResponse:
    return await get_challenge_hint(challenge_id, user_id, body)
