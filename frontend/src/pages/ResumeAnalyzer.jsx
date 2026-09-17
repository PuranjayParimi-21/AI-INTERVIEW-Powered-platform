import React, { useState, useEffect, useContext } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { AuthContext } from '../context/AuthContext';
import API from '../api';
import { 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  Mail, 
  Phone, 
  Linkedin, 
  Github, 
  FileText, 
  Printer, 
  ArrowLeft, 
  Briefcase, 
  GraduationCap, 
  Check, 
  Menu, 
  X,
  Award,
  Sparkles
} from 'lucide-react';

const ResumeAnalyzer = () => {
  const { user } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [completedSuggestions, setCompletedSuggestions] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/api/resume/history');
      setHistory(res.data);
    } catch (error) {
      console.error("Failed to fetch resume history", error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await API.post('/api/resume/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(res.data);
      setCompletedSuggestions({});
      setActiveTab('overview');
      fetchHistory();
    } catch (error) {
      console.error("Analysis failed", error);
    }
    setLoading(false);
  };

  const handleSelectHistoryItem = (item) => {
    setResult(item);
    setCompletedSuggestions({});
    setActiveTab('overview');
    setSidebarOpen(false);
  };

  const toggleSuggestion = (index) => {
    setCompletedSuggestions(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleBackToUpload = () => {
    setResult(null);
    setFile(null);
  };

  const contactInfo = result?.contact_info || { email: '', phone: '', linkedin: '', github: '' };
  const experience = result?.experience || [];
  const education = result?.education || [];
  const certifications = result?.certifications || [];
  const projects = result?.projects || [];
  const skills = result?.skills || [];
  const suggestions = result?.suggestions || [];
  const atsFriendly = result?.ats_friendly !== undefined ? result.ats_friendly : (result?.score >= 70);

  const completedCount = Object.values(completedSuggestions).filter(Boolean).length;

  return (
    <MainLayout>
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report, #printable-report * {
            visibility: visible;
          }
          #printable-report {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="page-wrapper animate-fade-in">
        
        {/* Mobile History Sidebar Toggle */}
        <button 
          className="no-print"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: 'none',
            position: 'absolute',
            top: '-45px',
            right: '0',
            zIndex: 100,
            background: 'var(--accent-gradient)',
            color: 'white',
            padding: '8px',
            borderRadius: '50%',
            boxShadow: 'var(--glass-shadow)'
          }}
          id="mobile-sidebar-toggle"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div style={{ display: 'flex', gap: '24px', minHeight: 'calc(100vh - 140px)', position: 'relative' }}>
          
          {/* 1. History Sidebar Panel */}
          <div 
            id="history-sidebar"
            className={`glass-panel no-print ${sidebarOpen ? 'open' : ''}`}
            style={{
              width: '280px',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              padding: '24px',
              background: 'var(--bg-secondary)',
              borderRight: '1px solid var(--border-color)',
              borderRadius: '20px'
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--accent-primary)" /> Resume Vault ({history.length})
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, overflowY: 'auto' }}>
              {history.map((item) => (
                <div 
                  key={item._id}
                  onClick={() => handleSelectHistoryItem(item)}
                  style={{
                    padding: '14px',
                    borderRadius: '14px',
                    background: result?._id === item._id ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-tertiary)',
                    border: `1px solid ${result?._id === item._id ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                    </span>
                    <span className={`badge ${item.score >= 80 ? 'badge-emerald' : item.score >= 60 ? 'badge-amber' : 'badge-rose'}`} style={{ fontSize: '10px' }}>
                      {item.score}%
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.skills?.[0] ? `${item.skills[0]} Resume` : 'Uploaded Resume'}
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px', fontSize: '13px' }}>
                  No saved analyses found. Upload your first PDF resume!
                </div>
              )}
            </div>
          </div>

          {/* 2. Main Workspace */}
          <div 
            id="main-workspace"
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '24px'
            }}
          >
            {/* UPLOAD FORM */}
            {!result && (
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '24px' }}>
                <div className="page-header">
                  <span className="badge badge-purple" style={{ alignSelf: 'flex-start' }}>
                    <Sparkles size={14} /> AI Resume Parser & Scorer
                  </span>
                  <h1 className="page-title">Resume Analyzer</h1>
                  <p className="page-subtitle">Upload your PDF resume to receive a comprehensive ATS readability score and AI improvement roadmap.</p>
                </div>

                <div className="glass-panel" style={{ padding: '48px 32px', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', width: '100%', maxWidth: '520px' }}>
                    <div 
                      className="glass-card-hover"
                      style={{ 
                        width: '100%', 
                        border: '2px dashed var(--accent-primary)', 
                        padding: '50px 32px', 
                        borderRadius: '20px', 
                        textAlign: 'center', 
                        cursor: 'pointer', 
                        background: 'rgba(99, 102, 241, 0.03)'
                      }}
                      onClick={() => document.getElementById('file-upload').click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (e.dataTransfer.files[0]) {
                          setFile(e.dataTransfer.files[0]);
                        }
                      }}
                    >
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                        <UploadCloud size={32} color="var(--accent-primary)" />
                      </div>
                      <p style={{ fontWeight: '700', fontSize: '16px', marginBottom: '6px' }}>
                        {file ? file.name : 'Drag & drop or browse your PDF resume'}
                      </p>
                      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>PDF documents up to 10MB</p>
                      <input 
                        id="file-upload" 
                        type="file" 
                        accept=".pdf" 
                        onChange={(e) => setFile(e.target.files[0])} 
                        style={{ display: 'none' }} 
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="btn-primary" 
                      disabled={!file || loading}
                      style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                    >
                      {loading ? (
                        <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Sparkles className="pulse-dot" /> Analyzing with Gemini AI...
                        </span>
                      ) : 'Analyze Resume Now'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* REPORT VIEW */}
            {result && (
              <div id="printable-report" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Header Action Bar */}
                <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    onClick={handleBackToUpload}
                    className="btn-secondary"
                    style={{ fontSize: '13px', padding: '8px 16px' }}
                  >
                    <ArrowLeft size={16} /> Analyze Another File
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="btn-primary"
                    style={{ fontSize: '13px', padding: '8px 18px' }}
                  >
                    <Printer size={16} /> Export PDF Report
                  </button>
                </div>

                {/* Main Score Meter Card */}
                <div className="glass-panel" style={{ padding: '32px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '32px' }}>
                  
                  <div style={{ position: 'relative', width: '120px', height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-tertiary)" strokeWidth="10" />
                      <circle 
                        cx="60" cy="60" r="50" fill="none" 
                        stroke={result.score >= 80 ? 'var(--accent-emerald)' : result.score >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)'} 
                        strokeWidth="10" 
                        strokeDasharray="314"
                        strokeDashoffset={314 - (314 * result.score) / 100}
                        strokeLinecap="round"
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dashoffset 1s ease' }}
                      />
                    </svg>
                    <div style={{ position: 'absolute', textAlign: 'center' }}>
                      <span style={{ fontSize: '30px', fontWeight: '800', lineHeight: 1 }}>{result.score}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>/ 100</span>
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h2 style={{ fontSize: '26px', fontWeight: '800' }}>Resume Health Score</h2>
                      <span className={atsFriendly ? 'badge badge-emerald' : 'badge badge-amber'}>
                        {atsFriendly ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                        {atsFriendly ? 'ATS Compliant' : 'ATS Tweaks Recommended'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.5 }}>
                      Extracted {skills.length} technical skills, {experience.length} work items, and {suggestions.length} actionable suggestions.
                    </p>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="no-print" style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'experience', label: 'Experience & Education' },
                    { id: 'skills', label: 'Skills & Projects' },
                    { id: 'suggestions', label: `Checklist (${completedCount}/${suggestions.length})` }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB CONTENTS */}
                <div>
                  
                  {/* 1. OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Contact Details Health</h3>
                        <div className="card-grid">
                          {[
                            { label: 'Email Address', val: contactInfo.email, icon: Mail },
                            { label: 'Phone Number', val: contactInfo.phone, icon: Phone },
                            { label: 'LinkedIn Profile', val: contactInfo.linkedin, icon: Linkedin },
                            { label: 'GitHub Profile', val: contactInfo.github, icon: Github }
                          ].map((item, idx) => {
                            const IconComp = item.icon;
                            return (
                              <div key={idx} style={{ 
                                padding: '16px', 
                                borderRadius: '14px', 
                                background: 'var(--bg-secondary)',
                                border: `1px solid ${item.val ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                              }}>
                                <div style={{ 
                                  color: item.val ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                                  background: item.val ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
                                  padding: '10px',
                                  borderRadius: '12px'
                                }}>
                                  <IconComp size={18} />
                                </div>
                                <div>
                                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>{item.label}</div>
                                  <div style={{ fontSize: '13px', fontWeight: '600', color: item.val ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                                    {item.val || 'Not Detected'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Executive Summary</h3>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {result.score >= 80 
                            ? "Outstanding structure! Your resume displays strong formatting, clear quantitative metrics, and appropriate tech stack keywords."
                            : result.score >= 60
                            ? "Solid baseline. Your resume covers core skills but could benefit from stronger metric-driven accomplishments and keyword optimization."
                            : "Needs improvement. Review the checklist tab to add missing sections, formatted dates, and explicit skills."
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 2. EXPERIENCE & EDUCATION */}
                  {activeTab === 'experience' && (
                    <div className="animate-fade-in card-grid-wide">
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Briefcase size={18} color="var(--accent-primary)" /> Work Experience
                        </h3>
                        {experience.length > 0 ? (
                          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {experience.map((exp, idx) => (
                              <li key={idx} style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{exp}</li>
                            ))}
                          </ul>
                        ) : (
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No work experience detected.</p>
                        )}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="glass-panel" style={{ padding: '24px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <GraduationCap size={18} color="var(--accent-primary)" /> Education
                          </h3>
                          {education.length > 0 ? (
                            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {education.map((edu, idx) => (
                                <li key={idx} style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{edu}</li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No education history detected.</p>
                          )}
                        </div>

                        <div className="glass-panel" style={{ padding: '24px' }}>
                          <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Award size={18} color="var(--accent-primary)" /> Certifications
                          </h3>
                          {certifications.length > 0 ? (
                            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {certifications.map((cert, idx) => (
                                <li key={idx} style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{cert}</li>
                              ))}
                            </ul>
                          ) : (
                            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No certifications detected.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. SKILLS & PROJECTS */}
                  {activeTab === 'skills' && (
                    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>
                          Parsed Tech & Soft Skills ({skills.length})
                        </h3>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                          {skills.map((skill, i) => (
                            <span key={i} className="badge badge-purple" style={{ fontSize: '13px', padding: '6px 14px' }}>
                              {skill}
                            </span>
                          ))}
                          {skills.length === 0 && <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No skills extracted.</p>}
                        </div>
                      </div>

                      <div className="glass-panel" style={{ padding: '24px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>Projects</h3>
                        {projects.length > 0 ? (
                          <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {projects.map((proj, idx) => (
                              <li key={idx} style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{proj}</li>
                            ))}
                          </ul>
                        ) : (
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No projects extracted.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 4. SUGGESTIONS CHECKLIST */}
                  {activeTab === 'suggestions' && (
                    <div className="animate-fade-in glass-panel" style={{ padding: '24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Improvement Action Items</h3>
                          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Check off completed items to track your optimization progress.</p>
                        </div>
                        <span className="badge badge-emerald">
                          {completedCount} / {suggestions.length} Solved
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {suggestions.map((sug, i) => (
                          <div 
                            key={i} 
                            onClick={() => toggleSuggestion(i)}
                            style={{ 
                              padding: '16px', 
                              background: completedSuggestions[i] ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-secondary)', 
                              border: `1px solid ${completedSuggestions[i] ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-color)'}`,
                              borderRadius: '14px', 
                              fontSize: '14px', 
                              color: completedSuggestions[i] ? 'var(--text-muted)' : 'var(--text-primary)',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                              textDecoration: completedSuggestions[i] ? 'line-through' : 'none'
                            }}
                          >
                            <input 
                              type="checkbox" 
                              className="custom-checkbox" 
                              checked={!!completedSuggestions[i]} 
                              onChange={() => {}} 
                            />
                            <span style={{ flex: 1, lineHeight: '1.4' }}>{sug}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            )}
          </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default ResumeAnalyzer;
