from typing import Any
import httpx
from fastapi import HTTPException
from app.config import settings
from app.schemas.user import UserPlan, UserPlanStatus, UserUpdateRequest
from app.services.user import update_user

POLAR_API = settings.polar_api_url


def get_portal_url(polar_customer_id: str) -> str:
    response = httpx.post(
        f"{POLAR_API}/customer-sessions/",
        headers={"Authorization": f"Bearer {settings.polar_access_token}"},
        json={"customer_id": polar_customer_id},
    )
    if response.status_code != 201:
        raise HTTPException(status_code=502, detail="Failed to create customer session")
    return response.json()["customer_portal_url"]


def create_checkout(user_id: str, plan: str, success_url: str) -> str:
    product_map = {
        "Pro": settings.polar_product_pro_id,
        "Max": settings.polar_product_max_id,
    }
    product_id = product_map.get(plan)
    if not product_id:
        raise HTTPException(status_code=400, detail="Invalid plan")

    response = httpx.post(
        f"{POLAR_API}/checkouts/",
        headers={"Authorization": f"Bearer {settings.polar_access_token}"},
        json={
            "product_id": product_id,
            "metadata": {"user_id": user_id},
            "success_url": success_url,
        },
    )

    if response.status_code != 201:
        raise HTTPException(status_code=502, detail=response.json())

    return response.json()["url"]


def handle_polar_event(payload: dict[str, Any]) -> None:
    event_type = payload.get("type")
    data = payload.get("data", {})
    user_id = data.get("metadata", {}).get("user_id")
    if not user_id:
        return
    polar_customer_id = data.get("customer_id")
    plan = data.get("product", {}).get("name")
    plan_expires_at = data.get("current_period_end")

    if event_type == "subscription.created":
        update_user(
            user_id,
            UserUpdateRequest(
                plan=plan,
                plan_status=UserPlanStatus.ACTIVE,
                plan_expires_at=plan_expires_at,
                polar_customer_id=polar_customer_id,
            ),
        )

    elif event_type == "subscription.active":
        update_user(
            user_id,
            UserUpdateRequest(
                plan=plan,
                plan_status=UserPlanStatus.ACTIVE,
                plan_expires_at=plan_expires_at,
            ),
        )

    elif event_type == "subscription.canceled":
        update_user(
            user_id,
            UserUpdateRequest(
                plan=plan,
                plan_status=UserPlanStatus.CANCELED,
                plan_expires_at=plan_expires_at,
            ),
        )

    elif event_type == "subscription.updated":
        update_user(
            user_id,
            UserUpdateRequest(
                plan=plan,
                plan_status=UserPlanStatus.ACTIVE,
                plan_expires_at=plan_expires_at,
            ),
        )

    elif event_type == "subscription.uncanceled":
        update_user(
            user_id,
            UserUpdateRequest(
                plan=plan,
                plan_status=UserPlanStatus.ACTIVE,
                plan_expires_at=plan_expires_at,
            ),
        )

    elif event_type == "subscription.revoked":
        update_user(
            user_id,
            UserUpdateRequest(
                plan=UserPlan.FREE,
                plan_status=UserPlanStatus.ACTIVE,
            ),
        )
