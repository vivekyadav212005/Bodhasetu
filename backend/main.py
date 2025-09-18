# backend/main.py
from fastapi import FastAPI, UploadFile, File, Form
from backend.worker import process_bytes
from backend.db import ensure_indexes
from backend.qdrant_upsert import search_similar
from backend.api.endpoints import router as api_router

app = FastAPI(title="Bodhasetu Prototype API")

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