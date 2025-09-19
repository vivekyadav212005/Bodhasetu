# backend/extractors/pdf_extractor.py
import fitz  # pymupdf
from backend.extractors.ocr_tesseract import ocr_image_bytes
from backend.utils.text_utils import extract_drawing_labels
from backend.chunking.chunker import semantic_chunks

def extract_pdf(file_bytes: bytes):
    """
    Extracts text from PDF with logic:
    - Digital pages: keep extracted text; OCR only on embedded images for extra content.
    - Scanned pages: OCR the whole page bitmap.
    Returns (full_text, chunks_meta, page_details)
    where chunks_meta contains semantic chunk maps with page/start/end.
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    page_details = []
    all_chunks = []
    all_text_parts = []
    chunk_idx = 0

    for page_num, page in enumerate(doc, start=1):
        page_text = page.get_text("text") or ""
        is_scanned = len(page_text.strip()) < 40
        image_ocr_texts = []

        # Always OCR embedded images for extra labels/annotations
        for img in page.get_images(full=True):
            try:
                xref = img[0]
                base = doc.extract_image(xref)
                img_bytes = base["image"]
                img_ocr = ocr_image_bytes(img_bytes)
                if img_ocr and img_ocr.strip():
                    image_ocr_texts.append(img_ocr.strip())
            except Exception:
                continue

        if is_scanned:
            try:
                pix = page.get_pixmap(dpi=200)
                img_bytes = pix.tobytes()
                page_ocr = ocr_image_bytes(img_bytes)
                page_text = page_ocr or ""
            except Exception:
                pass

        # merge page text with image OCRs
        combined_text = "\n".join([t for t in [page_text] + image_ocr_texts if t])
        labels = extract_drawing_labels(combined_text)

        # semantic chunks for this page
        page_chunks = semantic_chunks(combined_text, page_number=page_num, target_size=1200)
        for c in page_chunks:
            c["chunk_index"] = chunk_idx
            chunk_idx += 1
        all_chunks.extend(page_chunks)
        all_text_parts.append(combined_text)

        page_details.append({
            "page_number": page_num,
            "is_scanned": is_scanned,
            "drawing_labels": labels,
            "image_ocr_count": len(image_ocr_texts)
        })

    full_text = "\n\n".join([p for p in all_text_parts if p])
    return full_text, all_chunks, page_details