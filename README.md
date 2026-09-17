# CareerGPT

CareerGPT is a production-ready, complete AI Placement & Career Assistant platform designed to help students prepare for internships and placements. It provides resume analysis, ATS matching, skill gap analysis, interview simulation, coding challenges, company roadmaps, job recommendation matching, and LinkedIn optimizations.

## Tech Stack

- **Frontend**: React 18, Vite, React Router DOM, Custom Glassmorphism CSS Design System, Axios, Lucide React Icons, Context API (Auth & Theme management).
- **Backend**: Python FastAPI, Uvicorn, Google Gemini API, PyPDF2 (PDF parsing), Passlib & Bcrypt (Password Hashing), Python-JOSE (JWT Authentication), Pandas, NumPy, Scikit-learn.
- **Database**: MongoDB with PyMongo (featuring automatic fallback from MongoDB Atlas to local instance for offline resilience).

## Project Structure

```
CareerGPT/
├── frontend/                     # React + Vite frontend application
│   ├── src/
│   │   ├── api.js                # Axios client configured with JWT auto-injection
│   │   ├── App.jsx               # Main application routing and route guards
│   │   ├── components/
│   │   │   └── layout/           # Sidebar navigation, Navbar, MainLayout frame
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & JWT storage management
│   │   │   └── ThemeContext.jsx  # Light/Dark glassmorphic theme state manager
│   │   └── pages/                # Feature modules (Dashboard, ATS, Resume, Interview, Coding, etc.)
│   └── netlify.toml              # Netlify SPA redirect configuration
│
└── backend/                      # FastAPI Python backend server
    ├── main.py                   # Application initialization, middleware, and router registrations
    ├── config.py                 # Centralized environment variable loader
    ├── db.py                     # MongoDB connection pool with auto-fallback rules
    ├── routes/                   # Modular API endpoints
    │   ├── auth.py               # Signup, Login, and User Profile (/api/auth)
    │   ├── resume.py             # PDF Resume analysis & ATS checking (/api/resume)
    │   ├── interview.py          # AI Mock Interview question generation & scoring (/api/interview)
    │   ├── coding.py             # Dynamic coding challenges & code evaluation (/api/coding)
    │   ├── roadmap.py            # Target company preparation roadmaps (/api/roadmap)
    │   ├── analysis.py           # Skill gap detection, LinkedIn profile & job matching (/api/analysis)
    │   └── dashboard.py          # Aggregated user metrics and dynamic next steps (/api/dashboard)
    └── services/                 # Business logic and external service integrators
        ├── gemini_service.py     # Gemini AI prompt templates for resume, interview, coding & roadmaps
        ├── auth_service.py       # Password hashing & JWT token verification helpers
        └── pdf_service.py        # PyPDF2 text extraction from uploaded PDF resumes
```

## Database Collections

The application reads and writes records to the following MongoDB collections:
- `users`: User accounts, emails, registration timestamps, and hashed passwords.
- `resumes`: Extracted PDF resume text, scores (0-100), suggestions, identified skills, and contact info.
- `ats_reports`: Job description match percentages, missing keywords, section breakdown scores, and feedback.
- `interviews`: Simulated mock questions, user answers, scores, and AI evaluation feedback.
- `coding_submissions`: Coding challenge solutions, programming languages, scores, time/space complexity analysis, and feedback.
- `skill_reports`: Target role gap analyses, missing skills list, and recommended learning resources.
- `job_recommendations`: Recommended job roles, match percentages, target companies, and locations.

## API Endpoints Reference

| Route Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/signup` | Register a new user account |
| | `POST` | `/api/auth/login` | Authenticate user and receive JWT access token |
| | `GET` | `/api/auth/me` | Get current logged-in user profile |
| **Resume** | `POST` | `/api/resume/analyze` | Upload PDF resume for AI parsing and scoring |
| | `POST` | `/api/resume/ats-check` | Compare PDF resume against a Job Description for ATS match |
| | `GET` | `/api/resume/history` | Fetch past resume analysis reports |
| **Interview** | `POST` | `/api/interview/generate` | Generate mock interview questions by role & type |
| | `POST` | `/api/interview/evaluate` | Evaluate candidate transcript answer with score & feedback |
| **Coding** | `POST` | `/api/coding/generate` | Generate coding challenge by topic and difficulty |
| | `POST` | `/api/coding/evaluate` | Evaluate submitted code solution (time/space complexity) |
| **Roadmap** | `POST` | `/api/roadmap/generate` | Generate customized preparation roadmap for company & role |
| **Analysis** | `POST` | `/api/analysis/skill-gap` | Analyze skill gaps between current skills and target role |
| | `GET` | `/api/analysis/skill-gap/history` | Fetch skill gap report history |
| | `POST` | `/api/analysis/job-match` | Generate recommended job roles based on parsed resume |
| | `GET` | `/api/analysis/job-match/history` | Fetch recommended job history |
| | `POST` | `/api/analysis/linkedin` | Analyze & optimize LinkedIn headline, about section, and skills |
| **Dashboard** | `GET` | `/api/dashboard/stats` | Fetch aggregate stats, history charts, and dynamic next steps |

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Running locally or hosted on MongoDB Atlas)
- Google Gemini API Key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On Unix/macOS:
   source venv/bin/activate

   pip install -r requirements.txt
   ```
3. Setup environment variables in a `.env` file inside `backend/`:
   ```env
   MONGO_URL=mongodb://localhost:27017
   DATABASE_NAME=careergpt_db
   SECRET_KEY=your_super_secret_jwt_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Run the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install node dependencies:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Deployment Instructions

### Frontend (Netlify)
1. Set the build command to `npm run build` and publish directory to `dist`.
2. Configure environment variable `VITE_API_URL` to point to your deployed backend address.
3. Ensure `netlify.toml` is configured for Single Page Application routing (redirects `/*` to `/index.html`).

### Backend (Render)
1. Select the `Python` web service environment.
2. Set the build command to `pip install -r requirements.txt`.
3. Set the start command to `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Add environment variables: `MONGO_URL`, `DATABASE_NAME`, `SECRET_KEY`, and `GEMINI_API_KEY`.
