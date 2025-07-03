/**
 * Hook para manejo de una prueba individual
 * Implementa Single Responsibility Principle
 */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { apiServices } from '../services/api';
import { useAuth } from './useAuth';

export const useTestExecution = (testId) => {
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // Cargar la prueba y sus preguntas
  useEffect(() => {
    const fetchTest = async () => {
      if (!testId) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await apiServices.test.getTestById(testId);
        const testData = response.data || response;
        
        setTest(testData);
        setQuestions(testData.Preguntas || []);
      } catch (err) {
        console.error('Error loading test:', err);
        setError('Error al cargar la prueba');
        toast.error('Error al cargar la prueba');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  // Manejar respuesta a una pregunta
  const handleAnswer = useCallback((questionId, answerIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  }, []);

  // Navegar entre preguntas
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  // Verificar si todas las preguntas están respondidas
  const isComplete = useCallback(() => {
    return questions.every(question => answers[question.id] !== undefined);
  }, [questions, answers]);

  // Calcular progreso
  const progress = questions.length > 0 ? (Object.keys(answers).length / questions.length) * 100 : 0;

  // Enviar respuestas
  const submitTest = useCallback(async () => {
    if (!isComplete()) {
      toast.error('Por favor responde todas las preguntas antes de enviar');
      return;
    }

    try {
      setSubmitting(true);
      
      // Preparar datos para envío
      const respuestas = questions.map(question => ({
        idPregunta: question.id,
        respuesta: answers[question.id]
      }));

      // Calcular puntuaciones básicas (esto podría moverse al backend)
      const puntuacionTotal = respuestas.reduce((total, resp) => total + (resp.respuesta + 1), 0);
      const puntuacionPromedio = puntuacionTotal / respuestas.length;

      const resultData = {
        idPrueba: testId,
        idPaciente: user.id || user.userId,
        respuestas,
        puntuacionTotal,
        puntuacionPromedio,
        interpretacion: getInterpretation(puntuacionPromedio)
      };

      const response = await apiServices.test.submitTestResults(testId, resultData);
      toast.success('Respuestas enviadas exitosamente');
      
      return response;
    } catch (err) {
      console.error('Error submitting test:', err);
      toast.error('Error al enviar las respuestas');
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [testId, questions, answers, isComplete, user]);

  // Función auxiliar para interpretación básica
  const getInterpretation = (promedio) => {
    if (promedio >= 4) return 'Nivel alto - Por encima de parámetros normales';
    if (promedio >= 3) return 'Nivel general: Moderado';
    if (promedio >= 2) return 'Nivel bajo - Dentro de parámetros normales';
    return 'Nivel muy bajo - Dentro de parámetros normales';
  };

  // Reiniciar prueba
  const resetTest = useCallback(() => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setError(null);
  }, []);

  return {
    test,
    questions,
    currentQuestion: questions[currentQuestionIndex],
    currentQuestionIndex,
    answers,
    loading,
    submitting,
    error,
    progress,
    isComplete: isComplete(),
    handleAnswer,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    submitTest,
    resetTest,
    hasNext: currentQuestionIndex < questions.length - 1,
    hasPrevious: currentQuestionIndex > 0,
    totalQuestions: questions.length,
  };
};

export default useTestExecution;
