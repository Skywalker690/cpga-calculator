import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Attendance from '../components/Attendance';

const AttendancePage = () => {
  const { semesterNumber } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/semesters');
  };

  return <Attendance semesterNumber={parseInt(semesterNumber)} onBack={handleBack} />;
};

export default AttendancePage;
