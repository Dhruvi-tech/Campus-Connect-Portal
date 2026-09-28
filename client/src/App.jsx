// Campus Connect Portal - App.jsx
// Integrates Component-Based Architecture (Student, Faculty, Admin Portals) with React Routing & Express Backend

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RoleCard from './components/RoleCard.jsx';
import PortalView from './components/PortalView.jsx';
import AuthModule from './components/AuthModule.jsx';
import './portal.css';

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Top-level application state: currently selected portal view
  const [activeRole, setActiveRole] = useState('student');
  const [authMode, setAuthMode] = useState('register');

  // Synchronize URL route with active portal role or auth mode
  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path.startsWith('/student')) {
      setActiveRole('student');
    } else if (path.startsWith('/faculty')) {
      setActiveRole('faculty');
    } else if (path.startsWith('/admin')) {
      setActiveRole('admin');
    } else if (path === '/login' || hash === '#login') {
      setAuthMode('login');
      scrollToAuth();
    } else if (path === '/register' || hash === '#register') {
      setAuthMode('register');
      scrollToAuth();
    }

    const handleHash = () => {
      if (window.location.hash === '#login') {
        setAuthMode('login');
        scrollToAuth();
      } else if (window.location.hash === '#register') {
        setAuthMode('register');
        scrollToAuth();
      } else if (window.location.hash === '#roles') {
        const rolesElem = document.getElementById('roles');
        if (rolesElem) rolesElem.scrollIntoView({ behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, [location.pathname]);

  const scrollToAuth = () => {
    setTimeout(() => {
      const regElem = document.getElementById('register');
      if (regElem) {
        regElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Event handler for role selection with smooth scroll into view and URL update
  const handleSelectRole = (role) => {
    setActiveRole(role);
    navigate(`/${role}`);

    setTimeout(() => {
      const portalElem = document.getElementById('active-portal-view');
      if (portalElem) {
        portalElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  };

  const handleClosePortal = () => {
    setActiveRole(null);
    navigate('/');
  };

  return (
    <div className="campus-app-root">
      {/* 1. Interactive Role Selection Section */}
      <section id="roles" className="section-container bg-light" style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="section-title">Choose Your Portal View</h2>
        <p className="section-subtitle" style={{ marginBottom: '25px' }}>
          Select a role below to explore customized dashboards, modular views, and interactive state features
        </p>

        <div className="roles-grid">
          {/* Reusable Child Component 1: Student Role Card */}
          <RoleCard
            title="Student Portal"
            icon="👨‍🎓"
            features={[
              'View Notices & Events',
              'Submit Assignments',
              'Track Attendance',
              'Update Profile'
            ]}
            borderClass="student-border"
            bgBtnClass="student-bg"
            btnText="Access Student View"
            isActive={activeRole === 'student'}
            onSelect={() => handleSelectRole('student')}
          />

          {/* Reusable Child Component 2: Faculty Role Card */}
          <RoleCard
            title="Faculty Portal"
            icon="👨‍🏫"
            features={[
              'Post Notices & Events',
              'Create Assignments',
              'Mark Attendance',
              'View Submissions'
            ]}
            borderClass="faculty-border"
            bgBtnClass="faculty-bg"
            btnText="Access Faculty View"
            isActive={activeRole === 'faculty'}
            onSelect={() => handleSelectRole('faculty')}
          />

          {/* Reusable Child Component 3: Admin Role Card */}
          <RoleCard
            title="Admin Portal"
            icon="🛡️"
            features={[
              'Manage Users',
              'Manage Notices & Events',
              'View System Reports',
              'System Settings'
            ]}
            borderClass="admin-border"
            bgBtnClass="admin-bg"
            btnText="Access Admin View"
            isActive={activeRole === 'admin'}
            onSelect={() => handleSelectRole('admin')}
          />
        </div>

        {/* 2. Dynamic Portal Container (Student, Faculty, or Admin) */}
        {activeRole && (
          <PortalView
            role={activeRole}
            onBack={handleClosePortal}
          />
        )}
      </section>

      {/* 3. Student Registration & Authentication Module */}
      <section id="register" className="registration-section" style={{ width: '100%', marginTop: '30px' }}>
        <AuthModule initialMode={authMode} />
      </section>
    </div>
  );
}

export default App;