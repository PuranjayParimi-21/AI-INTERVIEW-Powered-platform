import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ATSChecker from './pages/ATSChecker';
import SkillGap from './pages/SkillGap';
import InterviewSimulator from './pages/InterviewSimulator';
import CodingPractice from './pages/CodingPractice';
import Roadmap from './pages/Roadmap';
import JobMatching from './pages/JobMatching';
import LinkedinAnalysis from './pages/LinkedinAnalysis';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/resume" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
        <Route path="/ats" element={<ProtectedRoute><ATSChecker /></ProtectedRoute>} />
        <Route path="/skills" element={<ProtectedRoute><SkillGap /></ProtectedRoute>} />
        <Route path="/interview" element={<ProtectedRoute><InterviewSimulator /></ProtectedRoute>} />
        <Route path="/coding" element={<ProtectedRoute><CodingPractice /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><JobMatching /></ProtectedRoute>} />
        <Route path="/linkedin" element={<ProtectedRoute><LinkedinAnalysis /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
