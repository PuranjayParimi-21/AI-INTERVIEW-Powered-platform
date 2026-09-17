from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from services.auth_service import get_current_user
from services.pdf_service import extract_text_from_pdf
from services.gemini_service import analyze_resume_with_gemini, calculate_ats_score
from db import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/resume", tags=["resume"])

@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...), user_id: str = Depends(get_current_user)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    text = await extract_text_from_pdf(file)
    analysis_result = await analyze_resume_with_gemini(text)
    
    resumes_collection = db["resumes"]
    
    resume_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "parsed_text": text,
        "skills": analysis_result.get("skills", []),
        "education": analysis_result.get("education", []),
        "certifications": analysis_result.get("certifications", []),
        "projects": analysis_result.get("projects", []),
        "score": analysis_result.get("score", 0),
        "suggestions": analysis_result.get("suggestions", []),
        "contact_info": analysis_result.get("contact_info", {"email": "", "phone": "", "linkedin": "", "github": ""}),
        "experience": analysis_result.get("experience", []),
        "ats_friendly": analysis_result.get("ats_friendly", False),
        "created_at": datetime.utcnow()
    }
    
    resumes_collection.insert_one(resume_doc)
    return resume_doc

@router.post("/ats-check")
async def ats_check(
    job_description: str = Form(...),
    file: UploadFile = File(...), 
    user_id: str = Depends(get_current_user)
):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
        
    text = await extract_text_from_pdf(file)
    ats_result = await calculate_ats_score(text, job_description)
    
    ats_collection = db["ats_reports"]
    
    report_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "job_description": job_description,
        "match_score": ats_result.get("match_score", 0),
        "skills_score": ats_result.get("skills_score", ats_result.get("match_score", 0)),
        "education_score": ats_result.get("education_score", 50),
        "projects_score": ats_result.get("projects_score", 50),
        "missing_keywords": ats_result.get("missing_keywords", []),
        "skills_feedback": ats_result.get("skills_feedback", ""),
        "education_feedback": ats_result.get("education_feedback", ""),
        "projects_feedback": ats_result.get("projects_feedback", ""),
        "created_at": datetime.utcnow()
    }
    
    ats_collection.insert_one(report_doc)
    return report_doc

@router.get("/history")
def get_resume_history(user_id: str = Depends(get_current_user)):
    resumes = list(db["resumes"].find({"user_id": user_id}).sort("created_at", -1).limit(10))
    return resumes
