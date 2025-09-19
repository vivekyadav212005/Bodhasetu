from typing import Optional, List, Dict
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from backend.retrieval.retriever import semantic_search
from backend.llm.prompts import qa_prompt
from backend.llm.client import call_groq
from backend import db


router = APIRouter()


class QueryRequest(BaseModel):
    query: str
    top_k: int = 8
    doc_id: Optional[str] = None
    department: Optional[str] = None


@router.post("/query")
async def query(req: QueryRequest):
    filters = {}
    if req.doc_id:
        filters["doc_id"] = req.doc_id
    if req.department:
        filters["department"] = req.department
    # Quick summary intent detection
    wants_summary = any(kw in req.query.lower() for kw in ["summary", "summarize", "high-level", "overview"])
    if wants_summary and req.doc_id:
        # Directly return stored summary and actionable items for this doc
        doc = await db.get_document_by_id(req.doc_id)
        if not doc:
            return {"answer": "Document not found", "actionable_items": [], "sources": []}
        return {
            "answer": doc.get("summary", ""),
            "summary": doc.get("summary", ""),
            "actionable_items": doc.get("actionable", []),
            "sources": [{"doc_id": req.doc_id, "chunk_index": None, "excerpt": "", "page_number": None, "score": None}],
        }
    if wants_summary and not req.doc_id:
        # Pick the top document via a quick semantic search and return its summary
        results = await semantic_search(req.query, top_k=1, filters=filters or None)
        if results:
            top = results[0]
            d = await db.get_document_by_id(top.get("doc_id"))
            if d:
                return {
                    "answer": d.get("summary", ""),
                    "summary": d.get("summary", ""),
                    "actionable_items": d.get("actionable", []),
                    "sources": [{"doc_id": d.get("_id"), "chunk_index": None, "excerpt": "", "page_number": None, "score": top.get("vector_score")}],
                }

    results = await semantic_search(req.query, top_k=req.top_k, filters=filters or None)
    if not results:
        return {"answer": "No relevant results found.", "actionable_items": [], "sources": []}

    context = results
    prompt = qa_prompt(req.query, context)
    llm = await call_groq(prompt, max_tokens=700, temperature=0.0)
    text = (llm or {}).get("text", "{}").strip()
    import json
    try:
        data = json.loads(text)
    except Exception:
        data = {"answer": text, "summary": "", "actionable_items": [], "sources": []}

    # enforce and enrich sources with traceability
    sources = []
    for c in context:
        sources.append({
            "doc_id": c.get("doc_id"),
            "chunk_index": c.get("chunk_index"),
            "excerpt": c.get("excerpt"),
            "page_number": c.get("page_number"),
            "score": c.get("vector_score"),
            "start_char": c.get("start_char"),
            "end_char": c.get("end_char"),
        })
    data.setdefault("sources", sources)
    return data


@router.get("/document/{doc_id}/summary")
async def get_document_summary(doc_id: str):
    doc = await db.get_document_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return {
        "doc_id": doc_id,
        "summary": doc.get("summary"),
        "bullets": doc.get("bullets", []),
        "actionable": doc.get("actionable", []),
        "summary_status": doc.get("summary_status", "pending"),
    }
