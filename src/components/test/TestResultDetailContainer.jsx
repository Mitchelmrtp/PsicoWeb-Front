/**
 * Container component para TestResultDetail
 * Implementa Container/Presenter pattern y Single Responsibility Principle
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestResultDetail } from '../../hooks/useTests';
import TestResultDetailPresenter from './TestResultDetailPresenter';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const TestResultDetailContainer = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const { result, loading, error, refetch } = useTestResultDetail(resultId);

  const handleGoBack = () => {
    navigate('/testmenu');
  };

  const handleRetry = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Cargando resultado..." />
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error || 'No se pudo cargar el resultado de la prueba'}</p>
          <div className="mt-4 space-x-2">
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Volver
            </button>
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <TestResultDetailPresenter
        result={result}
        onGoBack={handleGoBack}
      />
    </ErrorBoundary>
  );
};

export default TestResultDetailContainer;
