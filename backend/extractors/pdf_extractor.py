# backend/extractors/pdf_extractor.py
import fitz  # pymupdf
from backend.extractors.ocr_tesseract import ocr_image_bytes

def extract_pdf(file_bytes: bytes):
    """
    Returns dict:
    {
      pages: [
         {"page_number":1,"text":"...","is_scanned":False,"images":[{"ocr_text":"..."}]}
      ],
      full_text: "...",
      page_count:int
    }
    """
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    pages = []
    full_text_parts = []
    for i, page in enumerate(doc):
        page_text = page.get_text("text") or ""
        images_text = []
        # if few characters, we'll later treat as scanned
        is_scanned = len(page_text.strip()) < 40
        # extract images (if any)
        for img in page.get_images(full=True):
            xref = img[0]
            base = doc.extract_image(xref)
            img_bytes = base["image"]
            try:
                img_ocr = ocr_image_bytes(img_bytes)
            except Exception:
                img_ocr = ""
            images_text.append({"ocr_text": img_ocr})
        pages.append({"page_number": i+1, "text": page_text, "is_scanned": is_scanned, "images": images_text})
        if page_text:
            full_text_parts.append(page_text)
        else:
            # for scanned page, optionally OCR full page
            try:
                pix = page.get_pixmap(dpi=200)
                img_bytes = pix.tobytes()
                img_ocr = ocr_image_bytes(img_bytes)
                full_text_parts.append(img_ocr)
                # mark page text as OCR result if original was empty
                if not page_text:
                    pages[-1]["text"] = img_ocr
            except Exception:
                pass
    full_text = "\n\n".join([p for p in full_text_parts if p])
    return {"pages": pages, "full_text": full_text, "page_count": len(pages)}