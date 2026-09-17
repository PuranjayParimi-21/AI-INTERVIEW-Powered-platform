from fastapi import APIRouter, Depends, Form
from services.auth_service import get_current_user
from services.gemini_service import generate_coding_questions, evaluate_coding_solution
from db import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/coding", tags=["coding"])

@router.post("/generate")
async def generate(topic: str = Form(...), difficulty: str = Form(...), user_id: str = Depends(get_current_user)):
    result = await generate_coding_questions(topic, difficulty)
    return result

@router.post("/evaluate")
async def evaluate(
    title: str = Form(...),
    description: str = Form(...),
    code: str = Form(...),
    language: str = Form(...),
    user_id: str = Depends(get_current_user)
):
    result = await evaluate_coding_solution(title, description, code, language)
    
    # Save to db
    doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "question_title": title,
        "code": code,
        "language": language,
        "score": result.get("score", 0),
        "time_complexity": result.get("time_complexity", "N/A"),
        "space_complexity": result.get("space_complexity", "N/A"),
        "feedback": result.get("feedback", ""),
        "created_at": datetime.utcnow()
    }
    db["coding_submissions"].insert_one(doc)
    return result
