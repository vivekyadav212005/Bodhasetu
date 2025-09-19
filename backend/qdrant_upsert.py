# backend/qdrant_upsert.py
from qdrant_client.http import models as rest_models
from uuid import uuid4, uuid5, NAMESPACE_URL
import numpy as np
from backend.qdrant_conn import qdrant_client, COLLECTION_NAME
from backend.embeddings.embedder import embed_texts

def ensure_collection(dim: int):
    try:
        qdrant_client.get_collection(collection_name=COLLECTION_NAME)
    except Exception:
        qdrant_client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=rest_models.VectorParams(size=dim, distance=rest_models.Distance.COSINE)
        )

def _stable_point_id(doc_id: str, chunk_index: int) -> str:
    return str(uuid5(NAMESPACE_URL, f"{doc_id}:{chunk_index}"))

def delete_points_by_doc_id(doc_id: str):
    filt = rest_models.Filter(must=[
        rest_models.FieldCondition(key="doc_id", match=rest_models.MatchValue(value=doc_id))
    ])
    qdrant_client.delete(collection_name=COLLECTION_NAME, points_selector=rest_models.FilterSelector(filter=filt))

def upsert_chunks_vectors(doc_id: str, chunk_models: list, vectors: np.ndarray, doc_summary: str = "", doc_title: str = "", department: str = ""):
    """
    chunk_models: list of dicts aligned with vectors (must contain chunk_index, page_number, start_char, end_char, text)
    vectors: numpy array shape (n, dim)
    """
    points = []
    for cm, vec in zip(chunk_models, vectors):
        pid = _stable_point_id(doc_id, int(cm['chunk_index']))
        payload = {
            "doc_id": doc_id,
            "chunk_index": cm['chunk_index'],
            "page_number": cm.get('page_number'),
            "start_char": cm.get('start_char'),
            "end_char": cm.get('end_char'),
            "excerpt": (cm.get('text') or "")[:300],
            "doc_summary": (doc_summary or "")[:1000],
            "doc_title": doc_title or "",
            "department": department or cm.get('department') or "",
        }
        points.append(
            rest_models.PointStruct(
                id=pid,                     # ✅ valid UUID string
                vector=vec.tolist(),
                payload=payload
            )
        )
    qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)

def search_similar(query: str, top_k: int = 5):
    vec = embed_texts([query])[0]
    res = qdrant_client.search(
        collection_name=COLLECTION_NAME,
        query_vector=vec.tolist(),
        limit=top_k,
        with_payload=True
    )
    return [
        {
            "score": r.score,
            "payload": r.payload
        } for r in res
    ]