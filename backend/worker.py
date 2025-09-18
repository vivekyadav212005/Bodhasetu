# backend/worker.py
import numpy as np
from datetime import datetime
from backend import db
from backend.utils.hash_utils import compute_sha256_bytes
from backend.embeddings.embedder import embed_texts
from backend.qdrant_upsert import ensure_collection, upsert_chunks_vectors
from backend.utils.file_type import detect_basic_type
from backend.storage import save_file
from backend.extractors.pdf_extractor import extract_pdf as pdf_extract
from backend.extractors.excel_extractor import extract_excel as excel_extract


async def process_bytes(file_bytes: bytes, filename: str, department: str, source_meta: dict):
    """
    Full pipeline:
    1. Hash file -> dedup check
    2. Detect type -> extract text
    3. Chunk text -> save to Mongo
    4. Embed -> save to Qdrant
    """

    # ---------- 1. Compute hash & dedup check ----------
    sha256 = compute_sha256_bytes(file_bytes)
    existing = await db.get_document("documents", sha256)
    if existing:
        await db.update_document(
            "documents",
            sha256,
            {
                "sources": existing.get("sources", []) + [source_meta],
                "department": department or existing.get("department"),
                "last_seen": datetime.utcnow(),
            }
        )
        return {"status": "duplicate", "doc_id": sha256}

    # ---------- 2. Save base doc metadata ----------
    stored = save_file(file_bytes, filename, department, prefix=sha256[:8])

    doc_data = {
        "_id": sha256,
        "filename": filename,
        "stored_path": stored.get("full_path") if isinstance(stored, dict) else stored,
        "department": department,
        "sources": [source_meta],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
        "hash": sha256,
    }
    await db.insert_document("documents", doc_data)

    # ---------- 3. Detect type ----------
    file_type = detect_basic_type(file_bytes, filename)
    extracted_text = ""
    chunks_meta = []
    page_or_sheet_meta = None

    if file_type == "pdf":
        extracted_text, chunks_meta, page_or_sheet_meta = pdf_extract(file_bytes)
    elif file_type == "excel":
        extracted_text, chunks_meta, page_or_sheet_meta = excel_extract(file_bytes)
    else:
        try:
            extracted_text = file_bytes.decode(errors="ignore")
        except Exception:
            extracted_text = ""
        chunks_meta = [{"text": extracted_text, "chunk_index": 0, "start_char": 0, "end_char": len(extracted_text)}]

    # ---------- 4. Store chunks in Mongo ----------
    for cm in chunks_meta:
        cm["_id"] = f"{sha256}_{cm['chunk_index']}"
        cm["doc_id"] = sha256
    # bulk insert for efficiency
    await db.insert_many("chunks", chunks_meta)
    chunk_models = chunks_meta

    # ---------- 5. Generate embeddings ----------
    texts = [cm["text"] for cm in chunk_models]
    if texts:
        vectors = embed_texts(texts)
        ensure_collection(vectors.shape[1])
        upsert_chunks_vectors(sha256, chunk_models, vectors)

    # ---------- 6. Final update ----------
    await db.update_document(
        "documents",
        sha256,
        {
            "updated_at": datetime.utcnow(),
            "num_chunks": len(chunk_models),
            "extraction_meta": page_or_sheet_meta,
            "file_type": file_type,
            "text_char_count": len(extracted_text or ""),
        }
    )

    return {"status": "new", "doc_id": sha256, "chunks": len(chunk_models)}

    # include basic trace for caller
    return {"status": "new", "doc_id": sha256, "chunks": len(chunk_models), "file_type": file_type}