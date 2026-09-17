from fastapi import APIRouter, Depends, Form, HTTPException
from services.auth_service import get_current_user
from services.gemini_service import detect_skill_gap, analyze_linkedin_profile, generate_job_matches
from db import db
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

@router.post("/skill-gap")
async def skill_gap(
    role: str = Form(...), 
    current_skills: str = Form(...), 
    company: str = Form(None), 
    user_id: str = Depends(get_current_user)
):
    result = await detect_skill_gap(role, current_skills, company)
    
    # Save skill gap report to DB
    report_doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "role": role,
        "company": company,
        "current_skills": current_skills,
        "missing_skills": result.get("missing_skills", []),
        "learning_resources": result.get("learning_resources", []),
        "created_at": datetime.utcnow()
    }
    db["skill_reports"].insert_one(report_doc)
    return report_doc

@router.get("/skill-gap/history")
def get_skill_gap_history(user_id: str = Depends(get_current_user)):
    reports = list(db["skill_reports"].find({"user_id": user_id}).sort("created_at", -1).limit(10))
    return reports

@router.post("/job-match")
async def job_match(user_id: str = Depends(get_current_user)):
    resume = db["resumes"].find_one({"user_id": user_id}, sort=[("created_at", -1)])
    if not resume:
        raise HTTPException(status_code=400, detail="Please upload and analyze your resume first.")
    
    skills = resume.get("skills", [])
    result = await generate_job_matches(skills)
    
    doc = {
        "_id": str(uuid.uuid4()),
        "user_id": user_id,
        "resume_id": resume["_id"],
        "recommendations": result.get("recommendations", []),
        "created_at": datetime.utcnow()
    }
    db["job_recommendations"].insert_one(doc)
    return doc

@router.get("/job-match/history")
def get_job_match_history(user_id: str = Depends(get_current_user)):
    history = list(db["job_recommendations"].find({"user_id": user_id}).sort("created_at", -1).limit(10))
    return history

@router.post("/linkedin")
async def linkedin(headline: str = Form(...), about: str = Form(...), skills: str = Form(...), user_id: str = Depends(get_current_user)):
    result = await analyze_linkedin_profile(headline, about, skills)
    return result

