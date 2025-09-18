# backend/utils/file_type.py
def detect_basic_type(file_bytes: bytes, filename: str = "") -> str:
    head = file_bytes[:4]
    if head == b"%PDF":
        return "pdf"
    if file_bytes[:2] == b"PK":
        # likely xlsx (zip container) or docx
        if filename.lower().endswith((".xlsx", ".xls")):
            return "excel"
        return "excel"
    # fallback by filename
    if filename.lower().endswith((".xls", ".xlsx")):
        return "excel"
    if filename.lower().endswith((".pdf",)):
        return "pdf"
    return "unknown"