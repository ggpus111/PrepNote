import io
from typing import List
from PIL import Image

def _import_pytesseract():
    try:
        import pytesseract
        return pytesseract
    except Exception as e:
        raise RuntimeError("pytesseract가 설치되지 않았습니다. (pip install pytesseract)") from e

def ocr_image_bytes(image_bytes: bytes, lang: str = "eng+kor") -> str:
    pytesseract = _import_pytesseract()
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    text = pytesseract.image_to_string(img, lang=lang)
    return (text or "").strip()

def ocr_images(images: List[Image.Image], lang: str = "eng+kor") -> str:
    pytesseract = _import_pytesseract()
    chunks = []
    for img in images:
        t = pytesseract.image_to_string(img.convert("RGB"), lang=lang)
        t = (t or "").strip()
        if t:
            chunks.append(t)
    return "\n\n".join(chunks).strip()

def pdf_to_images_pymupdf(pdf_bytes: bytes, max_pages: int = 8, zoom: float = 2.0) -> List[Image.Image]:
    try:
        import fitz  # pymupdf
    except Exception as e:
        raise RuntimeError("pymupdf가 설치되지 않았습니다. (pip install pymupdf)") from e

    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    images: List[Image.Image] = []
    page_count = min(doc.page_count, max_pages)
    mat = fitz.Matrix(zoom, zoom)

    for i in range(page_count):
        page = doc.load_page(i)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
        images.append(img)

    return images
