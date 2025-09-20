# backend/db.py
import os
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DBNAME = os.getenv("MONGO_DBNAME", "bodhasetu")

client = AsyncIOMotorClient(MONGO_URI)
db = client[MONGO_DBNAME]

async def insert_document(collection: str, data: dict) -> str:
    """Insert a document and return its inserted ID (string)."""
    res = await db[collection].insert_one(data)
    return str(res.inserted_id)

async def insert_many(collection: str, documents: list) -> list:
    """Insert many documents efficiently and return inserted ids."""
    if not documents:
        return []
    res = await db[collection].insert_many(documents)
    return [str(_id) for _id in res.inserted_ids]


async def update_document(collection: str, id_str: str, updates: dict, upsert: bool = False):
    """Update document by _id (string IDs supported)."""
    await db[collection].update_one({"_id": id_str}, {"$set": updates}, upsert=upsert)

async def ensure_indexes():
    await db["documents"].create_index("department")
    await db["documents"].create_index("created_at")
    await db["chunks"].create_index([("doc_id", 1), ("chunk_index", 1)], unique=True)
    await db["chunks"].create_index("page_number")


async def get_document(collection: str, id_str: str) -> dict:
    """Fetch a document by _id (string IDs supported)."""
    return await db[collection].find_one({"_id": id_str})


async def document_exists(collection: str, id_str: str) -> bool:
    """Check if document exists by _id (string IDs supported)."""
    doc = await db[collection].find_one({"_id": id_str})
    return doc is not None

async def ensure_indexes():
    await db["documents"].create_index("department")
    await db["documents"].create_index("updated_at")
    await db["documents"].create_index("summary_status")
    await db["chunks"].create_index([("doc_id", 1), ("chunk_index", 1)], unique=True)
    await db["chunks"].create_index("page_number")
    await db["email_logs"].create_index("status")
    await db["email_logs"].create_index("created_at")

async def upsert_document_summary(doc_id: str, summary: str = "", bullets: Optional[List[str]] = None, actionable: Optional[List[str]] = None, status: str = "done"):
    from datetime import datetime
    update = {
        "summary": summary,
        "bullets": bullets or [],
        "actionable": actionable or [],
        "summary_status": status,
        "summary_updated_at": datetime.utcnow()
    }
    await update_document("documents", doc_id, update, upsert=True)

async def set_processing_status(doc_id: str, status: str):
    from datetime import datetime
    await update_document("documents", doc_id, {"processing_status": status, "updated_at": datetime.utcnow()}, upsert=True)

from typing import Optional

async def get_document_by_id(doc_id: str) -> Optional[dict]:
    return await db["documents"].find_one({"_id": doc_id})

async def get_chunks_for_doc(doc_id: str) -> list:
    cursor = db["chunks"].find({"doc_id": doc_id})
    return await cursor.to_list(length=None)

async def get_chunks_by_ids(ids: list) -> list:
    if not ids:
        return []
    cursor = db["chunks"].find({"_id": {"$in": ids}})
    return await cursor.to_list(length=None)