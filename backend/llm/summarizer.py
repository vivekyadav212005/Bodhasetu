import json
import logging
from datetime import datetime
from typing import Dict, Any

from backend.llm.client import call_groq, LLMError
from backend.llm.prompts import document_summary_prompt
from backend import db

logger = logging.getLogger(__name__)


def extractive_fallback(text: str, max_chars: int = 800) -> Dict[str, Any]:
    snippet = (text or "").strip()[:max_chars]
    sentences = snippet.split(". ")
    summary = ". ".join(sentences[:3]).strip()
    if summary and not summary.endswith("."):
        summary += "."
    return {
        "summary": summary or snippet,
        "bullets": [],
        "actionable": [],
        "chunk_summaries": [],
    }


async def summarize_document(doc_id: str, text: str, doc_title: str) -> Dict[str, Any]:
    await db.upsert_document_summary(doc_id, status="processing")
    prompt = document_summary_prompt(text, doc_title)
    try:
        res = await call_groq(prompt, max_tokens=700, temperature=0.0)
        raw_text = (res or {}).get("text", "").strip()
        data = json.loads(raw_text) if raw_text else {}
        summary = data.get("summary", "")
        bullets = data.get("bullets", []) or data.get("highlights", [])
        actionable = data.get("actionable_items", []) or data.get("actionables", [])
        chunk_summaries = data.get("chunk_summaries", [])

        await db.upsert_document_summary(doc_id, summary=summary, bullets=bullets, actionable=actionable, status="done")
        return {
            "summary": summary,
            "bullets": bullets,
            "actionable": actionable,
            "chunk_summaries": chunk_summaries,
        }
    except Exception as e:
        logger.error("Summarization failed for %s: %s", doc_id, e)
        fb = extractive_fallback(text)
        await db.upsert_document_summary(doc_id, summary=fb["summary"], bullets=fb["bullets"], actionable=fb["actionable"], status="pending")
        return fb
