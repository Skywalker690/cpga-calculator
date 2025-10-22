import React from 'react';
import { grades, credits, gradePoints } from '../data/semesterData';
import './SemesterTable.css';

const SemesterTable = ({ semesterNumber, semesterName, subjects, onUpdate, onAttendance, onGradeCalculator }) => {
  const [subjectData, setSubjectData] = React.useState(
    subjects.map(subject => ({
      name: subject.name,
      credit: subject.credit,
      grade: subject.defaultGrade
    }))
  );

  const handleCreditChange = (index, value) => {
    const newData = [...subjectData];
    newData[index].credit = parseInt(value);
    setSubjectData(newData);
    onUpdate(semesterNumber, newData);
  };

  const handleGradeChange = (index, value) => {
    const newData = [...subjectData];
    newData[index].grade = value;
    setSubjectData(newData);
    onUpdate(semesterNumber, newData);
  };

  const handleClear = () => {
    const clearedData = subjectData.map(subject => ({
      ...subject,
      grade: 'F'
    }));
    setSubjectData(clearedData);
    onUpdate(semesterNumber, clearedData);
  };

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjectData.forEach(subject => {
      totalCredits += subject.credit;
      totalGradePoints += subject.credit * (gradePoints[subject.grade] || 0);
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  };

  return (
    <div className="semester-section">
      <h2>{semesterName}</h2>
      <table className="semester-table">
        <thead>
          <tr>
            <th>SNo</th>
            <th>Subject</th>
            <th>Credit</th>
            <th>Grade</th>
          </tr>
        </thead>
        <tbody>
          {subjectData.map((subject, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td className="subject-name">{subject.name}</td>
              <td>
                <select
                  value={subject.credit}
                  onChange={(e) => handleCreditChange(index, e.target.value)}
                  className="credit-select"
                >
                  {credits.map(credit => (
                    <option key={credit} value={credit}>{credit}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={subject.grade}
                  onChange={(e) => handleGradeChange(index, e.target.value)}
                  className="grade-select"
                >
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="action-buttons">
        <button className="clear-button" onClick={handleClear}>Clear</button>
        <button className="sgpa-button">SGPA: {calculateSGPA()}</button>
        <button className="attendance-button" onClick={() => onAttendance(semesterNumber)}>
          Attendance 🧮
        </button>
        <button className="grade-calc-button" onClick={() => onGradeCalculator(semesterNumber)}>
          Grade Calculator 📊
        </button>
      </div>
    </div>
  );
};

export default SemesterTable;
