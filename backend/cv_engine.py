import cv2
import numpy as np
import base64
import pymupdf as fitz
from typing import Tuple, Dict, Any

def preprocess_prescription_image(image_bytes: bytes) -> Dict[str, Any]:
    """
    Applies OpenCV Contrast Limited Adaptive Histogram Equalization (CLAHE),
    denoising, and thresholding to make degraded/handwritten Indian prescriptions machine readable.
    Supports both image files (JPG, PNG, WEBP) and PDF documents.
    Returns exact natural dimensions (naturalWidth, naturalHeight) for bounding-box scaling.
    """
    if not image_bytes:
        raise ValueError("Empty file bytes provided.")

    img = None

    # Detect PDF file header (%PDF)
    if image_bytes.startswith(b'%PDF'):
        try:
            doc = fitz.open(stream=image_bytes, filetype="pdf")
            page_imgs = []
            for page in doc:
                pix = page.get_pixmap(dpi=150)
                img_data = pix.tobytes("png")
                nparr_p = np.frombuffer(img_data, np.uint8)
                img_p = cv2.imdecode(nparr_p, cv2.IMREAD_COLOR)
                if img_p is not None:
                    page_imgs.append(img_p)

            if page_imgs:
                # If multi-page PDF, normalize width to page 1 and stack vertically
                target_w = page_imgs[0].shape[1]
                resized_pages = []
                for p_img in page_imgs:
                    if p_img.shape[1] != target_w:
                        h = int(p_img.shape[0] * (target_w / p_img.shape[1]))
                        p_img = cv2.resize(p_img, (target_w, h))
                    resized_pages.append(p_img)
                img = np.vstack(resized_pages) if len(resized_pages) > 1 else resized_pages[0]
        except Exception as e:
            print(f"[PDF Conversion Error] Failed to render PDF to image matrix: {e}")

    # Fallback to standard OpenCV decode for JPG / PNG / WEBP images
    if img is None:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image or PDF file provided.")

    height, width = img.shape[:2]

    # Convert to Grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))
    enhanced = clahe.apply(gray)

    # Slight Denoising to reduce paper grain while preserving pen strokes
    denoised = cv2.fastNlMeansDenoising(enhanced, h=7)

    # Encode back to JPEG base64
    _, buffer = cv2.imencode('.jpg', denoised, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
    processed_b64 = base64.b64encode(buffer).decode('utf-8')

    return {
        "naturalWidth": width,
        "naturalHeight": height,
        "processed_b64": processed_b64,
        "processed_bytes": buffer.tobytes()
    }

