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
            "sources": [{
                "doc_id": req.doc_id,
                "doc_title": doc.get("doc_title"),
                "filename": doc.get("filename") or doc.get("original_filename"),
                "chunk_index": None, "excerpt": "", "page_number": None, "score": None
            }],
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
                    "sources": [{
                        "doc_id": d.get("_id"),
                        "doc_title": d.get("doc_title"),
                        "filename": d.get("filename") or d.get("original_filename"),
                        "chunk_index": None, "excerpt": "", "page_number": None, "score": top.get("vector_score")
                    }],
                }

    results = await semantic_search(req.query, top_k=req.top_k, filters=filters or None)
    if not results:
        return {"answer": "No relevant results found.", "actionable_items": [], "sources": []}

    context = results
    prompt = qa_prompt(req.query, context)
    llm = None
    try:
        llm = await call_groq(prompt, max_tokens=1200, temperature=0.1)
        text = (llm or {}).get("text", "{}").strip()
    except Exception:
        text = "{}"
    import json
    try:
        data = json.loads(text)
    except Exception:
        data = {}

    # Fallback: if model failed or returned empty/invalid, synthesize a structured answer from context
    if not isinstance(data, dict) or not data.get("answer"):
        top = context[:5]
        answer_parts = ["Based on retrieved content, here are the most relevant details."]
        details = []
        for c in top:
            excerpt = (c.get("excerpt") or "").strip()
            if excerpt:
                details.append(f"- p.{c.get('page_number') or '-'}: {excerpt[:240]}")
        if details:
            answer_parts.append("\nKey details:\n" + "\n".join(details))
        answer_parts.append("\nContext & Rationale: The answer is composed from the top-matching document snippets. For a deeper dive, ask a follow-up question.")
        data = {
            "answer": "\n\n".join(answer_parts),
            "summary": "High-level synthesis from top retrieved context.",
            "actionable_items": [],
            "sources": [],
        }

    # enforce and enrich sources with traceability
    sources = []
    # Prepare doc metadata map for nicer source labels
    doc_ids = list({c.get("doc_id") for c in context if c.get("doc_id")})
    doc_meta = {}
    for did in doc_ids:
        try:
            d = await db.get_document_by_id(did)
            if d:
                doc_meta[did] = {"doc_title": d.get("doc_title"), "filename": d.get("filename") or d.get("original_filename")}
        except Exception:
            pass
    for c in context:
        did = c.get("doc_id")
        meta = doc_meta.get(did, {})
        sources.append({
            "doc_id": did,
            "doc_title": meta.get("doc_title"),
            "filename": meta.get("filename"),
            "chunk_index": c.get("chunk_index"),
            "excerpt": c.get("excerpt"),
            "page_number": c.get("page_number"),
            "score": c.get("vector_score"),
            "start_char": c.get("start_char"),
            "end_char": c.get("end_char"),
        })
    # Merge model-provided sources (if any) with enriched sources from context for consistent metadata
    model_sources = data.get("sources")
    if isinstance(model_sources, list) and model_sources:
        # Build a quick index by (doc_id, chunk_index)
        def keyer(s):
            return (s.get("doc_id"), s.get("chunk_index"))
        idx = {keyer(s): s for s in sources}
        merged = []
        for s in model_sources:
            k = keyer(s)
            enrich = idx.get(k) or next((x for x in sources if x.get("doc_id") == s.get("doc_id")), None)
            if enrich:
                m = {**enrich, **s}
            else:
                m = s
            # Ensure human-friendly fields present
            if not m.get("doc_title") or not m.get("filename"):
                meta = next((x for x in sources if x.get("doc_id") == m.get("doc_id")), None)
                if meta:
                    m.setdefault("doc_title", meta.get("doc_title"))
                    m.setdefault("filename", meta.get("filename"))
            merged.append(m)
        data["sources"] = merged
    else:
        data["sources"] = sources
    # Ensure required keys exist for contract stability
    data.setdefault("summary", "")
    data.setdefault("actionable_items", [])
    if not isinstance(data.get("actionable_items"), list):
        data["actionable_items"] = []
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
