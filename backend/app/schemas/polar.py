from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    plan: str
    success_url: str


class CheckoutResponse(BaseModel):
    url: str


class PortalResponse(BaseModel):
    url: str
