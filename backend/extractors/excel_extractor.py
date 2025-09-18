# backend/extractors/excel_extractor.py
import io
import pandas as pd

def extract_excel(file_bytes: bytes):
    with io.BytesIO(file_bytes) as fh:
        xls = pd.read_excel(fh, sheet_name=None)
    sheets = []
    full_parts = []
    for sheet_name, df in xls.items():
        # convert df to list of row strings with cell coords
        rows = []
        for r_idx in range(len(df.index)):
            row_vals = []
            for c in df.columns:
                val = df.at[r_idx, c]
                row_vals.append("" if pd.isna(val) else str(val))
            rows.append(row_vals)
            full_parts.append(" | ".join(row_vals))
        sheets.append({"sheet_name": sheet_name, "rows": rows})
    full_text = "\n".join(full_parts)
    return {"sheets": sheets, "full_text": full_text}