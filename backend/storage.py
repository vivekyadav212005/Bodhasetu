# backend/storage.py
import os
import pathlib
import re
from typing import Optional
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")
LOCAL_STORAGE_DIR = os.getenv("LOCAL_STORAGE_DIR", "data")

_SAFE_CHARS = re.compile(r"[^A-Za-z0-9._-]+")

def _sanitize_filename(name: str) -> str:
    name = name.strip().replace(" ", "_")
    # remove path-like components and unsafe chars
    name = name.split("/")[-1].split("\\")[-1]
    name = _SAFE_CHARS.sub("_", name)
    return name[:180] if len(name) > 180 else name

def save_file_local(bytes_data: bytes, filename: str, dept: str = "General", prefix: Optional[str] = None):
    date = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    path = pathlib.Path(LOCAL_STORAGE_DIR) / _sanitize_filename(dept or "General")
    path.mkdir(parents=True, exist_ok=True)
    safe_name = _sanitize_filename(filename or "uploaded")
    base = f"{prefix + '_' if prefix else ''}{date}_{safe_name}"
    full_path = path / base
    with open(full_path, "wb") as f:
        f.write(bytes_data)
    return {"full_path": str(full_path), "basename": base}

def save_file(bytes_data: bytes, filename: str, dept: str = "General", prefix: Optional[str] = None):
    if STORAGE_BACKEND == "s3":
        # S3 backend not implemented in this project scope
        raise NotImplementedError("S3 storage backend is not configured. Use local storage.")
    else:
        return save_file_local(bytes_data, filename, dept, prefix)