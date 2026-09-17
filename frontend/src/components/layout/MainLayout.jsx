import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const MainLayout = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
    if (window.innerWidth <= 1024) {
      setMobileSidebarOpen((prev) => !prev);
    }
  };

  const desktopMargin = isCollapsed ? '80px' : '280px';
  const isDesktop = window.innerWidth > 1024;

  return (
    <div className="app-container">
      {/* Ambient background glow elements */}
      <div className="ambient-glow ambient-glow-1" />
      <div className="ambient-glow ambient-glow-2" />

      {/* Collapsible Sidebar */}
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggle={toggleSidebar}
        isMobileOpen={mobileSidebarOpen} 
        onMobileClose={() => setMobileSidebarOpen(false)} 
      />

      {/* Main Workspace - Width explicitly calculated to prevent right-edge screen overflow */}
      <div style={{ 
        flex: 1, 
        marginLeft: isDesktop ? desktopMargin : '0px', 
        width: isDesktop ? `calc(100% - ${desktopMargin})` : '100%',
        maxWidth: isDesktop ? `calc(100% - ${desktopMargin})` : '100%',
        display: 'flex', 
        flexDirection: 'column', 
        minHeight: '100vh',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxSizing: 'border-box',
        overflowX: 'hidden'
      }}>
        {/* Floating Mobile Toggle Button */}
        {!isDesktop && !mobileSidebarOpen && (
          <button
            onClick={() => setMobileSidebarOpen(true)}
            title="Open Menu"
            style={{
              position: 'fixed',
              top: '16px',
              left: '16px',
              zIndex: 35,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              padding: '10px',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--card-shadow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Menu size={22} />
          </button>
        )}

        {/* Page Main Content Area */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
