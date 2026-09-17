import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle2, 
  Target, 
  Video, 
  Code2, 
  Map, 
  Briefcase, 
  Linkedin,
  LogOut,
  Moon,
  Sun,
  Sparkles,
  Menu,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const Sidebar = ({ isCollapsed, onToggle, isMobileOpen, onMobileClose }) => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Resume Analyzer', path: '/resume', icon: <FileText size={20} /> },
    { name: 'ATS Checker', path: '/ats', icon: <CheckCircle2 size={20} /> },
    { name: 'Skill Gap', path: '/skills', icon: <Target size={20} /> },
    { name: 'Interview Prep', path: '/interview', icon: <Video size={20} /> },
    { name: 'Coding Practice', path: '/coding', icon: <Code2 size={20} /> },
    { name: 'Career Roadmap', path: '/roadmap', icon: <Map size={20} /> },
    { name: 'Job Matches', path: '/jobs', icon: <Briefcase size={20} /> },
    { name: 'LinkedIn Analysis', path: '/linkedin', icon: <Linkedin size={20} /> },
  ];

  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          onClick={onMobileClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
            display: 'block'
          }}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        style={{
          width: sidebarWidth,
          height: '100vh',
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          padding: isCollapsed ? '24px 10px' : '24px 16px',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          transform: window.innerWidth <= 1024 && !isMobileOpen ? 'translateX(-100%)' : 'translateX(0)',
          overflowX: 'hidden'
        }}
      >
        {/* Header & Brand + 3-Line Menu Toggle Button */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isCollapsed ? 'center' : 'space-between', 
          marginBottom: '28px', 
          padding: isCollapsed ? '0' : '0 6px' 
        }}>
          {!isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '12px', 
                background: 'var(--accent-gradient)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)',
                flexShrink: 0
              }}>
                <Sparkles size={20} color="white" />
              </div>
              <div style={{ whiteSpace: 'nowrap' }}>
                <h1 className="gradient-text" style={{ fontSize: '20px', fontWeight: '800', lineHeight: 1 }}>
                  CareerGPT
                </h1>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.05em' }}>
                  AI CAREER SUITE
                </span>
              </div>
            </div>
          )}

          {/* 3-Line Hamburger Menu Button inside Sidebar */}
          <button 
            onClick={onToggle}
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              padding: '8px',
              borderRadius: '10px',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              flexShrink: 0
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              title={isCollapsed ? item.name : undefined}
              onClick={() => { if (onMobileClose && window.innerWidth <= 1024) onMobileClose(); }}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                gap: '12px',
                padding: isCollapsed ? '12px 0' : '12px 16px',
                borderRadius: '12px',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-gradient)' : 'transparent',
                fontWeight: isActive ? '600' : '500',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 4px 14px rgba(99, 102, 241, 0.35)' : 'none',
                whiteSpace: 'nowrap'
              })}
            >
              <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {item.icon}
              </div>
              {!isCollapsed && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer Area: User Profile & Actions */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          
          {/* User Profile Summary */}
          {user && !isCollapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '12px', background: 'var(--bg-tertiary)', marginBottom: '4px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'var(--accent-gradient-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'white', flexShrink: 0, fontSize: '14px' }}>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name || 'Pro Candidate'}
                </p>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.email || 'user@careergpt.ai'}
                </p>
              </div>
            </div>
          )}

          {/* Theme & Logout Buttons */}
          <div style={{ display: 'flex', flexDirection: isCollapsed ? 'column' : 'row', gap: '8px' }}>
            <button 
              onClick={toggleTheme}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '10px',
                borderRadius: '10px',
                color: 'var(--text-primary)',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                fontSize: '13px',
                fontWeight: '600'
              }}
            >
              {theme === 'dark' ? <Sun size={18} color="#f59e0b" /> : <Moon size={18} color="#6366f1" />}
              {!isCollapsed && <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>}
            </button>

            <button 
              onClick={logout}
              title="Logout"
              style={{
                padding: '10px 14px',
                borderRadius: '10px',
                color: 'var(--accent-rose)',
                background: 'rgba(244, 63, 94, 0.1)',
                border: '1px solid rgba(244, 63, 94, 0.2)',
                fontSize: '13px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <LogOut size={18} />
              {!isCollapsed && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
