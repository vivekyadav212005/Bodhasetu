from typing import List, Dict, Optional
from backend.qdrant_conn import qdrant_client, COLLECTION_NAME
from backend.embeddings.embedder import embed_texts
from qdrant_client.http import models as rest_models
from backend import db


async def semantic_search(query: str, top_k: int = 8, filters: Optional[dict] = None, neighbor_window: int = 1) -> List[Dict]:
    vec = embed_texts([query])[0]
    qkwargs = {
        "collection_name": COLLECTION_NAME,
        "query_vector": vec.tolist(),
        "limit": top_k,
        "with_payload": True,
    }
    # Optional filters
    if filters:
        must = []
        if filters.get("doc_id"):
            must.append(rest_models.FieldCondition(key="doc_id", match=rest_models.MatchValue(value=filters["doc_id"])) )
        if filters.get("department"):
            must.append(rest_models.FieldCondition(key="department", match=rest_models.MatchValue(value=filters["department"])) )
        if must:
            qkwargs["query_filter"] = rest_models.Filter(must=must)
    res = qdrant_client.search(**qkwargs)
    out = []
    for r in res:
        p = r.payload or {}
        doc_id = p.get("doc_id")
        chunk_index = p.get("chunk_index")
        chunk_id = f"{doc_id}_{chunk_index}" if doc_id is not None and chunk_index is not None else None
        chunk_doc = None
        if chunk_id:
            chunk_doc = await db.db["chunks"].find_one({"_id": chunk_id})
        # Merge best available info
        out.append({
            "vector_score": float(r.score),
            "doc_id": doc_id,
            "chunk_index": chunk_index,
            "page_number": p.get("page_number") if p.get("page_number") is not None else (chunk_doc or {}).get("page_number"),
            "excerpt": p.get("excerpt") or (chunk_doc or {}).get("text", "")[:300],
            "doc_summary": p.get("doc_summary"),
            "doc_title": p.get("doc_title"),
            "start_char": p.get("start_char") if p.get("start_char") is not None else (chunk_doc or {}).get("start_char"),
            "end_char": p.get("end_char") if p.get("end_char") is not None else (chunk_doc or {}).get("end_char"),
            "text": (chunk_doc or {}).get("text", ""),
        })
    # Expand with neighboring chunks around each result
    if neighbor_window and out:
        wants = []
        for hit in out:
            if hit.get("doc_id") is None or hit.get("chunk_index") is None:
                continue
            base_idx = hit["chunk_index"]
            for delta in range(-neighbor_window, neighbor_window + 1):
                if delta == 0:
                    continue
                wants.append({"doc_id": hit["doc_id"], "chunk_index": base_idx + delta})
        if wants:
            cursor = db.db["chunks"].find({
                "$or": [{"doc_id": w["doc_id"], "chunk_index": w["chunk_index"]} for w in wants]
            })
            neighbors = await cursor.to_list(length=None)
            # Index by (doc_id, chunk_index)
            nmap = {(c["doc_id"], c["chunk_index"]): c for c in neighbors}
            for hit in list(out):
                d = hit.get("doc_id")
                ci = hit.get("chunk_index")
                for delta in range(-neighbor_window, neighbor_window + 1):
                    if delta == 0:
                        continue
                    key = (d, (ci or 0) + delta)
                    nb = nmap.get(key)
                    if not nb:
                        continue
                    out.append({
                        "vector_score": hit.get("vector_score"),  # inherit parent's score for ordering
                        "doc_id": d,
                        "chunk_index": nb.get("chunk_index"),
                        "page_number": nb.get("page_number"),
                        "excerpt": nb.get("text", "")[:300],
                        "doc_summary": hit.get("doc_summary"),
                        "doc_title": hit.get("doc_title"),
                        "start_char": nb.get("start_char"),
                        "end_char": nb.get("end_char"),
                        "text": nb.get("text", ""),
                    })
        # Deduplicate by (doc_id, chunk_index)
        dedup = {}
        for item in out:
            key = (item.get("doc_id"), item.get("chunk_index"))
            dedup[key] = item
        out = list(dedup.values())
        # Keep top_k hits (including neighbors) by vector_score desc
        out.sort(key=lambda x: (x.get("vector_score") or 0), reverse=True)
        out = out[: max(top_k, len(out))]
    return out
