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
    clarified = query.strip()
    lines = [
        "You are a senior analyst answering for stakeholders using ONLY the provided context.",
        "Your output MUST be valid JSON. Keys: answer (Markdown), summary (2-3 sentences), actionable_items (array), sources (array of {doc_id, chunk_index, excerpt, page_number, score}).",
        "Quality requirements:",
        "- Interpret the user's intent correctly; if ambiguous, state assumptions explicitly.",
        "- Start the Markdown answer directly with a concise 1–2 sentence answer (no 'Direct Answer' heading).",
        "- Aim for 120–250 words overall. Prefer short paragraphs and bullet lists for readability.",
        "- Optionally include '## Key Details' (3–7 bullets with exact figures/dates/names) and '## Context & Rationale' (1 short paragraph).",
        "- If useful, add 'Assumptions & Clarifications' and 'Next Steps/Recommendations'.",
        "- Merge evidence from multiple chunks; do not skip important specifics.",
        "- Do not hallucinate. If the context is insufficient, say what's missing.",
        "- If the query seeks tasks or decisions, populate actionable_items with 3–8 concrete, distinct items.",
        "- Keep sources concise; excerpts should be short, indicative snippets.",
        "- In the 'answer' field, use plain Markdown only (no YAML, no code fences).",
        "Context:",
    ]
    for c in context_chunks:
        lines.append(
            f"- doc_id={c.get('doc_id')}, chunk_index={c.get('chunk_index')}, page={c.get('page_number')}, score={c.get('vector_score')}; "
            f"doc_summary={c.get('doc_summary','')[:220]}; excerpt={c.get('excerpt','')[:320]}"
        )
    lines.append(f"\nQuestion: {clarified}")
    lines.append(
        "Return JSON only. Example: {\"answer\":\"...\n\n## Key Details\n- item\",\"summary\":\"...\",\"actionable_items\":[\"...\"],\"sources\":[{\"doc_id\":\"...\",\"chunk_index\":0,\"excerpt\":\"...\",\"page_number\":1,\"score\":0.91}]}"
    )
    return "\n".join(lines)
