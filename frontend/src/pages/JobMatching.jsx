import React, { useState, useEffect } from 'react';
import MainLayout from '../components/layout/MainLayout';
import API from '../api';
import { Briefcase, Sparkles, MapPin, Building2, ExternalLink, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const JobMatching = () => {
  const [resumes, setResumes] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);

  useEffect(() => {
    const initData = async () => {
      try {
        const resumeRes = await API.get('/api/resume/history');
        setResumes(resumeRes.data);

        if (resumeRes.data.length > 0) {
          const historyRes = await API.get('/api/analysis/job-match/history');
          if (historyRes.data && historyRes.data.length > 0) {
            setRecommendations(historyRes.data[0].recommendations || []);
          }
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
      setLoading(false);
    };
    initData();
  }, []);

  const handleJobMatch = async () => {
    setMatching(true);
    try {
      const res = await API.post('/api/analysis/job-match');
      setRecommendations(res.data.recommendations || []);
    } catch (error) {
      console.error("Job matching generation failed", error);
    }
    setMatching(false);
  };

  return (
    <MainLayout>
      <div className="page-wrapper animate-fade-in">
        
        <div className="page-header">
          <span className="badge badge-purple" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={14} /> AI Talent & Job Match Engine
          </span>
          <h1 className="page-title">Curated Job Matches</h1>
          <p className="page-subtitle">AI-matched opportunities matching your parsed skills and resume profile.</p>
        </div>

        {loading ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
            <Sparkles className="pulse-dot" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: 'var(--text-muted)' }}>Scanning open opportunities...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Briefcase size={32} color="var(--accent-primary)" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px' }}>No Analyzed Resumes Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px', maxWidth: '400px', margin: '0 auto 20px' }}>
              Please upload and analyze a PDF resume first so our AI engine can extract your technical skills and match relevant jobs.
            </p>
            <Link to="/resume" className="btn-primary">
              Upload Resume <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Bar with Parsed Skills */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '8px' }}>Matching Profile Skills</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {resumes[0].skills?.slice(0, 10).map((skill, i) => (
                      <span key={i} className="badge badge-cyan" style={{ fontSize: '12px' }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handleJobMatch} 
                  className="btn-primary" 
                  disabled={matching}
                  style={{ padding: '12px 24px' }}
                >
                  {matching ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles className="pulse-dot" /> Matching Openings...
                    </span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Briefcase size={16} /> {recommendations.length > 0 ? 'Refresh AI Matches' : 'Find Matching Roles'}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Recommendations List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {recommendations.length > 0 ? (
                recommendations.map((rec, i) => (
                  <div key={i} className="glass-card-hover" style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--accent-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px' }}>
                          {rec.company ? rec.company.charAt(0).toUpperCase() : 'C'}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{rec.job_title}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Building2 size={14} /> {rec.company}
                            </span>
                            <span>•</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <MapPin size={14} /> {rec.location}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span className={`badge ${rec.match_score >= 80 ? 'badge-emerald' : 'badge-purple'}`} style={{ fontSize: '14px', padding: '6px 14px' }}>
                          {rec.match_score}% Skill Match
                        </span>
                        <button 
                          className="btn-primary" 
                          onClick={() => alert(`Redirecting to application portal for ${rec.job_title} at ${rec.company}...`)}
                          style={{ fontSize: '13px', padding: '10px 18px' }}
                        >
                          Apply Now <ExternalLink size={14} />
                        </button>
                      </div>

                    </div>

                    {rec.description && (
                      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-color)', paddingTop: '14px' }}>
                        {rec.description}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <div className="glass-panel" style={{ padding: '48px', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>
                    Click "Find Matching Roles" to let AI curate open job positions tailored for your resume.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default JobMatching;
