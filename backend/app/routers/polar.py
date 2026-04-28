from typing import Any, cast
from fastapi import APIRouter, Depends, HTTPException, Header, Request
from app.auth import verify_token
from app.schemas.polar import CheckoutRequest, CheckoutResponse, PortalResponse
from app.services.polar.functions import (
    create_checkout,
    get_portal_url,
    handle_polar_event,
)
from app.supabase import db
from app.config import settings

router = APIRouter()


@router.post("/portal")
def portal_endpoint(user_id: str = Depends(verify_token)) -> PortalResponse:
    result = db.table("users").select("polar_customer_id").eq("id", user_id).execute()
    user = cast(dict[str, Any], result.data[0]) if result.data else {}
    polar_customer_id = user.get("polar_customer_id")
    if not polar_customer_id:
        raise HTTPException(status_code=400, detail="No subscription found")
    url = get_portal_url(polar_customer_id)
    return PortalResponse(url=url)


@router.post("/checkout")
def create_checkout_endpoint(
    body: CheckoutRequest,
    user_id: str = Depends(verify_token),
) -> CheckoutResponse:
    url = create_checkout(user_id, body.plan, body.success_url)
    return CheckoutResponse(url=url)


@router.post("/webhooks")
async def polar_webhook(
    request: Request,
    webhook_id: str = Header(alias="webhook-id"),
    webhook_timestamp: str = Header(alias="webhook-timestamp"),
    webhook_signature: str = Header(alias="webhook-signature"),
):

    import base64
    import hashlib
    import hmac
    import json

    body = await request.body()

    signed_content = f"{webhook_id}.{webhook_timestamp}.{body.decode()}"
    secret_bytes = settings.polar_webhook_secret.encode()
    expected_b64 = base64.b64encode(
        hmac.new(secret_bytes, signed_content.encode(), hashlib.sha256).digest()
    ).decode()

    signatures = webhook_signature.split(" ")
    valid = any(sig.split(",", 1)[-1] == expected_b64 for sig in signatures)
    if not valid:
        raise HTTPException(status_code=403, detail="Invalid signature")

    handle_polar_event(json.loads(body))
