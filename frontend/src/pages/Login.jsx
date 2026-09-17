import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, FileText, CheckCircle2, Video, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background ambient light */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />

      {/* Left Feature Showcase Banner (hidden on small screens) */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.2) 100%)',
        borderRight: '1px solid var(--border-color)',
        padding: '60px',
        display: window.innerWidth > 900 ? 'flex' : 'none',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 2
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={24} color="white" />
          </div>
          <span className="gradient-text" style={{ fontSize: '24px', fontWeight: '800' }}>CareerGPT</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '480px' }}>
          <span className="badge badge-purple" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={14} /> AI-Powered Career Ecosystem
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', lineHeight: 1.2 }}>
            Accelerate your career with AI resume audits & mock interviews.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
            Get instant ATS score evaluations, skill gap analysis, interactive code studio challenges, and personalized 4-week growth roadmaps.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" /> PDF Resume & ATS Compatibility Checker
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" /> AI Interview Studio with Live Audio Waveforms
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" /> Tailored 4-Week Career Sprint Roadmaps
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} CareerGPT AI Platform. All rights reserved.
        </div>
      </div>

      {/* Right Login Form Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
        position: 'relative',
        zIndex: 2
      }}>
        <div className="glass-panel animate-scale-up" style={{ padding: '40px', width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)' }}>
              <Sparkles size={24} color="white" />
            </div>
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px' }}>Sign in to CareerGPT</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Welcome back! Enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className="badge badge-rose" style={{ width: '100%', justifyContent: 'center', padding: '10px', marginBottom: '20px', borderRadius: '12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Password</label>
              <input 
                type="password" 
                className="input-field" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '6px' }}>
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Don't have an account? <Link to="/signup" style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>Create an account</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;
