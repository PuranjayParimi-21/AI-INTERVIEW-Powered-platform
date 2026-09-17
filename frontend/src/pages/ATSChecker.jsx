import React, { useState, useContext } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Award,
  BookOpen,
  Briefcase,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

const ATSChecker = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [activeTab, setActiveTab] = useState('skills');

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!file || !jobDescription) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('job_description', jobDescription);

    try {
      const res = await API.post('/api/resume/ats-check', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
      setActiveTab('skills');
    } catch (error) {
      console.error("ATS Check failed", error);
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--accent-emerald)';
    if (score >= 50) return 'var(--accent-amber)';
    return 'var(--accent-rose)';
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 80) return 'badge-emerald';
    if (score >= 50) return 'badge-amber';
    return 'badge-rose';
  };

  const getScoreLevel = (score) => {
    if (score >= 80) return 'Strong Match';
    if (score >= 60) return 'Moderate Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  return (
    <MainLayout>
      <div className="page-wrapper animate-fade-in">
        
        {/* Header section */}
        {result ? (
          <button 
            onClick={() => { setResult(null); setFile(null); }} 
            className="btn-secondary"
            style={{ alignSelf: 'flex-start', fontSize: '13px', padding: '8px 16px' }}
          >
            <ArrowLeft size={16} /> Evaluate Another Resume & JD
          </button>
        ) : (
          <div className="page-header">
            <span className="badge badge-cyan" style={{ alignSelf: 'flex-start' }}>
              <Sparkles size={14} /> ATS Keyword & Relevance Analyzer
            </span>
            <h1 className="page-title">ATS Match Checker</h1>
            <p className="page-subtitle">Compare your resume against a target job description to pinpoint missing keywords and optimize ATS score.</p>
          </div>
        )}
        
        {/* INPUT FORM (Side-by-Side) */}
        {!result && (
          <div className="card-grid-wide">
            
            {/* 1. Upload Resume */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={20} color="var(--accent-primary)" /> 1. Select PDF Resume
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>Upload your current resume file.</p>
                
                <div 
                  className="glass-card-hover"
                  style={{ 
                    border: '2px dashed var(--accent-primary)', 
                    padding: '36px 20px', 
                    borderRadius: '16px', 
                    textAlign: 'center', 
                    cursor: 'pointer', 
                    background: 'rgba(99, 102, 241, 0.03)'
                  }}
                  onClick={() => document.getElementById('ats-file-upload').click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files[0]) {
                      setFile(e.dataTransfer.files[0]);
                    }
                  }}
                >
                  <UploadCloud size={40} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
                  <p style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {file ? file.name : 'Click or Drag PDF File'}
                  </p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>PDF up to 10MB</p>
                  <input 
                    id="ats-file-upload" 
                    type="file" 
                    accept=".pdf" 
                    onChange={(e) => setFile(e.target.files[0])} 
                    style={{ display: 'none' }} 
                  />
                </div>
              </div>

              {file && (
                <div className="badge badge-emerald" style={{ padding: '10px 14px', borderRadius: '12px', width: '100%', justifyContent: 'center' }}>
                  <CheckCircle2 size={16} /> Selected: {file.name}
                </div>
              )}
            </div>
            
            {/* 2. Job Description Input */}
            <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Briefcase size={20} color="var(--accent-primary)" /> 2. Target Job Description
                </h2>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Paste the full role description or requirements text.</p>
              </div>
              
              <textarea 
                className="input-field" 
                style={{ height: '180px', resize: 'none', lineHeight: '1.5', fontSize: '13px' }} 
                placeholder="Paste job description text here (requirements, tech stack, responsibilities)..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              ></textarea>

              <button 
                onClick={handleCheck} 
                className="btn-primary" 
                disabled={!file || !jobDescription || loading} 
                style={{ width: '100%', padding: '14px', fontSize: '15px' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Sparkles className="pulse-dot" /> Calculating ATS Match Score...
                  </span>
                ) : 'Evaluate ATS Compatibility'}
              </button>
            </div>

          </div>
        )}

        {/* RESULTS SCREEN */}
        {result && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* Top Score Row */}
            <div className="card-grid-wide">
              
              {/* Overall Gauge Dial */}
              <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '20px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Overall ATS Alignment
                </h3>
                
                <div style={{ position: 'relative', width: '140px', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <svg width="140" height="140" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r="58" fill="none" stroke="var(--bg-tertiary)" strokeWidth="12" />
                    <circle 
                      cx="70" cy="70" r="58" fill="none" 
                      stroke={getScoreColor(result.match_score)} 
                      strokeWidth="12" 
                      strokeDasharray="364"
                      strokeDashoffset={364 - (364 * result.match_score) / 100}
                      strokeLinecap="round"
                      transform="rotate(-90 70 70)"
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', textAlign: 'center' }}>
                    <span style={{ fontSize: '36px', fontWeight: '800', lineHeight: 1 }}>{result.match_score}%</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Match</span>
                  </div>
                </div>

                <span className={`badge ${getScoreBadgeClass(result.match_score)}`} style={{ fontSize: '13px', padding: '6px 16px' }}>
                  {getScoreLevel(result.match_score)}
                </span>
              </div>

              {/* Pillars Breakdown Progress Bars */}
              <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Match Breakdown Pillars</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Granular alignment ratings across key resume dimensions.</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Skills Score Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13px' }}>
                      <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Award size={16} color="var(--accent-primary)" /> Skills Alignment
                      </span>
                      <span style={{ fontWeight: '800' }}>{result.skills_score}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${result.skills_score}%`, background: 'var(--accent-gradient)' }} />
                    </div>
                  </div>

                  {/* Education Score Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13px' }}>
                      <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BookOpen size={16} color="var(--accent-secondary)" /> Education Match
                      </span>
                      <span style={{ fontWeight: '800' }}>{result.education_score}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${result.education_score}%`, background: 'var(--accent-gradient-cyan)' }} />
                    </div>
                  </div>

                  {/* Projects Score Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', fontSize: '13px' }}>
                      <span style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Briefcase size={16} color="var(--accent-emerald)" /> Experience Relevance
                      </span>
                      <span style={{ fontWeight: '800' }}>{result.projects_score}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div className="progress-bar-fill" style={{ width: `${result.projects_score}%`, background: 'var(--accent-gradient-emerald)' }} />
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* Detailed Category Tabs */}
            <div className="glass-panel" style={{ padding: '32px' }}>
              
              {/* Tab Navigation */}
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '12px', marginBottom: '24px' }}>
                {[
                  { id: 'skills', label: 'Skills & Keywords', icon: Award },
                  { id: 'education', label: 'Education Match', icon: BookOpen },
                  { id: 'projects', label: 'Experience & Projects', icon: Briefcase }
                ].map((tab) => {
                  const IconComp = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                      <IconComp size={16} /> {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              <div>
                
                {/* 1. SKILLS & KEYWORDS TAB */}
                {activeTab === 'skills' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '6px' }}>AI Technical Analysis</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{result.skills_feedback}</p>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <AlertCircle size={16} color="var(--accent-rose)" /> Missing Job Description Keywords
                      </h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        Incorporate these terms into your resume to pass ATS automated filters:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {result.missing_keywords && result.missing_keywords.length > 0 ? (
                          result.missing_keywords.map((keyword, i) => (
                            <span key={i} className="badge badge-rose" style={{ fontSize: '13px', padding: '6px 14px' }}>
                              + {keyword}
                            </span>
                          ))
                        ) : (
                          <span className="badge badge-emerald">
                            <CheckCircle2 size={16} /> All core keywords matched successfully!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. EDUCATION TAB */}
                {activeTab === 'education' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Academic Requirement Analysis</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{result.education_feedback}</p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      padding: '16px', 
                      background: 'rgba(99, 102, 241, 0.08)', 
                      borderRadius: '14px', 
                      border: '1px solid rgba(99, 102, 241, 0.2)',
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      <Info color="var(--accent-primary)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Education Formatting Tip:</strong>
                        <p style={{ marginTop: '4px', lineHeight: '1.5' }}>Ensure your degree title, graduation year, and institution name match standard ATS parsing headers.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. PROJECTS TAB */}
                {activeTab === 'projects' && (
                  <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Experience & Project Relevance</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>{result.projects_feedback}</p>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      padding: '16px', 
                      background: 'rgba(16, 185, 129, 0.08)', 
                      borderRadius: '14px', 
                      border: '1px solid rgba(16, 185, 129, 0.2)',
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      <Info color="var(--accent-emerald)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Project Alignment Tip:</strong>
                        <p style={{ marginTop: '4px', lineHeight: '1.5' }}>Use quantitative bullet points (e.g. "Optimized query latency by 45%") matching the tools mentioned in the job post.</p>
                      </div>
                    </div>
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

export default ATSChecker;
