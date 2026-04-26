from fastapi import APIRouter, Depends

from app.auth import verify_token
from app.schemas.challenge import ChallengeGenerateRequest, ChallengeResponse
from app.services.challenge.functions import generate_challenge

router = APIRouter()


@router.post("")
async def generate_challenge_endpoint(
    body: ChallengeGenerateRequest, user_id: str = Depends(verify_token)
) -> ChallengeResponse:
    return await generate_challenge(user_id, body)
