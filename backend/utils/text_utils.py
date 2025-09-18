# backend/utils/text_utils.py
import re

DWG_PATTERNS = [
    r"(Drawing\s*No[:\s]*[A-Za-z0-9\-\_/\.]+)",
    r"(DWG\s*No[:\s]*[A-Za-z0-9\-\_/\.]+)",
    r"(Drawing\s*Name[:\s]*[A-Za-z0-9\s\-\_/\.]+)",
    r"(Rev[:\s]*[A-Za-z0-9\.\-]+)",
    r"(\d+\s?mm|\d+\s?cm|\d+\s?m)"  # dimensions
]

def extract_drawing_labels(text: str):
    found = []
    if not text:
        return found
    for pat in DWG_PATTERNS:
        for m in re.findall(pat, text, flags=re.I):
            s = m.strip()
            if s and s not in found:
                found.append(s)
    return found