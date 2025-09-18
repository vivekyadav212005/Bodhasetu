import asyncio
import logging
from typing import Optional

from backend.llm.summarizer import summarize_document
from backend import db
from backend.tasks.reaugment import reaugment_and_upsert

logger = logging.getLogger(__name__)


async def schedule_document_summary(doc_id: str, text: str, doc_title: str, max_retries: int = 3):
    delay = 1
    for attempt in range(max_retries):
        try:
            await db.set_processing_status(doc_id, "summary_processing")
            await summarize_document(doc_id, text, doc_title)
            # Re-augment and re-embed with the improved summary
            await reaugment_and_upsert(doc_id)
            await db.set_processing_status(doc_id, "summary_done")
            return
        except Exception as e:
            logger.warning("Summary attempt %s failed for %s: %s", attempt + 1, doc_id, e)
            await asyncio.sleep(delay)
            delay *= 2
    await db.upsert_document_summary(doc_id, status="failed")
    await db.set_processing_status(doc_id, "summary_failed")


def enqueue_summary(doc_id: str, text: str, doc_title: str):
    asyncio.create_task(schedule_document_summary(doc_id, text, doc_title))
