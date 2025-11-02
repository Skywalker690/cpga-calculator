import React from 'react';
import './GradeTable.css';          // keep your existing CSS (or rename if you want)

const GradeTable = () => {
  const gradeThresholds = {
    'S':  { percentage: 90, gradePoint: 10.0 },
    'A+': { percentage: 85, gradePoint: 9.0 },
    'A':  { percentage: 80, gradePoint: 8.5 },
    'B+': { percentage: 75, gradePoint: 8.0 },
    'B':  { percentage: 70, gradePoint: 7.5 },
    'C+': { percentage: 65, gradePoint: 7.0 },
    'C':  { percentage: 60, gradePoint: 6.5 },
    'D':  { percentage: 55, gradePoint: 6.0 },
    'P':  { percentage: 50, gradePoint: 5.5 }
  };

  const grades = ['S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'P'];

  return (
    <div className="grade-table-container">
      <h3 className="grading-info-header">Grading System</h3>

      <table className="grade-table grading-table">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Grade Point</th>
            <th>Percentage Range</th>
          </tr>
        </thead>
        <tbody>
          {grades.map(grade => {
            const info = gradeThresholds[grade];
            const prevIdx = grades.indexOf(grade) - 1;
            const prevInfo = prevIdx >= 0 ? gradeThresholds[grades[prevIdx]] : null;

            let range = '';
            if (grade === 'S') {
              range = 'Greater than or equal to 90%';
            } else if (grade === 'P') {
              range = 'Greater than or equal to 50% and < 55%';
            } else {
              range = `Greater than or equal to ${info.percentage}%`;
              if (prevInfo) {
                range += ` and < ${prevInfo.percentage}%`;
              }
            }

            return (
              <tr key={grade}>
                <td>{grade}</td>
                <td>{info.gradePoint}</td>
                <td>{range}</td>
              </tr>
            );
          })}

          {/* Fail row */}
          <tr>
            <td>F</td>
            <td>0.0</td>
            <td>&lt; 50% OR ESE &lt; 40% (i.e., &lt; 20 out of 50)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GradeTable;