from fastapi import APIRouter, Depends, Form
from services.auth_service import get_current_user
from services.gemini_service import generate_interview_questions, evaluate_interview_answer
from db import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/interview", tags=["interview"])

@router.post("/generate")
async def generate(role: str = Form(...), interview_type: str = Form(...), user_id: str = Depends(get_current_user)):
    result = await generate_interview_questions(role, interview_type)
    return result

@router.post("/evaluate")
async def evaluate(question: str = Form(...), answer: str = Form(...), user_id: str = Depends(get_current_user)):
    result = await evaluate_interview_answer(question, answer)
    
    # Save to db
    doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "question": question,
        "answer": answer,
        "score": result.get("score", 0),
        "feedback": result.get("feedback", ""),
        "created_at": datetime.utcnow()
    }
    db["interviews"].insert_one(doc)
    return result
