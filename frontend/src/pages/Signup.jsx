import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
      
      {/* Background ambient light */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />

      {/* Left Feature Showcase Banner */}
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
          <span className="badge badge-emerald" style={{ alignSelf: 'flex-start' }}>
            <Sparkles size={14} /> Join 10,000+ Job Seekers
          </span>
          <h1 style={{ fontSize: '38px', fontWeight: '800', lineHeight: 1.2 }}>
            Unlock your full professional potential with AI.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>
            Create an account to start analyzing your resumes, generating custom roadmaps, practicing coding challenges, and receiving curated job matches.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" /> Free AI Resume Audit & ATS Health Check
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" /> Practice HR & Tech Mock Interviews Unlimited
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: 'var(--text-primary)' }}>
              <CheckCircle2 size={18} color="var(--accent-emerald)" /> LinkedIn Profile Optimization Recommendations
            </div>
          </div>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} CareerGPT AI Platform. All rights reserved.
        </div>
      </div>

      {/* Right Signup Form Container */}
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
            <h2 style={{ fontSize: '26px', fontWeight: '800', marginBottom: '6px' }}>Create your Account</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Get started in seconds with your free CareerGPT account.</p>
          </div>

          {error && (
            <div className="badge badge-rose" style={{ width: '100%', justifyContent: 'center', padding: '10px', marginBottom: '20px', borderRadius: '12px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Full Name</label>
              <input 
                type="text" 
                className="input-field" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                placeholder="Alex Morgan"
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '700' }}>Email Address</label>
              <input 
                type="email" 
                className="input-field" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                placeholder="alex@example.com"
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
                minLength="6"
                placeholder="At least 6 characters"
              />
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px', marginTop: '6px' }}>
              Create Account <ArrowRight size={16} />
            </button>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '700' }}>Sign in</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Signup;
