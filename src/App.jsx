import React, { useState } from 'react';
import GradeTable from './components/GradeTable';
import SemesterTable from './components/SemesterTable';
import Attendance from './components/Attendance';
import GradeCalculator from './components/GradeCalculator';
import { semesterData, getAllSemesters, gradePoints } from './data/semesterData';
import './App.css';

function App() {
  const [showMainPage, setShowMainPage] = useState(true);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showGradeCalculator, setShowGradeCalculator] = useState(false);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [semesterGrades, setSemesterGrades] = useState({});

  const handleProceed = () => {
    setShowMainPage(false);
  };

  const handleBack = () => {
    setShowMainPage(true);
    setShowAttendance(false);
    setShowGradeCalculator(false);
  };

  const handleSemesterUpdate = (semesterNumber, data) => {
    setSemesterGrades(prev => ({
      ...prev,
      [semesterNumber]: data
    }));
  };

  const handleAttendanceClick = (semesterNumber) => {
    setCurrentSemester(semesterNumber);
    setShowAttendance(true);
    setShowMainPage(false);
  };

  const handleBackFromAttendance = () => {
    setShowAttendance(false);
    setShowMainPage(false);
  };

  const handleGradeCalculatorClick = (semesterNumber) => {
    setCurrentSemester(semesterNumber);
    setShowGradeCalculator(true);
    setShowMainPage(false);
  };

  const handleBackFromGradeCalculator = () => {
    setShowGradeCalculator(false);
    setShowMainPage(false);
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    getAllSemesters().forEach(semNum => {
      const semData = semesterGrades[semNum] || [];
      semData.forEach(subject => {
        totalCredits += subject.credit;
        totalGradePoints += subject.credit * (gradePoints[subject.grade] || 0);
      });
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  };

  if (showAttendance && currentSemester) {
    return (
      <div className="app-container">
        <Attendance
          semesterNumber={currentSemester}
          onBack={handleBackFromAttendance}
        />
        <footer className="footer">
          <p>Developed by <a href="https://github.com/Skywalker690" target="_blank" rel="noopener noreferrer">Skywalker ❤️</a></p>
          <p>© 2025 CGPA Calculator. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  if (showGradeCalculator && currentSemester) {
    return (
      <div className="app-container">
        <GradeCalculator
          semesterNumber={currentSemester}
          onBack={handleBackFromGradeCalculator}
        />
        <footer className="footer">
          <p>Developed by <a href="https://github.com/Skywalker690" target="_blank" rel="noopener noreferrer">Skywalker ❤️</a></p>
          <p>© 2025 CGPA Calculator. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  if (showMainPage) {
    return (
      <div className="app-container">
        <div className="main-box">
          <h1 className="cgpa-head">CGPA Calculator</h1>
          <GradeTable />
          <div className="center-box">
            <button className="btn" onClick={handleProceed}>Proceed →</button>
          </div>
        </div>
        <footer className="footer">
          <p>Developed by <a href="https://github.com/Skywalker690" target="_blank" rel="noopener noreferrer">Skywalker ❤️</a></p>
          <p>© 2025 CGPA Calculator. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="container">
        <div className="button-section">
          <button className="btn" onClick={handleBack}>Back</button>
        </div>

        {getAllSemesters().map(semNum => (
          <SemesterTable
            key={semNum}
            semesterNumber={semNum}
            semesterName={semesterData[semNum].name}
            subjects={semesterData[semNum].subjects}
            onUpdate={handleSemesterUpdate}
            onAttendance={handleAttendanceClick}
            onGradeCalculator={handleGradeCalculatorClick}
          />
        ))}

        <div className="cgpa-section">
          <p className="cgpa-text">Total CGPA: {calculateCGPA()}</p>
        </div>
      </div>

      <footer className="footer">
        <p>Developed by <a href="https://github.com/Skywalker690" target="_blank" rel="noopener noreferrer">Skywalker ❤️</a></p>
        <p>© 2025 CGPA Calculator. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
