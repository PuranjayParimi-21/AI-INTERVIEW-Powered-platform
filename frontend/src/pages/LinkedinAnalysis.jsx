import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import API from '../api';
import { Linkedin, Sparkles, Award, CheckCircle2, AlertCircle } from 'lucide-react';

const LinkedinAnalysis = () => {
  const [headline, setHeadline] = useState('');
  const [about, setAbout] = useState('');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('headline', headline);
    formData.append('about', about);
    formData.append('skills', skills);

    try {
      const res = await API.post('/api/analysis/linkedin', formData);
      setResult(res.data);
    } catch (error) {
      console.error("LinkedIn analysis failed", error);
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="page-wrapper animate-fade-in">
        
        <div className="page-header">
          <span className="badge badge-cyan" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={14} /> AI Profile Optimizer
          </span>
          <h1 className="page-title">LinkedIn Profile Audit</h1>
          <p className="page-subtitle">Optimize your headline, summary, and skills list for recruiters and search ranking.</p>
        </div>
        
        {/* Input Form */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>LinkedIn Headline *</label>
              <input 
                type="text" 
                className="input-field" 
                value={headline} 
                onChange={(e) => setHeadline(e.target.value)} 
                required 
                placeholder="e.g. Software Engineer @ TechCorp | React, Node.js & Cloud Architecture" 
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>About / Summary Section *</label>
              <textarea 
                className="input-field" 
                rows="4" 
                value={about} 
                onChange={(e) => setAbout(e.target.value)} 
                required 
                placeholder="Paste your LinkedIn 'About' paragraph summary here..."
              ></textarea>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Skills Currently Listed *</label>
              <textarea 
                className="input-field" 
                rows="2" 
                value={skills} 
                onChange={(e) => setSkills(e.target.value)} 
                required 
                placeholder="e.g. JavaScript, Python, System Design, REST APIs, Git"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '14px 28px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles className="pulse-dot" /> Auditing Profile Text...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Linkedin size={18} /> Audit LinkedIn Profile
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Results Screen */}
        {result && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Profile Audit Assessment</h2>
                <span className="badge badge-purple">AI Assessment Complete</span>
              </div>

              <div className="card-grid-2" style={{ marginBottom: '24px' }}>
                {/* Headline Score */}
                <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>Headline Strength</span>
                    <span className={`badge ${result.headline_score >= 70 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '14px' }}>
                      {result.headline_score}%
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{result.headline_feedback}</p>
                </div>

                {/* About Score */}
                <div style={{ padding: '24px', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px' }}>About Section Clarity</span>
                    <span className={`badge ${result.about_score >= 70 ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '14px' }}>
                      {result.about_score}%
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{result.about_feedback}</p>
                </div>
              </div>

              {/* Suggested Skills to Add */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '12px' }}>Recommended Keywords for Recruiter Searches</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.suggested_skills?.map((skill, i) => (
                    <span key={i} className="badge badge-cyan" style={{ fontSize: '13px', padding: '6px 14px' }}>
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LinkedinAnalysis;
