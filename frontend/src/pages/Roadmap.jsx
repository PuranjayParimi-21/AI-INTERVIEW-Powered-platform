import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import API from '../api';
import { Map, Sparkles, CheckCircle2, Calendar, BookOpen, ArrowRight } from 'lucide-react';

const Roadmap = () => {
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('company', company);
    formData.append('role', role);

    try {
      const res = await API.post('/api/roadmap/generate', formData);
      setResult(res.data);
    } catch (error) {
      console.error("Roadmap generation failed", error);
    }
    setLoading(false);
  };

  return (
    <MainLayout>
      <div className="page-wrapper animate-fade-in">
        
        <div className="page-header">
          <span className="badge badge-cyan" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={14} /> AI Guided Learning Path
          </span>
          <h1 className="page-title">Career Roadmap Generator</h1>
          <p className="page-subtitle">Generate a customized 4-week study & preparation schedule aligned with target company expectations.</p>
        </div>
        
        {/* Form Panel */}
        <div className="glass-panel" style={{ padding: '32px' }}>
          <form onSubmit={handleGenerate} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Target Company *</label>
              <input 
                type="text" 
                className="input-field" 
                value={company} 
                onChange={(e) => setCompany(e.target.value)} 
                required 
                placeholder="e.g. Google, Microsoft, Amazon" 
              />
            </div>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Target Role *</label>
              <input 
                type="text" 
                className="input-field" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                required 
                placeholder="e.g. Frontend Engineer, DevOps" 
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '14px 28px' }}>
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles className="pulse-dot" /> Generating Path...
                </span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Map size={18} /> Build 4-Week Roadmap
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Roadmap Nodes Display */}
        {result && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800' }}>{role} Roadmap @ {company}</h2>
              <span className="badge badge-emerald">
                <CheckCircle2 size={14} /> 4-Week Sprint Plan
              </span>
            </div>

            {/* Timeline Tree Nodes */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '24px', paddingLeft: '24px' }}>
              
              {/* Vertical connecting line */}
              <div style={{
                position: 'absolute',
                top: '20px',
                bottom: '20px',
                left: '48px',
                width: '3px',
                background: 'var(--accent-gradient)',
                zIndex: 0
              }} />

              {result.weeks?.map((week, i) => (
                <div key={i} className="glass-card-hover" style={{ padding: '28px', display: 'flex', gap: '24px', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
                  
                  {/* Week Badge Node */}
                  <div style={{ 
                    width: '52px', 
                    height: '52px', 
                    borderRadius: '16px', 
                    background: 'var(--accent-gradient)', 
                    color: 'white', 
                    display: 'flex', 
                    flexDirection: 'column',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '10px', textTransform: 'uppercase', opacity: 0.8, fontWeight: '700' }}>WEEK</span>
                    <span style={{ fontSize: '18px', fontWeight: '800', lineHeight: 1 }}>{week.week_number}</span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: '800' }}>{week.focus_area}</h3>
                      <span className="badge badge-purple" style={{ fontSize: '11px' }}>
                        <Calendar size={12} /> Days 1 - 7
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                      {week.topics?.map((topic, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                          <ArrowRight size={14} color="var(--accent-primary)" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Roadmap;
