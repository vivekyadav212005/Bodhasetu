# backend/main.py
from fastapi import FastAPI, UploadFile, File, Form
import asyncio
from backend.worker import process_bytes

app = FastAPI(title="Bodhasetu Prototype API")

@app.post("/upload")
async def upload(file: UploadFile = File(...), department: str = Form("General")):
    b = await file.read()
    res = await process_bytes(b, file.filename, department, source_meta={"source": "manual_upload"})
    return res

@app.get("/")
def root():
    return {"message": "Bodhasetu prototype running"}