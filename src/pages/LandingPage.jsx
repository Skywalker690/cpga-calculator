import React from 'react';
import { useNavigate } from 'react-router-dom';
import GradeTable from '../components/GradeTable';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleProceed = () => {
    navigate('/semesters');
  };

  return (
    <div className="main-box">
      <GradeTable />
      <div className="center-box">
        <button className="btn" onClick={handleProceed}>Proceed →</button>
      </div>
    </div>
  );
};

export default LandingPage;
