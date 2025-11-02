import React, { useState, useEffect } from 'react';
import { parseCSV } from '../utils/csvParser';
import './Attendance.css';

const Attendance = ({ semesterNumber, onBack }) => {
  const [globalTarget, setGlobalTarget] = useState(75);
  const [attendanceData, setAttendanceData] = useState([]);
  const [originalAttendanceData, setOriginalAttendanceData] = useState([]); // Store original CSV data
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  // ✅ Auto-fetch attendance.csv from /public folder on mount
  useEffect(() => {
    handleImportCSV(true);
    // eslint-disable-next-line
  }, []);

  // --- Update global target ---
  const updateGlobalTarget = (value) => {
    const newTarget = parseInt(value) || 0;
    setGlobalTarget(newTarget);
    setAttendanceData(attendanceData.map(data => ({
      ...data,
      target: newTarget
    })));
  };

  // --- Update individual attendance ---
  const updateAttendance = (index, field, value) => {
    const newData = [...attendanceData];
    newData[index][field] = parseInt(value) || 0;
    setAttendanceData(newData);
  };

  // --- Master buttons to increase/decrease all subjects ---
  const increaseAllConducted = () => {
    const newData = attendanceData.map(data => ({
      ...data,
      conducted: data.conducted + 1
    }));
    setAttendanceData(newData);
  };

  const decreaseAllConducted = () => {
    const newData = attendanceData.map(data => ({
      ...data,
      conducted: Math.max(0, data.conducted - 1)
    }));
    setAttendanceData(newData);
  };

  // --- Reset to original CSV data ---
  const resetToOriginal = () => {
    if (originalAttendanceData.length > 0) {
      setAttendanceData(JSON.parse(JSON.stringify(originalAttendanceData))); // Deep copy to avoid reference issues
      setImportMessage('✅ Reset to original CSV data!');
      setTimeout(() => setImportMessage(''), 4000);
    }
  };

  const calculateCurrentPercentage = (conducted, attended) =>
    conducted > 0 ? ((attended / conducted) * 100).toFixed(1) : '0.0';

  const calculateExtraClasses = (conducted, attended, target) => {
    const currentPercentage = conducted > 0 ? (attended / conducted) * 100 : 0;
    if (currentPercentage >= target) return 'Target Achieved ✅';
    if (target >= 100) return 'Impossible (100%)';

    const extraClasses = Math.ceil(((target / 100) * conducted - attended) / (1 - target / 100));
    return extraClasses <= 0 ? 'Target Achieved ✅' : `${extraClasses} classes`;
  };

  // --- Import attendance.csv (auto or manual refresh) ---
  const handleImportCSV = async (autoFetch = false) => {
    try {
      setImporting(true);
      setImportMessage(autoFetch ? 'Fetching latest attendance data...' : 'Refreshing attendance data...');

      // ✅ Directly from public/attendance.csv
      const response = await fetch('/attendance.csv', { cache: 'no-store' });
      if (!response.ok) throw new Error('Failed to load attendance.csv');

      const csvText = await response.text();
      const parsedData = parseCSV(csvText);

      if (!parsedData || parsedData.length === 0) throw new Error('No data found in CSV');

      // Map CSV rows into attendanceData directly
      const newAttendanceData = parsedData.map(row => ({
        name: (row.Course || '').trim(),
        conducted: parseInt(row['Total Hours']) || 0,
        attended: parseInt(row['Attended Hours']) || 0,
        target: globalTarget
      }));

      setAttendanceData(newAttendanceData);
      setOriginalAttendanceData(JSON.parse(JSON.stringify(newAttendanceData))); // Store deep copy of original data
      setImportMessage('✅ Latest attendance data loaded!');
    } catch (err) {
      console.error('Error importing CSV:', err);
      setImportMessage('❌ Failed to load attendance.csv');
    } finally {
      setImporting(false);
      setTimeout(() => setImportMessage(''), 4000);
    }
  };



  return (
    <div className="attendance-container">
      <h1 className="attendance-header">Attendance Calculator</h1>
      {importMessage && (
        <div className="import-section">
          <div className="import-message">{importMessage}</div>
        </div>
      )}

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

      <div className="master-controls">
        <p className="master-label">Add/Remove day for all subjects:</p>
        <div className="master-buttons">
          <button 
            className="master-btn minus" 
            onClick={decreaseAllConducted}
            aria-label="Decrease all conducted classes by 1"
          >
            − Remove Day
          </button>
          <button 
            className="master-btn reset" 
            onClick={resetToOriginal}
            aria-label="Reset to original CSV data"
          >
            ↺ Reset
          </button>
          <button 
            className="master-btn plus" 
            onClick={increaseAllConducted}
            aria-label="Increase all conducted classes by 1"
          >
            + Add Day
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>SNo</th>
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
                <td data-label="SNo">{index + 1}</td>
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
                  <span
                    className={
                      calculateExtraClasses(data.conducted, data.attended, data.target).includes('✅')
                        ? 'target-achieved'
                        : 'extra-needed'
                    }
                  >
                    {calculateExtraClasses(data.conducted, data.attended, data.target)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="total-row">
              <td></td>
              <td className="total-label"><strong>Total</strong></td>
              <td className="total-value">
                <strong>{attendanceData.reduce((sum, data) => sum + data.conducted, 0)}</strong>
              </td>
              <td className="total-value">
                <strong>{attendanceData.reduce((sum, data) => sum + data.attended, 0)}</strong>
              </td>
              <td className="total-value">
                <strong>
                  {(() => {
                    const totalConducted = attendanceData.reduce((sum, data) => sum + data.conducted, 0);
                    const totalAttended = attendanceData.reduce((sum, data) => sum + data.attended, 0);
                    return totalConducted > 0 ? ((totalAttended / totalConducted) * 100).toFixed(1) : '0.0';
                  })()}%
                </strong>
              </td>
              <td colSpan="2" className="total-info">Overall Attendance</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <button className="back-to-cgpa" onClick={onBack}>
        ← Back
      </button>
    </div>
  );
};

export default Attendance;
