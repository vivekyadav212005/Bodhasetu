# backend/db.py
import os
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