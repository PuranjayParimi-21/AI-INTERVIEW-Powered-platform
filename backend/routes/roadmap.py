from fastapi import APIRouter, Depends, Form
from services.auth_service import get_current_user
from services.gemini_service import generate_preparation_roadmap

router = APIRouter(prefix="/api/roadmap", tags=["roadmap"])

@router.post("/generate")
async def generate(company: str = Form(...), role: str = Form(...), user_id: str = Depends(get_current_user)):
    result = await generate_preparation_roadmap(company, role)
    return result
