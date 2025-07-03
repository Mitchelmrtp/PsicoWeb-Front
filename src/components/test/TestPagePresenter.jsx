/**
 * Presenter component para TestPage
 * Implementa Container/Presenter pattern - solo lógica de presentación
 */
import React from 'react';
import PropTypes from 'prop-types';

const TestPagePresenter = ({
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
  onAnswer,
  onNext,
  onPrevious,
  onGoToQuestion,
  onSubmit,
  onGoBack,
}) => {
  const currentAnswer = answers[currentQuestion.id];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{test.titulo}</h1>
              <p className="text-gray-600">{test.descripcion}</p>
            </div>
            <button
              onClick={onGoBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Salir
            </button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Pregunta {currentQuestionIndex + 1} de {totalQuestions}</span>
              <span>{Math.round(progress)}% completado</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Question Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Question Text */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {currentQuestion.enunciado}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.opciones && currentQuestion.opciones.map((opcion, index) => (
              <label
                key={index}
                className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentAnswer === index
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={index}
                  checked={currentAnswer === index}
                  onChange={() => onAnswer(currentQuestion.id, index)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  currentAnswer === index
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {currentAnswer === index && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-gray-900">{opcion}</span>
              </label>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={onPrevious}
              disabled={!hasPrevious}
              className={`px-6 py-2 rounded-md transition-colors ${
                hasPrevious
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Anterior
            </button>

            {/* Question Indicators */}
            <div className="flex space-x-2">
              {Array.from({ length: totalQuestions }, (_, index) => (
                <button
                  key={index}
                  onClick={() => onGoToQuestion(index)}
                  className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? 'bg-blue-600 text-white'
                      : answers[test.Preguntas?.[index]?.id] !== undefined
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {hasNext ? (
              <button
                onClick={onNext}
                disabled={currentAnswer === undefined}
                className={`px-6 py-2 rounded-md transition-colors ${
                  currentAnswer !== undefined
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={!isComplete || submitting}
                className={`px-6 py-2 rounded-md transition-colors ${
                  isComplete && !submitting
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {submitting ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </div>
                ) : (
                  'Finalizar Prueba'
                )}
              </button>
            )}
          </div>

          {/* Completion Status */}
          {!isComplete && (
            <div className="mt-4 text-center">
              <p className="text-sm text-amber-600">
                Por favor responde todas las preguntas antes de finalizar la prueba
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

TestPagePresenter.propTypes = {
  test: PropTypes.shape({
    titulo: PropTypes.string.isRequired,
    descripcion: PropTypes.string,
    Preguntas: PropTypes.array,
  }).isRequired,
  currentQuestion: PropTypes.shape({
    id: PropTypes.string.isRequired,
    enunciado: PropTypes.string.isRequired,
    opciones: PropTypes.array.isRequired,
  }).isRequired,
  currentQuestionIndex: PropTypes.number.isRequired,
  totalQuestions: PropTypes.number.isRequired,
  answers: PropTypes.object.isRequired,
  progress: PropTypes.number.isRequired,
  isComplete: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  hasNext: PropTypes.bool.isRequired,
  hasPrevious: PropTypes.bool.isRequired,
  onAnswer: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onGoToQuestion: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default TestPagePresenter;
