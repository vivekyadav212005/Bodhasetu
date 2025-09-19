# backend/extractors/excel_extractor.py
import io
import pandas as pd
from openpyxl import load_workbook
from backend.chunking.chunker import semantic_chunks

def extract_excel(file_bytes: bytes):
    """
    Returns (full_text, chunks_meta, sheet_details)
    - Uses pandas for table text
    - Attempts to extract chart titles (if present via openpyxl)
    - Uses semantic chunking across concatenated row text per sheet
    """
    with io.BytesIO(file_bytes) as fh:
        xls = pd.read_excel(fh, sheet_name=None)

    # Load workbook again to read chart titles
    wb = load_workbook(io.BytesIO(file_bytes), data_only=True, read_only=True)

    all_chunks = []
    all_text_parts = []
    sheet_details = []
    chunk_idx = 0

    for sheet_name, df in xls.items():
        # rows as pipe-separated strings for readability
        row_lines = []
        for r_idx in range(len(df.index)):
            row_vals = []
            for c in df.columns:
                val = df.at[r_idx, c]
                row_vals.append("" if (pd.isna(val) if hasattr(pd, 'isna') else val is None) else str(val))
            if any(v.strip() for v in row_vals):
                row_lines.append(" | ".join(row_vals))

        sheet_text = "\n".join(row_lines)

        # chart titles (best-effort)
        chart_titles = []
        if sheet_name in wb.sheetnames:
            ws = wb[sheet_name]
            for obj in getattr(ws, '_charts', []) or []:
                title = getattr(obj, 'title', None)
                if title:
                    # openpyxl RichText -> str
                    try:
                        chart_titles.append(str(title))
                    except Exception:
                        pass
        if chart_titles:
            sheet_text = sheet_text + "\n" + "\n".join(chart_titles)

        # chunk per sheet
        chunks = semantic_chunks(sheet_text, page_number=sheet_name, target_size=1200)
        for c in chunks:
            c["chunk_index"] = chunk_idx
            chunk_idx += 1
        all_chunks.extend(chunks)
        all_text_parts.append(sheet_text)
        sheet_details.append({"sheet_name": sheet_name, "rows": len(row_lines), "chart_titles": chart_titles})

    full_text = "\n\n".join([p for p in all_text_parts if p])
    return full_text, all_chunks, sheet_details