# backend/storage.py
import os
import pathlib
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
STORAGE_BACKEND = os.getenv("STORAGE_BACKEND", "local")
LOCAL_STORAGE_DIR = os.getenv("LOCAL_STORAGE_DIR", "data")

def save_file_local(bytes_data: bytes, filename: str, dept: str = "General"):
    date = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    path = pathlib.Path(LOCAL_STORAGE_DIR) / dept
    path.mkdir(parents=True, exist_ok=True)
    safe_name = filename.replace(" ", "_")
    full_path = path / f"{date}_{safe_name}"
    with open(full_path, "wb") as f:
        f.write(bytes_data)
    return str(full_path)

def save_file(bytes_data: bytes, filename: str, dept: str = "General"):
    if STORAGE_BACKEND == "s3":
        # later: import s3 uploader
        from backend.s3_uploader import upload_bytes_to_s3
        # expected env S3_BUCKET to be set
        from os import getenv
        return upload_bytes_to_s3(getenv("S3_BUCKET"), bytes_data, filename, dept)
    else:
        return save_file_local(bytes_data, filename, dept)