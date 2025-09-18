# backend/chunking/chunker.py
import re
from typing import Optional

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


def semantic_chunks(text: str, page_number: Optional[int] = None, target_size: int = 900, overlap: int = 150):
    """
    Paragraph- and sentence-aware chunking. Packs sentences into chunks up to target_size,
    with overlap between neighboring chunks to preserve context.
    Returns list of dicts with text, page_number, start_char, end_char, chunk_index.
    """
    if not text:
        return []

    paras = [p for p in re.split(r"\n\s*\n+", text) if p.strip()]
    sent_split = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9])")

    # Build list of (sentence, start_idx, end_idx) in original text
    sentences = []
    cursor = 0
    for p in paras:
        p_start = text.find(p, cursor)
        if p_start < 0:
            p_start = cursor
        cursor = p_start + len(p)
        parts = [s for s in sent_split.split(p) if s.strip()]
        local_pos = 0
        for s in parts:
            s = s.strip()
            s_pos = p.find(s, local_pos)
            if s_pos < 0:
                s_pos = local_pos
            start = p_start + s_pos
            end = start + len(s)
            sentences.append((s, start, end))
            local_pos = s_pos + len(s)

    chunks = []
    idx = 0
    i = 0
    n = len(sentences)
    while i < n:
        start_i = i
        cur_len = 0
        # pack sentences until target_size
        while i < n and (cur_len + len(sentences[i][0]) + (1 if cur_len else 0)) <= target_size:
            cur_len += len(sentences[i][0]) + (1 if cur_len else 0)
            i += 1
        if start_i == i:  # single very long sentence
            i += 1
        start_char = sentences[start_i][1]
        end_char = sentences[i - 1][2]
        chunk_text = text[start_char:end_char]
        chunks.append({
            "chunk_index": idx,
            "text": chunk_text,
            "page_number": page_number,
            "start_char": start_char,
            "end_char": end_char
        })
        idx += 1
        if i >= n:
            break
        # move back to create overlap by characters
        back_char_target = overlap
        # find earliest sentence start within overlap from end_char
        j = i - 1
        while j >= 0 and (end_char - sentences[j][1]) < back_char_target:
            j -= 1
        i = max(j + 1, i)
    return chunks