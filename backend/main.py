from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router
from routes.resume import router as resume_router
from routes.interview import router as interview_router
from routes.coding import router as coding_router
from routes.roadmap import router as roadmap_router
from routes.analysis import router as analysis_router
from routes.dashboard import router as dashboard_router

app = FastAPI(title="CareerGPT")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to CareerGPT AI API"}

app.include_router(auth_router)
app.include_router(resume_router)
app.include_router(interview_router)
app.include_router(coding_router)
app.include_router(roadmap_router)
app.include_router(analysis_router)
app.include_router(dashboard_router)

