# backend/chunking/chunker.py
from math import ceil

def chunk_text_with_map(text: str, page_number: int = None, chunk_size: int = 1000, overlap: int = 200):
    """
    Returns list of chunk dicts:
    {
      chunk_index:int, text:str, page_number:int, start_char:int, end_char:int
    }
    """
    if not text:
        return []
    step = chunk_size - overlap if chunk_size > overlap else chunk_size
    length = len(text)
    chunks = []
    i = 0
    idx = 0
    while i < length:
        start = i
        end = min(i + chunk_size, length)
        chunks.append({
            "chunk_index": idx,
            "text": text[start:end],
            "page_number": page_number,
            "start_char": start,
            "end_char": end
        })
        idx += 1
        if end == length:
            break
        i += step
    return chunks