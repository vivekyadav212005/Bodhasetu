# backend/main.py
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from backend.worker import process_bytes
from backend.db import ensure_indexes, db
from backend.qdrant_upsert import search_similar
from backend.api.endpoints import router as api_router

app = FastAPI(title="Bodhasetu Prototype API")

# CORS for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*",  # dev convenience; tighten in production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_start():
    await ensure_indexes()

@app.post("/upload")
async def upload(file: UploadFile = File(...), department: str = Form("General")):
    b = await file.read()
    res = await process_bytes(b, file.filename, department, source_meta={"source": "manual_upload"})
    return res

@app.get("/")
def root():
    return {"message": "Bodhasetu prototype running"}

@app.get("/search")
def search(q: str, k: int = 5):
    return {"results": search_similar(q, top_k=k)}

app.include_router(api_router)


@app.get("/documents")
async def list_documents(
    department: Optional[str] = None,
    limit: int = 50,
    skip: int = 0,
):
    query = {}
    if department:
        query["department"] = department
    cursor = db["documents"].find(query).sort("created_at", -1).skip(skip).limit(limit)
    docs = []
    async for d in cursor:
        docs.append({
            "_id": str(d.get("_id")),
            "filename": d.get("original_filename"),
            "stored_path": d.get("stored_path"),
            "department": d.get("department"),
            "created_at": d.get("created_at"),
            "processing_status": d.get("processing_status"),
            "summary_status": d.get("summary_status"),
            "doc_title": d.get("doc_title"),
        })
    return {"documents": docs, "count": len(docs)}

