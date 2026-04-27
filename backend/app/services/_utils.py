import json
import re
from typing import Any


def message_text(message: Any) -> str:
    return message.content[0].text


def parse_llm_json(raw: str) -> dict:
    """Extract a JSON object from an LLM response and parse it to a dict.

    Handles:
    - Markdown code fences (```json ... ``` or ``` ... ```)
    - Leading/trailing whitespace
    - Prose before or after the JSON object
    """
    raw = raw.strip()

    if raw.startswith("```"):
        raw = re.sub(r"^```(?:json)?\s*", "", raw)
        raw = re.sub(r"\s*```$", "", raw)
        raw = raw.strip()

    if not raw.startswith("{"):
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1:
            raw = raw[start : end + 1]

    return json.loads(raw)
