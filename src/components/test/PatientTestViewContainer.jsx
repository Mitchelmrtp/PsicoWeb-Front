/**
 * Container component para PatientTestView
 * Implementa Container/Presenter pattern - maneja la lógica de negocio
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTests, useTestResults } from '../../hooks/useTests';
import { useAuth } from '../../hooks/useAuth';
import PatientTestViewPresenter from './PatientTestViewPresenter';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const PatientTestViewContainer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Hooks para manejar datos
  const { tests, loading: loadingTests, error: testsError } = useTests();
  const { results, loading: loadingResults, error: resultsError } = useTestResults();

  // Handlers para acciones
  const handleTakeTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handleViewResult = (resultId) => {
    navigate(`/resultados/${resultId}`);
  };

  const handleToggleDetails = async (testId, currentSelected, setSelected, setDetails, setLoadingDetails) => {
    if (currentSelected === testId) {
      setSelected(null);
      setDetails(null);
      return;
    }

    try {
      setLoadingDetails(true);
      setSelected(testId);
      
      // Usar el hook useTestDetail o llamar directamente al servicio
      // Por simplicidad, mantener la lógica existente aquí
      const { apiServices } = await import('../../services/api');
      const response = await apiServices.test.getTestById(testId);
      setDetails(response.data || response);
    } catch (err) {
      console.error('Error loading test details:', err);
      setDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Preparar datos para el presenter
  const presenterProps = {
    tests,
    results,
    loadingTests,
    loadingResults,
    testsError,
    resultsError,
    onTakeTest: handleTakeTest,
    onViewResult: handleViewResult,
    onToggleDetails: handleToggleDetails,
  };

  return (
    <ErrorBoundary>
      <PatientTestViewPresenter {...presenterProps} />
    </ErrorBoundary>
  );
};

export default PatientTestViewContainer;
