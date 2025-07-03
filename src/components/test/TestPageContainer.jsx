/**
 * Container component para TestPage
 * Implementa Container/Presenter pattern - maneja la lógica de negocio
 */
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTestExecution } from '../../hooks/useTestExecution';
import TestPagePresenter from './TestPagePresenter';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorBoundary from '../common/ErrorBoundary';

const TestPageContainer = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  
  const {
    test,
    currentQuestion,
    currentQuestionIndex,
    answers,
    loading,
    submitting,
    error,
    progress,
    isComplete,
    handleAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    submitTest,
    hasNext,
    hasPrevious,
    totalQuestions,
  } = useTestExecution(testId);

  // Handler para envío de prueba
  const handleSubmitTest = async () => {
    try {
      const result = await submitTest();
      if (result && result.data?.id) {
        navigate(`/resultados/${result.data.id}`);
      } else {
        navigate('/testmenu');
      }
    } catch (error) {
      // Error ya manejado en el hook
      console.error('Error in handleSubmitTest:', error);
    }
  };

  // Handler para volver atrás
  const handleGoBack = () => {
    navigate('/testmenu');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" text="Cargando prueba..." />
      </div>
    );
  }

  if (error || !test || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error || 'No se pudo cargar la prueba'}</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver al menú
          </button>
        </div>
      </div>
    );
  }

  const presenterProps = {
    test,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    progress,
    isComplete,
    submitting,
    hasNext,
    hasPrevious,
    onAnswer: handleAnswer,
    onNext: goToNextQuestion,
    onPrevious: goToPreviousQuestion,
    onGoToQuestion: goToQuestion,
    onSubmit: handleSubmitTest,
    onGoBack: handleGoBack,
  };

  return (
    <ErrorBoundary>
      <TestPagePresenter {...presenterProps} />
    </ErrorBoundary>
  );
};

export default TestPageContainer;
