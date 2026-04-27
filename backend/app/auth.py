import logging
from typing import Any

import httpx
from jose import JWTError, jwt, jwk
from fastapi import HTTPException, Header
from app.config import settings

logger = logging.getLogger(__name__)

_jwks_cache: list | None = None


def _get_jwks() -> Any:
    global _jwks_cache
    if _jwks_cache is None:
        try:
            res = httpx.get(f"{settings.supabase_url}/auth/v1/.well-known/jwks.json")
            res.raise_for_status()
            _jwks_cache = res.json()["keys"]
        except Exception as e:
            logger.exception("cannot reach auth provider")
            raise HTTPException(
                status_code=503, detail="Cannot reach auth provider"
            ) from e
    return _jwks_cache


def verify_token(authorization: str = Header(...)) -> str:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401, detail="Invalid authorization header format"
        )

    token = authorization.removeprefix("Bearer ")

    try:
        keys = _get_jwks()
        payload = None
        for key in keys:
            try:
                public_key = jwk.construct(key)
                payload = jwt.decode(
                    token, public_key, algorithms=["ES256"], audience="authenticated"
                )
                break
            except JWTError:
                continue

        if payload is None:
            raise JWTError("No valid key found")

    except JWTError as e:
        logger.warning("invalid token", exc_info=True)
        raise HTTPException(status_code=401, detail="Invalid token") from e

    user_id: str = str(payload.get("sub"))

    if not user_id:
        raise HTTPException(status_code=401, detail="Token missing user ID")

    return user_id
