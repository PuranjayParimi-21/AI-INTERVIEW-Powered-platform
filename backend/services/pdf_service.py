import io
import PyPDF2
from fastapi import UploadFile

async def extract_text_from_pdf(file: UploadFile) -> str:
    content = await file.read()
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
    text = ""
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text
