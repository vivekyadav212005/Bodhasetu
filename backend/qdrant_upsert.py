# backend/qdrant_upsert.py
from qdrant_client.http import models as rest_models
from uuid import uuid4
import numpy as np
from backend.qdrant_conn import qdrant_client, COLLECTION_NAME

def ensure_collection(dim: int):
    try:
        qdrant_client.get_collection(collection_name=COLLECTION_NAME)
    except Exception:
        qdrant_client.recreate_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=rest_models.VectorParams(size=dim, distance=rest_models.Distance.COSINE)
        )

def upsert_chunks_vectors(doc_id: str, chunk_models: list, vectors: np.ndarray):
    """
    chunk_models: list of dicts aligned with vectors (must contain chunk_index, page_number, start_char, end_char, text)
    vectors: numpy array shape (n, dim)
    """
    points = []
    for cm, vec in zip(chunk_models, vectors):
        pid = str(uuid4())  # ✅ generate a proper UUID
        payload = {
            "doc_id": doc_id,
            "chunk_index": cm['chunk_index'],
            "page_number": cm.get('page_number'),
            "start_char": cm.get('start_char'),
            "end_char": cm.get('end_char'),
            "excerpt": (cm.get('text') or "")[:300]
        }
        points.append(
            rest_models.PointStruct(
                id=pid,                     # ✅ valid UUID string
                vector=vec.tolist(),
                payload=payload
            )
        )
    qdrant_client.upsert(collection_name=COLLECTION_NAME, points=points)