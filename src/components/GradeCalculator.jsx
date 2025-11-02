import React, { useState, useEffect } from 'react';  // Added useEffect
import { getSubjects } from '../data/semesterData';
import { parseCSV } from '../utils/csvParser';
import './GradeCalculator.css';

const GradeCalculator = ({ semesterNumber, onBack }) => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allSubjects = getSubjects(semesterNumber);
  // Filter out subjects with 0 credits
  const subjects = allSubjects.filter(subject => subject.credit > 0);
  const [calculatorData, setCalculatorData] = useState(
    subjects.map(subject => ({
      name: subject.name,
      cieMarks: 0,
      targetGrade: 'S'
    }))
  );
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  // Auto-import internal marks on component mount
  useEffect(() => {
    handleImportInternalMarks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const calculateSGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    subjects.forEach((subject, index) => {
      const targetGrade = calculatorData[index].targetGrade;
      const gradePoint = gradeThresholds[targetGrade].gradePoint;
      totalCredits += subject.credit;
      totalGradePoints += subject.credit * gradePoint;
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
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
        message: `Warning: Impossible! Requires ${gradeThresholds[targetGrade].percentage - cieMarks} marks in ESE (max 50)`
      };
    }
    
    if (eseNeeded === 0) {
      return {
        type: 'achieved',
        message: `Target already achieved with CIE marks alone!`
      };
    }

    // Check for ESE minimum requirement (40% = 20 marks)
    const total = cieMarks + eseNeeded;
    if (eseNeeded < 20 && total >= 50) {
      return {
        type: 'warning',
        message: `Warning: Note: Need ${eseNeeded} marks in ESE, but minimum 20 (40%) required to pass ESE`
      };
    }
    
    return {
      type: 'normal',
      message: `Need ${eseNeeded} marks in ESE (out of 50)`
    };
  };

  const handleImportInternalMarks = async () => {
    try {
      setImporting(true);
      setImportMessage('Fetching internal marks...');

      const response = await fetch('/attendance.csv');
      if (!response.ok) {
        throw new Error('Failed to load attendance.csv');
      }
      
      const csvText = await response.text();
      const parsedData = parseCSV(csvText);

      if (parsedData && parsedData.length > 0) {
        const newCalculatorData = [...calculatorData];
        
        parsedData.forEach(row => {
          const courseName = row.Course || '';
          const intMark = parseInt(row['Internal Marks']) || 0;  // Now works: quotes stripped

          let extractedSubject = courseName.trim();
          const dashParts = courseName.split(' - ');
          if (dashParts.length >= 2) {
            extractedSubject = dashParts[1].trim();
          }

          const index = newCalculatorData.findIndex(item => {
            const itemNameLower = item.name.toLowerCase().trim();
            const extractedLower = extractedSubject.toLowerCase().trim();
            
            if (itemNameLower === extractedLower) return true;
            
            const itemIsLab = itemNameLower.includes('lab');
            const csvIsLab = extractedLower.includes('lab');
            if (itemIsLab !== csvIsLab) return false;
            
            const commonWords = ['and', 'the', 'for', 'with', 'lab', 'programming'];
            const getKeywords = (text) => {
              return text.toLowerCase()
                .split(/[\s-]+/)
                .filter(word => word.length > 3 && !commonWords.includes(word));
            };
            
            const itemKeywords = getKeywords(item.name);
            const csvKeywords = getKeywords(extractedSubject);
            
            if (itemIsLab && csvIsLab) {
              return itemKeywords.some(keyword =>
                csvKeywords.some(csvKeyword =>
                  keyword.includes(csvKeyword) || csvKeyword.includes(keyword)
                )
              );
            }
            
            const matchCount = itemKeywords.filter(keyword =>
              csvKeywords.some(csvKeyword =>
                csvKeyword.includes(keyword) || keyword.includes(csvKeyword)
              )
            ).length;
            
            return matchCount >= Math.min(2, itemKeywords.length);
          });

          if (index !== -1 && intMark > 0) {
            newCalculatorData[index].cieMarks = Math.min(intMark, 50);
          }
        });

        setCalculatorData(newCalculatorData);
        setImportMessage('Internal marks imported successfully!');
        setTimeout(() => setImportMessage(''), 3000);
      } else {
        setImportMessage('Error: Could not parse attendance data');
        setTimeout(() => setImportMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error importing internal marks:', error);
      setImportMessage('Error: Could not load attendance.csv file');
      setTimeout(() => setImportMessage(''), 5000);
    } finally {
      setImporting(false);
    }
  };



  return (
    <div className="grade-calculator-container">
      <h1 className="grade-calculator-header">Grade Calculator</h1>
      
      {importMessage && (
        <div className="import-section">
          <div className="import-message">{importMessage}</div>
        </div>
      )}
      
      <div className="table-wrapper">
        <table className="grade-calculator-table">
          <thead>
            <tr>
              <th>SNo</th>
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
                  <td data-label="SNo">{index + 1}</td>
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
                    Greater than or equal to {gradeInfo.percentage}%
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

      <div className="sgpa-display">
        <h3>Expected SGPA</h3>
        <p>{calculateSGPA()}</p>
      </div>

      <button className="back-to-cgpa" onClick={onBack}>
        ← Back
      </button>
    </div>
  );
};

export default GradeCalculator;