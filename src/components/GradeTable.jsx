import React from 'react';
import { gradePoints } from '../data/semesterData';
import './GradeTable.css';

const GradeTable = () => {
  return (
    <div className="grade-table-container">
      <table className="grade-table">
        <thead>
          <tr>
            <th>Grade</th>
            <th>Grade Point</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(gradePoints).map(([grade, point]) => (
            grade !== 'F' && (
              <tr key={grade}>
                <td>{grade}</td>
                <td>{point}</td>
              </tr>
            )
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default GradeTable;
