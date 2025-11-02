import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SemesterTable from '../components/SemesterTable';
import { semesterData, getAllSemesters, gradePoints } from '../data/semesterData';

const SemestersPage = () => {
  const navigate = useNavigate();
  const [semesterGrades, setSemesterGrades] = useState({});

  const handleBack = () => {
    navigate('/');
  };

  const handleSemesterUpdate = (semesterNumber, data) => {
    setSemesterGrades(prev => ({
      ...prev,
      [semesterNumber]: data
    }));
  };

  const handleAttendanceClick = (semesterNumber) => {
    navigate(`/attendance/${semesterNumber}`);
  };

  const handleGradeCalculatorClick = (semesterNumber) => {
    navigate(`/grade-calculator/${semesterNumber}`);
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

  // Get the latest semester number
  const allSemesters = getAllSemesters();
  const latestSemester = allSemesters.length > 0 ? Math.max(...allSemesters) : 0;

  return (
    <div className="container">
      <button className="btn" onClick={handleBack}>Back</button>
      {getAllSemesters().map(semNum => (
        <SemesterTable
          key={semNum}
          semesterNumber={semNum}
          semesterName={semesterData[semNum].name}
          subjects={semesterData[semNum].subjects}
          onUpdate={handleSemesterUpdate}
          onAttendance={handleAttendanceClick}
          onGradeCalculator={handleGradeCalculatorClick}
          isLatestSemester={semNum === latestSemester}
        />
      ))}
      <div className="cgpa-section">
        <p className="cgpa-text">Total CGPA: {calculateCGPA()}</p>
      </div>
    </div>
  );
};

export default SemestersPage;
