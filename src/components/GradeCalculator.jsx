import React, { useState } from 'react';
import { getSubjects } from '../data/semesterData';
import './GradeCalculator.css';

const GradeCalculator = ({ semesterNumber, onBack }) => {
  const subjects = getSubjects(semesterNumber);
  const [calculatorData, setCalculatorData] = useState(
    subjects.map(subject => ({
      name: subject.name,
      cieMarks: 0,
      targetGrade: 'S'
    }))
  );

  const gradeThresholds = {
    'S': { percentage: 90, gradePoint: 10.0 },
    'A+': { percentage: 85, gradePoint: 9.0 },
    'A': { percentage: 80, gradePoint: 8.5 },
    'B+': { percentage: 75, gradePoint: 8.0 },
    'B': { percentage: 70, gradePoint: 7.5 },
    'C+': { percentage: 65, gradePoint: 7.0 },
    'C': { percentage: 60, gradePoint: 6.5 },
    'D': { percentage: 55, gradePoint: 6.0 },
    'P': { percentage: 50, gradePoint: 5.5 }
  };

  const grades = ['S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'P'];

  const updateCIEMarks = (index, value) => {
    const newData = [...calculatorData];
    const marks = parseInt(value) || 0;
    newData[index].cieMarks = Math.min(Math.max(marks, 0), 50);
    setCalculatorData(newData);
  };

  const updateTargetGrade = (index, value) => {
    const newData = [...calculatorData];
    newData[index].targetGrade = value;
    setCalculatorData(newData);
  };

  const calculateESEMarksNeeded = (cieMarks, targetGrade) => {
    const requiredTotal = gradeThresholds[targetGrade].percentage;
    const marksNeeded = requiredTotal - cieMarks;
    return Math.min(Math.max(marksNeeded, 0), 50);
  };

  const isImpossible = (cieMarks, targetGrade) => {
    const requiredTotal = gradeThresholds[targetGrade].percentage;
    const marksNeeded = requiredTotal - cieMarks;
    return marksNeeded > 50;
  };

  const getResultMessage = (cieMarks, targetGrade) => {
    const eseNeeded = calculateESEMarksNeeded(cieMarks, targetGrade);
    const impossible = isImpossible(cieMarks, targetGrade);
    
    if (impossible) {
      return {
        type: 'impossible',
        message: `⚠️ Impossible! Requires ${gradeThresholds[targetGrade].percentage - cieMarks} marks in ESE (max 50)`
      };
    }
    
    if (eseNeeded === 0) {
      return {
        type: 'achieved',
        message: `✅ Target already achieved with CIE marks alone!`
      };
    }

    // Check for ESE minimum requirement (40% = 20 marks)
    const total = cieMarks + eseNeeded;
    if (eseNeeded < 20 && total >= 50) {
      return {
        type: 'warning',
        message: `⚠️ Note: Need ${eseNeeded} marks in ESE, but minimum 20 (40%) required to pass ESE`
      };
    }
    
    return {
      type: 'normal',
      message: `Need ${eseNeeded} marks in ESE (out of 50)`
    };
  };

  return (
    <div className="grade-calculator-container">
      <h1 className="grade-calculator-header">Grade Calculator</h1>
      <p className="grade-calculator-header">Semester {semesterNumber} - Calculate Required ESE Marks</p>
      
      <div className="info-box">
        <p><strong>How to use:</strong></p>
        <ul>
          <li>Enter your CIE (Internal) marks out of 50</li>
          <li>Select your target grade</li>
          <li>See how many marks you need in ESE (Exam) out of 50</li>
          <li><strong>Note:</strong> Total = CIE + ESE (out of 100), ESE minimum: 20/50 (40%)</li>
        </ul>
      </div>

      <div className="table-wrapper">
        <table className="grade-calculator-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>CIE Marks (out of 50)</th>
              <th>Target Grade</th>
              <th>Required %</th>
              <th>Grade Point</th>
              <th>ESE Marks Needed</th>
            </tr>
          </thead>
          <tbody>
            {calculatorData.map((data, index) => {
              const result = getResultMessage(data.cieMarks, data.targetGrade);
              const gradeInfo = gradeThresholds[data.targetGrade];
              
              return (
                <tr key={index}>
                  <td data-label="Subject" className="subject-cell">{data.name}</td>
                  <td data-label="CIE Marks">
                    <input
                      type="number"
                      className="input-field"
                      min="0"
                      max="50"
                      value={data.cieMarks}
                      onChange={(e) => updateCIEMarks(index, e.target.value)}
                    />
                  </td>
                  <td data-label="Target Grade">
                    <select
                      className="grade-select-dropdown"
                      value={data.targetGrade}
                      onChange={(e) => updateTargetGrade(index, e.target.value)}
                    >
                      {grades.map(grade => (
                        <option key={grade} value={grade}>{grade}</option>
                      ))}
                    </select>
                  </td>
                  <td data-label="Required %" className="result-cell">
                    ≥{gradeInfo.percentage}%
                  </td>
                  <td data-label="Grade Point" className="result-cell">
                    {gradeInfo.gradePoint}
                  </td>
                  <td data-label="ESE Marks Needed" className="result-cell">
                    <span className={`result-${result.type}`}>
                      {result.message}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grading-info">
        <h3>Grading System</h3>
        <table className="grading-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Grade Point</th>
              <th>Percentage Range</th>
            </tr>
          </thead>
          <tbody>
            {grades.map(grade => (
              <tr key={grade}>
                <td>{grade}</td>
                <td>{gradeThresholds[grade].gradePoint}</td>
                <td>
                  {grade === 'S' ? '≥ 90%' : 
                   grade === 'P' ? '≥ 50% and < 55%' :
                   `≥ ${gradeThresholds[grade].percentage}%${grades[grades.indexOf(grade) - 1] ? ' and < ' + gradeThresholds[grades[grades.indexOf(grade) - 1]].percentage + '%' : ''}`}
                </td>
              </tr>
            ))}
            <tr>
              <td>F</td>
              <td>0.0</td>
              <td>&lt; 50% OR ESE &lt; 40% (i.e., &lt; 20 out of 50)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="back-to-cgpa" onClick={onBack}>
        ← Back to CGPA Calculator
      </button>
    </div>
  );
};

export default GradeCalculator;
