from typing import Any, cast

from fastapi import HTTPException


def one(result: Any) -> dict[str, Any]:
    return cast(dict[str, Any], result.data)


def first(result: Any) -> dict[str, Any]:
    return cast(dict[str, Any], result.data[0])


def require_one(result: Any, label: str) -> dict[str, Any]:
    if not result.data:
        raise HTTPException(status_code=404, detail=f"{label} not found")
    return one(result)


def require_first(result: Any, label: str) -> dict[str, Any]:
    if not result.data:
        raise HTTPException(status_code=404, detail=f"{label} not found")
    return first(result)
