import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GradeCalculator from '../components/GradeCalculator';

const GradeCalculatorPage = () => {
  const { semesterNumber } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/semesters');
  };

  return <GradeCalculator semesterNumber={parseInt(semesterNumber)} onBack={handleBack} />;
};

export default GradeCalculatorPage;
