# backend/extractors/ocr_tesseract.py
import io
from PIL import Image
import pytesseract
import os
from dotenv import load_dotenv

load_dotenv()
TESSERACT_CMD = os.getenv("TESSERACT_CMD")
if TESSERACT_CMD:
    pytesseract.pytesseract.tesseract_cmd = TESSERACT_CMD

def ocr_image_bytes(img_bytes: bytes, lang: str = "eng") -> str:
    im = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    text = pytesseract.image_to_string(im, lang=lang)
    return text