import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SemestersPage from './pages/SemestersPage';
import AttendancePage from './pages/AttendancePage';
import GradeCalculatorPage from './pages/GradeCalculatorPage';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/semesters" element={<SemestersPage />} />
        <Route path="/attendance/:semesterNumber" element={<AttendancePage />} />
        <Route path="/grade-calculator/:semesterNumber" element={<GradeCalculatorPage />} />
      </Routes>
      
      <footer className="footer">
        <p>Developed by <a href="https://github.com/Skywalker690" target="_blank" rel="noopener noreferrer">Skywalker ❤️</a></p>
        <p>© 2025 CGPA Calculator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
