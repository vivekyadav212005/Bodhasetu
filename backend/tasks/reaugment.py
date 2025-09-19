from typing import List
from backend import db
from backend.cca.cca import augment_chunk
from backend.embeddings.embedder import embed_texts
from backend.qdrant_upsert import ensure_collection, upsert_chunks_vectors, delete_points_by_doc_id


async def reaugment_and_upsert(doc_id: str):
    doc = await db.get_document_by_id(doc_id)
    if not doc:
        return
    summary = doc.get("summary", "")
    title = doc.get("doc_title", "")
    department = doc.get("department", "")
    chunks = await db.get_chunks_for_doc(doc_id)
    augmented = []
    for cm in chunks:
        aug, compact = augment_chunk(cm.get("text", ""), summary)
        cm["compact_context"] = compact
        augmented.append(aug)
    if not augmented:
        return
    # Clean old points for this doc_id to prevent stale payloads lingering
    delete_points_by_doc_id(doc_id)
    vectors = embed_texts(augmented)
    ensure_collection(vectors.shape[1])
    upsert_chunks_vectors(doc_id, chunks, vectors, doc_summary=summary, doc_title=title, department=department)
