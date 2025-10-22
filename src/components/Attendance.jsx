import React, { useState } from 'react';
import { getSubjects } from '../data/semesterData';
import './Attendance.css';

const Attendance = ({ semesterNumber, onBack }) => {
  const subjects = getSubjects(semesterNumber);
  const [globalTarget, setGlobalTarget] = useState(75);
  const [attendanceData, setAttendanceData] = useState(
    subjects.map(subject => ({
      name: subject.name,
      conducted: 0,
      attended: 0,
      target: 75
    }))
  );

  const updateGlobalTarget = (value) => {
    const newTarget = parseInt(value) || 0;
    setGlobalTarget(newTarget);
    setAttendanceData(attendanceData.map(data => ({
      ...data,
      target: newTarget
    })));
  };

  const updateAttendance = (index, field, value) => {
    const newData = [...attendanceData];
    newData[index][field] = parseInt(value) || 0;
    setAttendanceData(newData);
  };

  const calculateCurrentPercentage = (conducted, attended) => {
    return conducted > 0 ? ((attended / conducted) * 100).toFixed(1) : '0.0';
  };

  const calculateExtraClasses = (conducted, attended, target) => {
    const currentPercentage = conducted > 0 ? (attended / conducted) * 100 : 0;
    
    if (currentPercentage >= target) {
      return 'Target Achieved ✅';
    }

    if (target >= 100) {
      return 'Impossible (100% target)';
    }

    const extraClasses = Math.ceil(((target / 100) * conducted - attended) / (1 - (target / 100)));
    
    return extraClasses <= 0 ? 'Target Achieved ✅' : `${extraClasses} classes`;
  };

  return (
    <div className="attendance-container">
      <h1 className="attendance-header">Attendance Calculator</h1>
      <p className="attendance-header">Semester {semesterNumber} - Attendance Tracker</p>
      
      <div className="global-target">
        <label htmlFor="global-target-percentage">Default Target Attendance:</label>
        <input
          type="number"
          id="global-target-percentage"
          className="input-field target-input"
          value={globalTarget}
          min="0"
          max="100"
          onChange={(e) => updateGlobalTarget(e.target.value)}
        />
        <span style={{ color: '#e0e0e0' }}>%</span>
      </div>

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Classes Conducted</th>
              <th>Classes Attended</th>
              <th>Current %</th>
              <th>Target %</th>
              <th>Extra Classes Needed</th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((data, index) => (
              <tr key={index}>
                <td data-label="Subject" className="subject-cell">{data.name}</td>
                <td data-label="Classes Conducted">
                  <input
                    type="number"
                    className="input-field"
                    min="0"
                    value={data.conducted}
                    onChange={(e) => updateAttendance(index, 'conducted', e.target.value)}
                  />
                </td>
                <td data-label="Classes Attended">
                  <input
                    type="number"
                    className="input-field"
                    min="0"
                    value={data.attended}
                    onChange={(e) => updateAttendance(index, 'attended', e.target.value)}
                  />
                </td>
                <td data-label="Current %" className="result-cell">
                  {calculateCurrentPercentage(data.conducted, data.attended)}%
                </td>
                <td data-label="Target %">
                  <input
                    type="number"
                    className="input-field target-input"
                    min="0"
                    max="100"
                    value={data.target}
                    onChange={(e) => updateAttendance(index, 'target', e.target.value)}
                  />%
                </td>
                <td data-label="Extra Classes Needed" className="result-cell">
                  <span className={
                    calculateExtraClasses(data.conducted, data.attended, data.target).includes('✅')
                      ? 'target-achieved'
                      : 'extra-needed'
                  }>
                    {calculateExtraClasses(data.conducted, data.attended, data.target)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="back-to-cgpa" onClick={onBack}>
        ← Back to CGPA Calculator
      </button>
    </div>
  );
};

export default Attendance;
