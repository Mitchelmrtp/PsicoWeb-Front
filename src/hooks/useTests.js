/**
 * Hook para manejo de pruebas psicológicas
 * Implementa Single Responsibility Principle y separation of concerns
 */
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { apiServices } from '../services/api';
import { useAuth } from './useAuth';

export const useTests = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiServices.test.getAllTests();
      const testsData = Array.isArray(response) ? response : (response.data || []);
      setTests(testsData.filter(test => test.activa));
    } catch (err) {
      console.error('Error loading tests:', err);
      setError('Error al cargar las pruebas disponibles');
      toast.error('Error al cargar las pruebas');
    } finally {
      setLoading(false);
    }
  }, []);

  const createTest = useCallback(async (testData) => {
    try {
      setLoading(true);
      const response = await apiServices.test.createTest(testData);
      toast.success('Prueba creada exitosamente');
      fetchTests(); // Refrescar lista
      return response;
    } catch (err) {
      console.error('Error creating test:', err);
      toast.error('Error al crear la prueba');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTests]);

  const updateTest = useCallback(async (testId, testData) => {
    try {
      setLoading(true);
      const response = await apiServices.test.updateTest(testId, testData);
      toast.success('Prueba actualizada exitosamente');
      fetchTests(); // Refrescar lista
      return response;
    } catch (err) {
      console.error('Error updating test:', err);
      toast.error('Error al actualizar la prueba');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTests]);

  const deleteTest = useCallback(async (testId) => {
    try {
      setLoading(true);
      await apiServices.test.deleteTest(testId);
      toast.success('Prueba eliminada exitosamente');
      fetchTests(); // Refrescar lista
    } catch (err) {
      console.error('Error deleting test:', err);
      toast.error('Error al eliminar la prueba');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchTests]);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  return {
    tests,
    loading,
    error,
    fetchTests,
    createTest,
    updateTest,
    deleteTest,
  };
};

export const useTestDetail = (testId) => {
  const [testDetail, setTestDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTestDetail = useCallback(async (id = testId) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiServices.test.getTestById(id);
      setTestDetail(response.data || response);
    } catch (err) {
      console.error('Error loading test detail:', err);
      setError('Error al cargar los detalles de la prueba');
      toast.error('Error al cargar los detalles de la prueba');
    } finally {
      setLoading(false);
    }
  }, [testId]);

  useEffect(() => {
    if (testId) {
      fetchTestDetail();
    }
  }, [testId, fetchTestDetail]);

  return {
    testDetail,
    loading,
    error,
    refetch: fetchTestDetail,
  };
};

export const useTestResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchResults = useCallback(async (patientId = null) => {
    try {
      setLoading(true);
      setError(null);
      const targetPatientId = patientId || user?.id || user?.userId;
      
      if (!targetPatientId) {
        console.warn('No patient ID available');
        return;
      }
      
      const response = await apiServices.test.getPatientResults(targetPatientId);
      const resultsData = Array.isArray(response) ? response : (response.data || []);
      const sortedResults = resultsData.sort((a, b) => 
        new Date(b.fechaRealizacion) - new Date(a.fechaRealizacion)
      );
      setResults(sortedResults);
    } catch (err) {
      console.error('Error loading test results:', err);
      setError('Error al cargar resultados de pruebas');
      toast.error('Error al cargar los resultados');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const submitTestResult = useCallback(async (testId, resultData) => {
    try {
      setLoading(true);
      const response = await apiServices.test.submitTestResults(testId, resultData);
      toast.success('Respuestas enviadas exitosamente');
      fetchResults(); // Refrescar resultados
      return response;
    } catch (err) {
      console.error('Error submitting test result:', err);
      toast.error('Error al enviar las respuestas');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchResults]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return {
    results,
    loading,
    error,
    fetchResults,
    submitTestResult,
  };
};

export const useTestResultDetail = (resultId) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchResultDetail = useCallback(async (id = resultId) => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiServices.test.getResultDetail(id);
      const resultData = response.data || response;
      
      if (!resultData || !resultData.Prueba) {
        throw new Error('Datos de resultado incompletos');
      }
      
      setResult(resultData);
    } catch (err) {
      console.error('Error loading test result detail:', err);
      setError(err.message || 'Error al cargar el resultado de la prueba');
      toast.error('Error al cargar el resultado');
    } finally {
      setLoading(false);
    }
  }, [resultId]);

  useEffect(() => {
    if (resultId) {
      fetchResultDetail();
    }
  }, [resultId, fetchResultDetail]);

  return {
    result,
    loading,
    error,
    refetch: fetchResultDetail,
  };
};
