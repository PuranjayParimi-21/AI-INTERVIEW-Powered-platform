from fastapi import APIRouter, Depends
from services.auth_service import get_current_user
from db import db
from datetime import datetime

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(user_id: str = Depends(get_current_user)):
    # 1. Get user profile
    user = db["users"].find_one({"_id": user_id})
    user_name = user.get("name", "User") if user else "User"
    user_email = user.get("email", "") if user else ""
    
    # 2. Get resumes history & latest score
    resumes = list(db["resumes"].find({"user_id": user_id}).sort("created_at", -1).limit(10))
    latest_resume_score = resumes[0].get("score", 0) if resumes else 0
    resume_history = [{"score": r.get("score", 0), "date": r.get("created_at").isoformat() if r.get("created_at") else ""} for r in resumes]
    
    # 3. Get ATS reports history & average score
    ats_reports = list(db["ats_reports"].find({"user_id": user_id}).sort("created_at", -1).limit(10))
    latest_ats_score = ats_reports[0].get("match_score", 0) if ats_reports else 0
    avg_ats_score = sum(r.get("match_score", 0) for r in ats_reports) // len(ats_reports) if ats_reports else 0
    ats_history = [{"match_score": r.get("match_score", 0), "date": r.get("created_at").isoformat() if r.get("created_at") else ""} for r in ats_reports]
    
    # 4. Get Mock Interviews count & average score
    interviews = list(db["interviews"].find({"user_id": user_id}).sort("created_at", -1).limit(10))
    interview_count = len(interviews)
    avg_interview_score = (sum(i.get("score", 0) for i in interviews) / len(interviews)) if interviews else 0
    # convert to out of 100 for display consistency, or keep out of 10
    avg_interview_score = round(avg_interview_score, 1)
    
    # 5. Get Skill gap report
    skill_reports = list(db["skill_reports"].find({"user_id": user_id}).sort("created_at", -1).limit(10))
    latest_skill_report = skill_reports[0] if skill_reports else None
    
    # Calculate skills match ratio: e.g., if target role has missing skills
    skills_matched_value = "0/0"
    if latest_resume := (resumes[0] if resumes else None):
        user_skills_count = len(latest_resume.get("skills", []))
        if latest_skill_report:
            missing_count = len(latest_skill_report.get("missing_skills", []))
            total_target_skills = user_skills_count + missing_count
            skills_matched_value = f"{user_skills_count}/{max(total_target_skills, 1)}"
        else:
            skills_matched_value = f"{user_skills_count}/{user_skills_count}"
            
    # 6. Get Job recommendations
    job_recs = list(db["job_recommendations"].find({"user_id": user_id}).sort("created_at", -1).limit(1))
    latest_jobs = job_recs[0].get("recommendations", []) if job_recs else []
    job_matches_count = len(latest_jobs)
    
    # 7. Generate Next Steps Dynamically
    next_steps = []
    if not resumes:
        next_steps.append({
            "text": "Upload your resume in the Resume Analyzer to extract your skills and get an initial score.",
            "type": "accent",
            "link": "/resume"
        })
    elif latest_resume_score < 75:
        next_steps.append({
            "text": f"Your latest resume score is {latest_resume_score}/100. Review our AI suggestions to optimize it.",
            "type": "warning",
            "link": "/resume"
        })
        
    if not ats_reports:
        next_steps.append({
            "text": "Paste a target Job Description to check your resume's ATS match score.",
            "type": "accent",
            "link": "/ats"
        })
    elif latest_ats_score < 70:
        next_steps.append({
            "text": f"Your ATS match score is low ({latest_ats_score}%). Add missing keywords to your resume.",
            "type": "error",
            "link": "/ats"
        })
        
    if not skill_reports:
        next_steps.append({
            "text": "Analyze your skill gaps for your target company and role.",
            "type": "warning",
            "link": "/skills"
        })
        
    if interview_count == 0:
        next_steps.append({
            "text": "Practice mock interviews using our AI Interview Simulator.",
            "type": "accent",
            "link": "/interview"
        })
    elif avg_interview_score < 7:
        next_steps.append({
            "text": f"Your average interview score is {avg_interview_score}/10. Practice more behavioral and technical questions.",
            "type": "warning",
            "link": "/interview"
        })
        
    if not job_recs:
        next_steps.append({
            "text": "Run the Job Matching Engine to see suitable vacancies matching your skills.",
            "type": "accent",
            "link": "/jobs"
        })
        
    # Provide defaults if everything is done
    if not next_steps:
        next_steps.append({
            "text": "Excellent progress! Practice advanced coding questions to prepare for placements.",
            "type": "success",
            "link": "/coding"
        })
        next_steps.append({
            "text": "Keep your LinkedIn profile optimized for headhunters and recruiters.",
            "type": "accent",
            "link": "/linkedin"
        })

    return {
        "user": {
            "name": user_name,
            "email": user_email
        },
        "stats": {
            "avg_ats_score": f"{avg_ats_score}%",
            "skills_matched": skills_matched_value,
            "mock_interviews": str(interview_count),
            "job_matches": str(job_matches_count)
        },
        "resume_history": resume_history,
        "ats_history": ats_history,
        "latest_job_matches": latest_jobs[:5],
        "next_steps": next_steps
    }
