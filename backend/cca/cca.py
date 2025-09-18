def augment_chunk(chunk_text: str, doc_summary: str, max_chars: int = 1600) -> tuple[str, str]:
    base = chunk_text or ""
    ctx = (doc_summary or "").strip()
    remaining = max(0, max_chars - len(base) - 12)
    ctx_snippet = ctx[:remaining]
    augmented = base
    if ctx_snippet:
        augmented = base + "\n\nCONTEXT: " + ctx_snippet
    compact = (ctx.replace("\n", " ").strip())[:200]
    return augmented, compact
