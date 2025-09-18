import os
import json
import asyncio
import logging
from typing import Any, Dict

import httpx

logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
DEFAULT_GROQ_URL = "https://api.groq.com/openai/v1/chat/completions"
_ENV_URL = os.getenv("GROQ_API_URL", "").strip()
GROQ_API_URL = _ENV_URL or DEFAULT_GROQ_URL
GROQ_TIMEOUT = float(os.getenv("GROQ_TIMEOUT", "30"))


class LLMError(Exception):
    pass


async def call_groq(prompt: str, max_tokens: int = 512, temperature: float = 0.0) -> Dict[str, Any]:
    if not GROQ_API_KEY:
        raise LLMError("GROQ_API_KEY not set")

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": os.getenv("GROQ_MODEL", "mixtral-8x7b-32768"),
        "messages": [
            {"role": "system", "content": "You are a precise assistant that outputs JSON only."},
            {"role": "user", "content": prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
        "stream": False,
    }

    # Auto-correct common misconfigurations
    url = GROQ_API_URL
    if "/chat/completions" not in url:
        # Only log at debug level to avoid noisy logs
        logger.debug("GROQ_API_URL (%s) not chat completions; switching to %s", url, DEFAULT_GROQ_URL)
        url = DEFAULT_GROQ_URL

    backoff = 1.0
    last_exc = None
    for attempt in range(3):
        try:
            async with httpx.AsyncClient(timeout=GROQ_TIMEOUT) as client:
                resp = await client.post(url, headers=headers, json=payload)
                if resp.status_code >= 400:
                    logger.error("GROQ error %s: %s", resp.status_code, resp.text)
                    raise LLMError(f"Groq error {resp.status_code}")
                data = resp.json()
                # generic parsing: openai-like
                text = (
                    data.get("choices", [{}])[0]
                    .get("message", {})
                    .get("content", "")
                    if isinstance(data, dict)
                    else ""
                )
                return {"text": text, "raw": data}
        except Exception as e:
            last_exc = e
            logger.warning("GROQ call failed (attempt %s): %s", attempt + 1, e)
            await asyncio.sleep(backoff)
            backoff *= 2
    raise LLMError(f"Groq call failed after retries: {last_exc}")
