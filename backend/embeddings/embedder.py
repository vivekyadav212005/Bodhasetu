# backend/embeddings/embedder.py
import os
# Prevent HuggingFace tokenizers fork/parallelism warnings and deadlocks
os.environ.setdefault("TOKENIZERS_PARALLELISM", "false")
from sentence_transformers import SentenceTransformer
import numpy as np

MODEL_NAME = os.getenv("EMBED_MODEL", "all-MiniLM-L6-v2")
_model = None

def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model

def embed_texts(texts):
    model = get_model()
    vectors = model.encode(texts, show_progress_bar=False, convert_to_numpy=True)
    return np.array(vectors)