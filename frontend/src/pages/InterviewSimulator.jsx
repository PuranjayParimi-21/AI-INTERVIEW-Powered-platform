import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  RefreshCw,
  HelpCircle,
  Brain,
  Briefcase,
  Target,
  Code,
  Users,
  Layers,
  ArrowRight,
  ChevronLeft,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import API from '../api';

const POPULAR_ROLES = [
  "Fullstack Software Engineer",
  "Frontend React Developer",
  "Backend Python / Node Engineer",
  "Data Scientist & AI Specialist",
  "DevOps & Cloud Architect",
  "Product Manager"
];

const INTERVIEW_TYPES = [
  {
    id: "Technical",
    title: "Technical & System Design",
    description: "Data structures, algorithms, system architecture, scalability, and code design trade-offs.",
    icon: Code,
    gradient: "linear-gradient(135deg, #6366f1, #a855f7)",
    badge: "Engineering"
  },
  {
    id: "Behavioral",
    title: "Behavioral (STAR Method)",
    description: "Leadership, conflict resolution, technical debt management, ownership, and teamwork.",
    icon: Users,
    gradient: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    badge: "STAR Method"
  },
  {
    id: "HR",
    title: "HR & Culture Fit",
    description: "Motivation, career growth aspirations, soft skills, and workplace culture alignment.",
    icon: Target,
    gradient: "linear-gradient(135deg, #10b981, #059669)",
    badge: "Cultural"
  },
  {
    id: "Domain",
    title: "Domain & Architecture",
    description: "Microservices, cloud hosting (AWS/GCP), security audits, and database optimization.",
    icon: Layers,
    gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
    badge: "Architecture"
  }
];

const defaultQuestions = [
  "Tell me about a complex technical project you built recently. What were the core architectural challenges and how did you resolve them?",
  "How do you handle disagreements with teammates or engineering leads on technical decisions?",
  "Describe a situation where a production service or API failed under high traffic. What steps did you take to debug and restore it?",
  "Why do you want to join our engineering organization, and what key skills do you bring to our team?",
  "How do you optimize slow database queries and frontend rendering performance in a modern web application?"
];

