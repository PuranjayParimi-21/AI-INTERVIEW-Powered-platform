import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import API from '../api';
import { Target, Sparkles, AlertTriangle, BookOpen, CheckCircle2, ArrowRight, Plus } from 'lucide-react';

const SkillGap = () => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [addedSkills, setAddedSkills] = useState({});

  const popularRoles = ['Full Stack Engineer', 'Frontend Developer', 'Backend Engineer', 'Data Scientist', 'DevOps Specialist'];

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('role', role);
    formData.append('current_skills', currentSkills);
    if (company) {
      formData.append('company', company);
    }

    try {
      const res = await API.post('/api/analysis/skill-gap', formData);
      setResult(res.data);
      setAddedSkills({});
    } catch (error) {
      console.error("Skill gap analysis failed", error);
    }
    setLoading(false);
  };

  const toggleAddToPlan = (index) => {
    setAddedSkills(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  return (
    <MainLayout>
      <div className="page-wrapper animate-fade-in">
        
        <div className="page-header">
          <span className="badge badge-amber" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={14} /> AI Skill Gap Matrix
          </span>
          <h1 className="page-title">Skill Gap Detector</h1>
          <p className="page-subtitle">Identify technical deficiencies and soft skill gaps required for your target role.</p>
        </div>
        
        {/* Form panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Quick Select Preset Chips */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>
                POPULAR ROLES
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {popularRoles.map((r, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRole(r)}
                    className="badge badge-purple"
                    style={{ cursor: 'pointer', fontSize: '12px', padding: '6px 14px' }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="card-grid-2">
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Target Role *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={role} 
                  onChange={(e) => setRole(e.target.value)} 
                  required 
                  placeholder="e.g. Senior Frontend Engineer" 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Target Company (Optional)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={company} 
                  onChange={(e) => setCompany(e.target.value)} 
                  placeholder="e.g. Google, Amazon, Meta" 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Your Current Skills & Experience *</label>
              <textarea 
                className="input-field" 
                rows="4" 
                value={currentSkills} 
                onChange={(e) => setCurrentSkills(e.target.value)} 
                required 
                placeholder="List technologies, tools, and experience (e.g. React, JavaScript, HTML/CSS, Git)..."
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', padding: '14px 28px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles className="pulse-dot" /> Detecting Skill Gaps...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Target size={18} /> Analyze Skill Gap Matrix
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Results section */}
        {result && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-panel" style={{ padding: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: '800' }}>Skill Gap Report</h2>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Target Role: {role} {company && `@ ${company}`}</p>
                </div>
                <span className="badge badge-amber">Gap Analysis Complete</span>
              </div>

              <div className="card-grid-2">
                
                {/* Missing Skills */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)' }}>
                    <AlertTriangle size={18} /> Critical Skill Gaps
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.missing_skills?.map((skill, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          padding: '14px 18px', 
                          borderRadius: '14px', 
                          background: 'var(--bg-secondary)', 
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <span style={{ fontWeight: '600', fontSize: '14px' }}>{skill}</span>
                        <button
                          onClick={() => toggleAddToPlan(i)}
                          className={addedSkills[i] ? 'badge badge-emerald' : 'btn-outline'}
                          style={{ fontSize: '12px', padding: '6px 12px' }}
                        >
                          {addedSkills[i] ? <CheckCircle2 size={14} /> : <Plus size={14} />}
                          {addedSkills[i] ? 'In Roadmap' : 'Add to Plan'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Resources */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-emerald)' }}>
                    <BookOpen size={18} /> Recommended Learning Paths
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {result.learning_resources?.map((res, i) => (
                      <div 
                        key={i} 
                        style={{ 
                          padding: '14px 18px', 
                          borderRadius: '14px', 
                          background: 'var(--bg-secondary)', 
                          border: '1px solid var(--border-color)',
                          fontSize: '13px',
                          lineHeight: '1.5',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px'
                        }}
                      >
                        <ArrowRight size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{res}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SkillGap;
