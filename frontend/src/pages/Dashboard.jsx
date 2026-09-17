import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import API from '../api';
import { 
  FileText, 
  Target, 
  Video, 
  Briefcase, 
  ChevronLeft,
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Code2, 
  Map, 
  Linkedin,
  TrendingUp,
  Award,
  ArrowUpRight,
  Zap,
  Calendar,
  Activity,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';

const KPICard = ({ title, value, subtitle, icon: Icon, color, trend, gaugeVal }) => (
  <div className="dashboard-module-card" style={{ minHeight: '140px' }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
      <div style={{ 
        width: '42px', 
        height: '42px', 
        borderRadius: '12px', 
        background: `rgba(${color}, 0.12)`, 
        color: `rgb(${color})`, 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexShrink: 0
      }}>
        <Icon size={22} />
      </div>

      {gaugeVal !== undefined ? (
        <div style={{ position: 'relative', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="48" height="48" viewBox="0 0 48 48">
            <circle cx="24" cy="24" r="19" fill="none" stroke="var(--bg-tertiary)" strokeWidth="5" />
            <circle 
              cx="24" cy="24" r="19" fill="none" 
              stroke={`rgb(${color})`} 
              strokeWidth="5" 
              strokeDasharray="119"
              strokeDashoffset={119 - (119 * Math.min(gaugeVal, 100)) / 100}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <span style={{ position: 'absolute', fontSize: '10px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {gaugeVal}%
          </span>
        </div>
      ) : trend ? (
        <span className="badge badge-emerald" style={{ fontSize: '11px', padding: '3px 8px', whiteSpace: 'nowrap' }}>
          <TrendingUp size={12} /> {trend}
        </span>
      ) : null}
    </div>

    <div>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {title}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
        <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: 1 }}>
          {value}
        </span>
        {subtitle && <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '500', whiteSpace: 'nowrap' }}>{subtitle}</span>}
      </div>
    </div>
  </div>
);

const ModuleCard = ({ title, description, icon: Icon, path, category, badgeText, gradient }) => (
  <Link to={path} className="dashboard-module-card horizontal-card">
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
      <div style={{ 
        width: '44px', 
        height: '44px', 
        borderRadius: '14px', 
        background: gradient, 
        color: 'white', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        flexShrink: 0
      }}>
        <Icon size={20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <span style={{ fontSize: '10px', fontWeight: '700', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {category}
          </span>
          <span className="badge badge-purple" style={{ fontSize: '9px', padding: '1px 6px' }}>
            {badgeText || 'AI Ready'}
          </span>
        </div>
        <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 2px 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {title}
        </h4>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {description}
        </p>
      </div>
    </div>

    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontWeight: '700', fontSize: '12px', flexShrink: 0, paddingLeft: '8px' }}>
      <span>Launch</span>
      <ArrowUpRight size={15} />
    </div>
  </Link>
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);

  const scrollRow = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/api/dashboard/stats');
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const modules = [
    { title: 'Resume Analyzer', category: 'Resume & ATS', description: 'Deep LLM parsing & score audit for PDF CVs.', icon: FileText, path: '/resume', badgeText: 'Core AI', gradient: 'var(--accent-gradient)' },
    { title: 'ATS Match Checker', category: 'Resume & ATS', description: 'Compare resume keywords against job requirements.', icon: CheckCircle2, path: '/ats', badgeText: 'Popular', gradient: 'var(--accent-gradient-cyan)' },
    { title: 'Skill Gap Detector', category: 'Skills & Growth', description: 'Pinpoint missing skills for target tech roles.', icon: Target, path: '/skills', badgeText: 'Matrix', gradient: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { title: 'Career Roadmap', category: 'Skills & Growth', description: 'Generate a 4-week step-by-step preparation sprint.', icon: Map, path: '/roadmap', badgeText: '4 Weeks', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { title: 'AI Interview Studio', category: 'Practice & Studio', description: 'Real-time mock interviews with speech & content feedback.', icon: Video, path: '/interview', badgeText: 'Voice AI', gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)' },
    { title: 'Coding Practice', category: 'Practice & Studio', description: 'Interactive algorithm challenge studio with time complexity checks.', icon: Code2, path: '/coding', badgeText: 'IDE Studio', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { title: 'Job Matches', category: 'Career & Jobs', description: 'Curated job openings matching your parsed skills.', icon: Briefcase, path: '/jobs', badgeText: 'Live Jobs', gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)' },
    { title: 'LinkedIn Audit', category: 'Career & Jobs', description: 'Audit headline, summary & skills for recruiter searches.', icon: Linkedin, path: '/linkedin', badgeText: 'Optimizer', gradient: 'linear-gradient(135deg, #0284c7, #0369a1)' },
    { title: 'AI Recommendation Hub', category: 'Strategy', description: 'Personalized action items and career optimization tips.', icon: Zap, path: '/resume', badgeText: 'Strategy', gradient: 'linear-gradient(135deg, #6366f1, #a855f7)' },
  ];

  const avgScoreNum = parseInt(data?.stats?.avg_ats_score) || 85;

  return (
    <MainLayout>
      <div className="page-wrapper animate-fade-in">
        
        {/* 1. Evaluator Command Center Hero Header */}
        <div className="glass-panel" style={{ 
          padding: '24px 28px', 
          position: 'relative', 
          overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.14) 0%, rgba(168, 85, 247, 0.22) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '20px'
        }}>
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge badge-emerald" style={{ padding: '4px 12px', fontSize: '11px' }}>
                  <span className="pulse-dot" /> AI Co-Pilot Active
                </span>
                <span className="badge badge-purple" style={{ padding: '4px 12px', fontSize: '11px' }}>
                  <Sparkles size={13} /> Evaluator Suite
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>
                {new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
              <div style={{ flex: 1, minWidth: '280px' }}>
                <h1 className="page-title" style={{ fontSize: '26px', marginBottom: '4px' }}>
                  Welcome back, <span className="gradient-text">{user?.name || 'Candidate'}</span> 👋
                </h1>
                <p className="page-subtitle" style={{ fontSize: '13px', lineHeight: 1.5 }}>
                  Your AI Career Co-Pilot is tracking ATS match metrics, skills alignment, and custom interview readiness.
                </p>
              </div>

              {/* Profile Readiness Meter */}
              <div style={{ 
                background: 'var(--bg-secondary)', 
                padding: '14px 18px', 
                borderRadius: '14px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                minWidth: '200px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                  <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Profile Strength</span>
                  <span style={{ fontWeight: '800', color: 'var(--accent-primary)' }}>88% Ready</span>
                </div>
                <div className="progress-bar-bg" style={{ height: '6px' }}>
                  <div className="progress-bar-fill" style={{ width: '88%', background: 'var(--accent-gradient)' }} />
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Top Candidate Bracket</span>
              </div>
            </div>

            {/* Evaluator Shortcuts */}
            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.15)', paddingTop: '14px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Shortcuts:
              </span>
              <Link to="/resume" className="btn-primary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                <FileText size={14} /> Resume Analyzer
              </Link>
              <Link to="/ats" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                <CheckCircle2 size={14} /> ATS Matcher
              </Link>
              <Link to="/interview" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                <Video size={14} /> AI Studio
              </Link>
              <Link to="/coding" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '12px' }}>
                <Code2 size={14} /> Code Studio
              </Link>
            </div>

          </div>
        </div>

        {/* 2. Left-to-Right Horizontal Rows Layout (------->) */}
        {loading ? (
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Sparkles className="pulse-dot" style={{ margin: '0 auto 12px' }} />
            <p style={{ fontSize: '13px' }}>Loading Career Analytics...</p>
          </div>
        ) : (
          <div className="dashboard-horizontal-main">
            
            {/* Row 1: KPI Stat Cards (Left-to-Right Horizontal Row) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Key Performance Indicators {"(------->)"}
              </span>
              <div className="dashboard-horizontal-scroll-row">
                <div className="kpi-horizontal-item">
                  <KPICard 
                    title="Average ATS Score" 
                    value={data?.stats?.avg_ats_score || '85%'} 
                    subtitle="readiness"
                    icon={FileText} 
                    color="99, 102, 241"
                    trend="+12% this week" 
                    gaugeVal={avgScoreNum}
                  />
                </div>
                <div className="kpi-horizontal-item">
                  <KPICard 
                    title="Skills Matched" 
                    value={data?.stats?.skills_matched || '18/22'} 
                    subtitle="verified"
                    icon={Target} 
                    color="16, 185, 129"
                    trend="High Match"
                    gaugeVal={82}
                  />
                </div>
                <div className="kpi-horizontal-item">
                  <KPICard 
                    title="Mock Interviews" 
                    value={data?.stats?.mock_interviews || '3'} 
                    subtitle="completed"
                    icon={Video} 
                    color="168, 85, 247"
                    gaugeVal={75}
                  />
                </div>
                <div className="kpi-horizontal-item">
                  <KPICard 
                    title="AI Job Matches" 
                    value={data?.stats?.job_matches || '12'} 
                    subtitle="open roles"
                    icon={Briefcase} 
                    color="245, 158, 11"
                    gaugeVal={92}
                  />
                </div>
              </div>
            </div>

            {/* Row 2: AI Platform Modules (Left-to-Right Horizontal Row) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '800' }}>AI Career Platform Modules</h2>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Horizontal row layout flowing from left to right {"(------->)"}.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button 
                    onClick={() => scrollRow('left')}
                    style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Scroll Left"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => scrollRow('right')}
                    style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    title="Scroll Right"
                  >
                    <ChevronRight size={16} />
                  </button>
                  <span className="badge badge-purple" style={{ fontSize: '12px' }}>
                    <Layers size={14} /> 9 Modules
                  </span>
                </div>
              </div>

              <div className="dashboard-horizontal-scroll-row" ref={scrollContainerRef}>
                {modules.map((mod, idx) => (
                  <div key={idx} className="module-horizontal-item">
                    <ModuleCard {...mod} />
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Resume Score History & Priority Action Center */}
            <div className="dashboard-split-grid">
              
              {/* Score History Card */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={18} color="var(--accent-emerald)" /> Resume Score Progression
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Score growth across upload attempts.</p>
                  </div>
                  <span className="badge badge-emerald" style={{ fontSize: '10px' }}>
                    <Award size={12} /> +20% Growth
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.resume_history && data.resume_history.length > 0 ? (
                    data.resume_history.slice().reverse().map((item, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          padding: '12px 14px', 
                          borderRadius: '12px', 
                          background: 'var(--bg-secondary)', 
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', flexShrink: 0 }}>
                            #{data.resume_history.length - idx}
                          </div>
                          <div style={{ overflow: 'hidden' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.skills?.[0] ? `${item.skills[0]} Resume Audit` : 'Resume Upload'}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                              {item.date ? new Date(item.date).toLocaleDateString() : 'Recent Session'}
                            </span>
                          </div>
                        </div>

                        <span className={`badge ${item.score >= 80 ? 'badge-emerald' : item.score >= 60 ? 'badge-amber' : 'badge-rose'}`} style={{ fontSize: '11px', padding: '3px 8px', flexShrink: 0 }}>
                          {item.score}% Score
                        </span>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '12px' }}>
                      Upload a PDF resume to start tracking score history.
                    </div>
                  )}
                </div>
              </div>

              {/* Priority Recommendations Card */}
              <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={18} color="var(--accent-primary)" /> Priority Recommendations
                    </h3>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Action items to boost candidate score.</p>
                  </div>
                  <span className="badge badge-purple" style={{ fontSize: '10px' }}>High Priority</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {data?.next_steps && data.next_steps.length > 0 ? (
                    data.next_steps.map((step, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          padding: '12px 14px', 
                          background: 'var(--bg-secondary)', 
                          borderRadius: '12px', 
                          border: '1px solid var(--border-color)',
                          borderLeft: `4px solid ${
                            step.type === 'error' ? 'var(--accent-rose)' : 
                            step.type === 'warning' ? 'var(--accent-amber)' : 
                            step.type === 'success' ? 'var(--accent-emerald)' : 
                            'var(--accent-primary)'
                          }`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px'
                        }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <span style={{ fontWeight: '700', fontSize: '12px', display: 'block', lineHeight: 1.4 }}>
                            {step.text}
                          </span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            Est. time: ~5 mins
                          </span>
                        </div>
                        <Link 
                          to={step.link} 
                          className="btn-primary" 
                          style={{ padding: '5px 10px', fontSize: '11px', flexShrink: 0 }}
                        >
                          Action <ChevronRight size={13} />
                        </Link>
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-secondary)', borderRadius: '12px', fontSize: '12px' }}>
                      All current action items completed!
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Dashboard;