const InterviewSimulator = () => {
  const [step, setStep] = useState(1); // 1: Setup & Generate, 2: Workspace Practice
  const [role, setRole] = useState('Fullstack Software Engineer');
  const [type, setType] = useState('Technical');
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState(defaultQuestions);
  const [activeQ, setActiveQ] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedbacks, setFeedbacks] = useState({});

  const currentAnswer = answers[activeQ] || '';
  const currentFeedback = feedbacks[activeQ] || null;

  const handleAnswerChange = (e) => {
    const val = e.target.value;
    setAnswers((prev) => ({ ...prev, [activeQ]: val }));
  };

  const handleGenerateQuestions = async () => {
    if (!role.trim()) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('role', role);
    formData.append('interview_type', type);

    try {
      const res = await API.post('/api/interview/generate', formData);
      if (res.data.questions && res.data.questions.length > 0) {
        setQuestions(res.data.questions);
      }
      setActiveQ(0);
      setAnswers({});
      setFeedbacks({});
      setStep(2); // Move to Step 2: Generated Questions Practice Workspace
    } catch (error) {
      console.error("Failed to generate fresh questions", error);
      // Fallback transition
      setStep(2);
    }
    setLoading(false);
  };

  const handleEvaluate = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('question', questions[activeQ]);
    formData.append('answer', currentAnswer);

    try {
      const res = await API.post('/api/interview/evaluate', formData);
      setFeedbacks((prev) => ({ ...prev, [activeQ]: res.data }));
    } catch (error) {
      console.error("Evaluation failed", error);
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="page-wrapper animate-fade-in">
        
        {/* Page Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-purple" style={{ alignSelf: 'flex-start', marginBottom: '8px' }}>
              <Sparkles size={14} /> AI Interview Studio
            </span>
            <h1 className="page-title">AI Interview Simulator</h1>
            <p className="page-subtitle">
              {step === 1 
                ? "First select your target job role and interview type to generate personalized questions." 
                : `Practicing ${type} interview questions for ${role}.`
              }
            </p>
          </div>

          {step === 2 && (
            <button 
              onClick={() => setStep(1)}
              className="btn-secondary"
              style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <ChevronLeft size={16} /> Re-configure Job & Type
            </button>
          )}
        </div>

        {/* STEP 1: JOB ROLE & INTERVIEW TYPE GENERATION SETUP */}
        {step === 1 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Card 1: Job Role Input */}
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>1. Enter Target Job Role</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Specify the exact role you are applying or preparing for.</p>
                </div>
              </div>

              {/* Role Text Input */}
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  className="input-field" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  placeholder="e.g. Senior Fullstack Developer, Data Scientist, DevOps Engineer..."
                  style={{ padding: '14px 16px 14px 44px', fontSize: '15px', fontWeight: '700' }}
                />
                <Target size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
              </div>

              {/* Quick Select Preset Role Pills */}
              <div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
                  Popular Role Presets:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {POPULAR_ROLES.map((r, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRole(r)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '10px',
                        fontSize: '12px',
                        fontWeight: '700',
                        background: role === r ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                        color: role === r ? '#ffffff' : 'var(--text-secondary)',
                        border: '1px solid var(--border-color)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 2: Interview Type Selection */}
            <div className="glass-panel" style={{ padding: '28px', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(168, 85, 247, 0.12)', color: 'var(--accent-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={22} />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 2px 0' }}>2. Choose Interview Type</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>Select the category of interview questions you want to practice.</p>
                </div>
              </div>

              {/* 4 Type Choice Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {INTERVIEW_TYPES.map((t) => {
                  const IconComponent = t.icon;
                  const isSelected = type === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setType(t.id)}
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: isSelected ? 'var(--bg-secondary)' : 'var(--glass-bg)',
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        boxShadow: isSelected ? '0 6px 20px rgba(99, 102, 241, 0.25)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.gradient, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconComponent size={20} />
                          </div>
                          <span className="badge badge-purple" style={{ fontSize: '10px' }}>
                            {t.badge}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                          {t.title}
                        </h4>
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, margin: 0 }}>
                          {t.description}
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '10px', fontSize: '12px', fontWeight: '700', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}>
                        <span>{isSelected ? '✓ Selected' : 'Select Category'}</span>
                        {isSelected && <CheckCircle2 size={16} color="var(--accent-primary)" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Bar: Generate Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={handleGenerateQuestions}
                className="btn-primary"
                disabled={loading || !role.trim()}
                style={{ padding: '16px 32px', fontSize: '16px', borderRadius: '14px' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles className="pulse-dot" /> Generating AI Questions for {role}...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={18} /> Generate Questions & Start Interview <ArrowRight size={18} />
                  </span>
                )}
              </button>
            </div>

          </div>
        )}

        {/* STEP 2: GENERATED QUESTIONS PRACTICE WORKSPACE */}
        {step === 2 && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Top Bar Status */}
            <div className="glass-panel" style={{ padding: '16px 24px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.12)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Brain size={20} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>{role}</span>
                    <span className="badge badge-purple" style={{ fontSize: '11px' }}>{type} Interview</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{questions.length} Tailored Questions Active</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button 
                  onClick={handleGenerateQuestions}
                  className="btn-secondary"
                  disabled={loading}
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                  title="Generate Fresh Questions"
                >
                  <RefreshCw size={14} className={loading ? "pulse-dot" : ""} /> Regenerate Questions
                </button>

                <button 
                  onClick={() => setStep(1)}
                  className="btn-secondary"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                >
                  <Sliders size={14} /> Change Settings
                </button>
              </div>
            </div>

            {/* Question Navigation Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveQ(i)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: '700',
                    background: activeQ === i ? 'var(--accent-gradient)' : feedbacks[i] ? 'rgba(16, 185, 129, 0.15)' : 'var(--glass-bg)',
                    color: activeQ === i ? '#ffffff' : feedbacks[i] ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap',
                    boxShadow: activeQ === i ? '0 4px 14px rgba(99, 102, 241, 0.3)' : 'none'
                  }}
                >
                  Question {i + 1} {feedbacks[i] && '✓'}
                </button>
              ))}
            </div>

            {/* Split Screen Workspace: Question Card Left + Candidate Answer Studio Right */}
            <div className="dashboard-split-grid">
              
              {/* Left Column: Prominent Question Card */}
              <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px', borderRadius: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="badge badge-purple" style={{ fontSize: '11px', padding: '4px 12px' }}>
                      {type} Question
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700' }}>
                      Q{activeQ + 1} of {questions.length}
                    </span>
                  </div>

                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                    <HelpCircle size={24} />
                  </div>

                  <h3 style={{ fontSize: '20px', fontWeight: '800', lineHeight: 1.5, color: 'var(--text-primary)', margin: 0 }}>
                    "{questions[activeQ]}"
                  </h3>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={14} color="var(--accent-primary)" />
                  <span>Tip: Structure your response with clear technical detail and the STAR framework.</span>
                </div>
              </div>

              {/* Right Column: Candidate Response & AI Scoring */}
              <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Your Response</h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Word Count: {currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0} words
                  </span>
                </div>

                <textarea
                  className="input-field"
                  rows="8"
                  value={currentAnswer}
                  onChange={handleAnswerChange}
                  placeholder={`Type or dictate your response for ${role}...`}
                  style={{ fontSize: '14px', lineHeight: 1.6 }}
                />

                <button 
                  onClick={handleEvaluate} 
                  className="btn-primary" 
                  disabled={loading || !currentAnswer.trim()}
                  style={{ padding: '14px' }}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Sparkles className="pulse-dot" /> Scoring Answer...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Award size={16} /> Submit Answer for AI Scoring
                    </span>
                  )}
                </button>

                {/* AI Score Feedback Section */}
                {currentFeedback && (
                  <div className="animate-fade-in" style={{ padding: '20px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: '800', fontSize: '15px' }}>AI Content Audit</span>
                      <span className={`badge ${currentFeedback.score >= 80 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '14px', padding: '4px 12px' }}>
                        {currentFeedback.score} / 100 Score
                      </span>
                    </div>

                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                      {currentFeedback.feedback}
                    </p>

                    {currentFeedback.suggested_answer && (
                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--accent-emerald)', display: 'block', marginBottom: '4px' }}>
                          ✓ Model High-Score Answer:
                        </span>
                        <p style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.5, fontStyle: 'italic', margin: 0 }}>
                          "{currentFeedback.suggested_answer}"
                        </p>
                      </div>
                    )}
                  </div>
                )}

              </div>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default InterviewSimulator;
