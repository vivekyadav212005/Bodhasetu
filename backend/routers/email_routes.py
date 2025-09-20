from typing import List
from fastapi import APIRouter, HTTPException
from datetime import datetime
from bson import ObjectId

from backend import db
from backend.email_fetcher import fetch_emails_and_store
from backend.worker import process_bytes

router = APIRouter(prefix="/emails", tags=["emails"])


def _serialize_email_log(d: dict):
    return {
        "_id": str(d.get("_id")),
        "sender": d.get("sender"),
        "receiver": d.get("receiver"),
        "subject": d.get("subject"),
        "date": d.get("date"),
        "filename": d.get("filename"),
        "status": d.get("status"),
        "department": d.get("department"),
        "created_at": d.get("created_at"),
    }


@router.get("/logs")
async def get_logs():
    cursor = db.db["email_logs"].find({}).sort("created_at", -1)
    items = await cursor.to_list(length=None)
    return {"logs": [_serialize_email_log(i) for i in items]}


@router.post("/fetch")
async def manual_fetch():
    count = await fetch_emails_and_store()
    # Return new logs snapshot to update UI instantly
    cursor = db.db["email_logs"].find({}).sort("created_at", -1)
    items = await cursor.to_list(length=None)
    return {"fetched": count, "logs": [_serialize_email_log(i) for i in items]}


@router.post("/approve/{log_id}")
async def approve_email(log_id: str):
    rec = await db.db["email_logs"].find_one({"_id": ObjectId(log_id)})
    if not rec:
        raise HTTPException(status_code=404, detail="Email log not found")
    if rec.get("status") == "approved":
        return {"status": "already_approved"}
    fb = rec.get("file_bytes")
    if not fb:
        raise HTTPException(status_code=400, detail="No attachment stored")
    # Ingest via existing pipeline
    res = await process_bytes(bytes(fb), rec.get("filename") or "attachment", rec.get("department") or "General", source_meta={
        "source": "email",
        "sender": rec.get("sender"),
        "subject": rec.get("subject"),
        "email_date": rec.get("date"),
    })
    await db.db["email_logs"].update_one({"_id": rec["_id"]}, {"$set": {"status": "approved", "updated_at": datetime.utcnow(), "document_id": res.get("document_id")}})
    return {"status": "approved", "document_id": res.get("document_id")}


@router.post("/reject/{log_id}")
async def reject_email(log_id: str):
    rec = await db.db["email_logs"].find_one({"_id": ObjectId(log_id)})
    if not rec:
        raise HTTPException(status_code=404, detail="Email log not found")
    await db.db["email_logs"].update_one({"_id": rec["_id"]}, {"$set": {"status": "rejected", "updated_at": datetime.utcnow()}})
    return {"status": "rejected"}
