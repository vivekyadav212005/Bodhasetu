from typing import List, Dict


def _truncate(text: str, max_chars: int) -> str:
    return text[:max_chars]


def document_summary_prompt(raw_text: str, doc_title: str, max_chars: int = 16000) -> str:
    text = _truncate(raw_text or "", max_chars)
    return (
        "You are an expert technical summarizer. Read the document and output JSON ONLY.\n"
        "Return keys: summary (2-4 sentences), bullets (3-6), actionable_items (4-8), chunk_summaries (optional).\n"
        "chunk_summaries should be an array of objects: {chunk_index:int, summary:str}.\n"
        "Keep it concise, specific, and use plain English.\n"
        "Document title: " + (doc_title or "Untitled") + "\n"
        "Document:\n" + text + "\n\n"
        "Output strictly in JSON, no extra text. Example: {\"summary\":\"...\",\"bullets\":[\"...\"],\"actionable_items\":[\"...\"],\"chunk_summaries\":[{\"chunk_index\":0,\"summary\":\"...\"}]}"
    )


def qa_prompt(query: str, context_chunks: List[Dict]) -> str:
    # context_chunks: each has doc_id, chunk_index, page_number, excerpt, doc_summary
    # Light query clarification for better interpretation
    clarified = query.strip()
    lines = [
        "You are an expert assistant. Use the provided context to answer the question.",
        "- If the question is ambiguous, infer likely intent but state any assumptions.",
        "- Prefer quoting exact figures, dates, and names from context.",
        "- Output strictly JSON with keys: answer, summary, actionable_items (array), sources (array of {doc_id, chunk_index, excerpt, page_number, score}).",
        "- sources must be concise human-readable: excerpt should be a short snippet.",
        "Context:",
    ]
    for c in context_chunks:
        lines.append(
            f"- doc_id={c.get('doc_id')}, chunk_index={c.get('chunk_index')}, page={c.get('page_number')}, score={c.get('vector_score')}; "
            f"doc_summary={c.get('doc_summary','')[:200]}; excerpt={c.get('excerpt','')[:300]}"
        )
    lines.append(f"\nQuestion: {clarified}")
    lines.append(
        "Return JSON only. Example: {\"answer\":\"...\",\"summary\":\"...\",\"actionable_items\":[\"...\"],\"sources\":[{\"doc_id\":\"...\",\"chunk_index\":0,\"excerpt\":\"...\",\"page_number\":1,\"score\":0.91}]}"
    )
    return "\n".join(lines)
