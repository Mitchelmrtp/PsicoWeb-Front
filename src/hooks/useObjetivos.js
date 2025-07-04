/**
 * Custom hooks para gestión de objetivos y ejercicios
 * Implementa el patrón Custom Hook para separar lógica de presentación
 */
import { useState, useEffect, useCallback } from 'react';
import { apiServices } from '../services/api';
import { useAuth } from './useAuth';

/**
 * Hook para gestión de objetivos
 */
export const useObjetivos = (pacienteId = null) => {
  const { user } = useAuth();
  const [objetivos, setObjetivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar objetivos
  const loadObjetivos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (pacienteId) {
        // Cargar objetivos de un paciente específico
        response = await apiServices.objetivos.getObjetivosByPaciente(pacienteId);
      } else {
        // Cargar objetivos del usuario actual (filtrados automáticamente por rol en backend)
        response = await apiServices.objetivos.getObjetivos();
      }

      // Extract data from the response wrapper
      const data = response?.data || response || [];
      setObjetivos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading objetivos:', err);
      setError(err.message || 'Error al cargar objetivos');
    } finally {
      setLoading(false);
    }
  }, [pacienteId, user]);

  // Función para crear un nuevo objetivo
  const createObjetivo = useCallback(async (objetivoData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiServices.objetivos.createObjetivo({
        ...objetivoData
      });

      // Extract data from the response wrapper
      const newObjetivo = response?.data || response;
      setObjetivos(prev => [...prev, newObjetivo]);
      return newObjetivo;
    } catch (err) {
      console.error('Error creating objetivo:', err);
      setError(err.message || 'Error al crear objetivo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Función para actualizar un objetivo
  const updateObjetivo = useCallback(async (objetivoId, objetivoData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiServices.objetivos.updateObjetivo(objetivoId, objetivoData);
      
      // Extract data from the response wrapper
      const updatedObjetivo = response?.data || response;
      setObjetivos(prev => 
        prev.map(objetivo => 
          objetivo.id === objetivoId ? updatedObjetivo : objetivo
        )
      );

      return updatedObjetivo;
    } catch (err) {
      console.error('Error updating objetivo:', err);
      setError(err.message || 'Error al actualizar objetivo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para eliminar un objetivo
  const deleteObjetivo = useCallback(async (objetivoId) => {
    try {
      setLoading(true);
      setError(null);

      await apiServices.objetivos.deleteObjetivo(objetivoId);
      
      setObjetivos(prev => prev.filter(objetivo => objetivo.id !== objetivoId));
    } catch (err) {
      console.error('Error deleting objetivo:', err);
      setError(err.message || 'Error al eliminar objetivo');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para actualizar progreso
  const updateProgreso = useCallback(async (objetivoId, progreso) => {
    try {
      const updatedObjetivo = await apiServices.objetivos.updateProgreso(objetivoId, progreso);
      
      setObjetivos(prev => 
        prev.map(objetivo => 
          objetivo.id === objetivoId ? updatedObjetivo : objetivo
        )
      );

      return updatedObjetivo;
    } catch (err) {
      console.error('Error updating progreso:', err);
      setError(err.message || 'Error al actualizar progreso');
      throw err;
    }
  }, []);

  // Cargar objetivos al montar el componente
  useEffect(() => {
    if (user) {
      loadObjetivos();
    }
  }, [loadObjetivos, user]);

  return {
    objetivos,
    loading,
    error,
    loadObjetivos,
    createObjetivo,
    updateObjetivo,
    deleteObjetivo,
    updateProgreso
  };
};

/**
 * Hook para gestión de un objetivo específico
 */
export const useObjetivo = (objetivoId) => {
  const [objetivo, setObjetivo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadObjetivo = useCallback(async () => {
    if (!objetivoId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await apiServices.objetivos.getObjetivoById(objetivoId);
      
      // Extract data from the response wrapper
      const data = response?.data || response;
      setObjetivo(data);
    } catch (err) {
      console.error('Error loading objetivo:', err);
      setError(err.message || 'Error al cargar objetivo');
    } finally {
      setLoading(false);
    }
  }, [objetivoId]);

  useEffect(() => {
    loadObjetivo();
  }, [loadObjetivo]);

  return {
    objetivo,
    loading,
    error,
    loadObjetivo
  };
};

/**
 * Hook para gestión de ejercicios
 */
export const useEjercicios = (objetivoId = null, pacienteId = null) => {
  const { user } = useAuth();
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para cargar ejercicios
  const loadEjercicios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (objetivoId) {
        // Cargar ejercicios de un objetivo específico
        response = await apiServices.ejercicios.getEjerciciosByObjetivo(objetivoId);
      } else if (pacienteId) {
        // Cargar ejercicios de un paciente específico
        response = await apiServices.ejercicios.getEjerciciosByPaciente(pacienteId);
      } else if (user?.role === 'paciente') {
        // Cargar ejercicios del paciente actual
        response = await apiServices.ejercicios.getEjerciciosByPaciente(user.id);
      }

      // Extract data from the response wrapper
      const data = response?.data || response || [];
      setEjercicios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading ejercicios:', err);
      setError(err.message || 'Error al cargar ejercicios');
    } finally {
      setLoading(false);
    }
  }, [objetivoId, pacienteId, user]);

  // Función para asignar un ejercicio
  const asignarEjercicio = useCallback(async (ejercicioData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiServices.ejercicios.asignarEjercicio(ejercicioData);
      
      // Extract data from the response wrapper
      const newEjercicio = response?.data || response;
      setEjercicios(prev => [...prev, newEjercicio]);
      return newEjercicio;
    } catch (err) {
      console.error('Error asignando ejercicio:', err);
      setError(err.message || 'Error al asignar ejercicio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Función para marcar ejercicio como completado
  const marcarCompletado = useCallback(async (ejercicioId, completionData = {}) => {
    try {
      const response = await apiServices.ejercicios.marcarCompletado(ejercicioId, completionData);
      
      // Extract data from the response wrapper
      const updatedEjercicio = response?.data || response;
      setEjercicios(prev => 
        prev.map(ejercicio => 
          ejercicio.id === ejercicioId ? updatedEjercicio : ejercicio
        )
      );

      return updatedEjercicio;
    } catch (err) {
      console.error('Error marcando ejercicio como completado:', err);
      setError(err.message || 'Error al marcar ejercicio como completado');
      throw err;
    }
  }, []);

  // Función para marcar ejercicio como no completado
  const marcarNoCompletado = useCallback(async (ejercicioId) => {
    try {
      const response = await apiServices.ejercicios.marcarNoCompletado(ejercicioId);
      
      // Extract data from the response wrapper
      const updatedEjercicio = response?.data || response;
      setEjercicios(prev => 
        prev.map(ejercicio => 
          ejercicio.id === ejercicioId ? updatedEjercicio : ejercicio
        )
      );

      return updatedEjercicio;
    } catch (err) {
      console.error('Error marcando ejercicio como no completado:', err);
      setError(err.message || 'Error al marcar ejercicio como no completado');
      throw err;
    }
  }, []);

  // Función para eliminar ejercicio
  const deleteEjercicio = useCallback(async (ejercicioId) => {
    try {
      setLoading(true);
      setError(null);

      await apiServices.ejercicios.deleteEjercicio(ejercicioId);
      
      setEjercicios(prev => prev.filter(ejercicio => ejercicio.id !== ejercicioId));
    } catch (err) {
      console.error('Error deleting ejercicio:', err);
      setError(err.message || 'Error al eliminar ejercicio');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar ejercicios al montar el componente
  useEffect(() => {
    if (user) {
      loadEjercicios();
    }
  }, [loadEjercicios, user]);

  return {
    ejercicios,
    loading,
    error,
    loadEjercicios,
    asignarEjercicio,
    marcarCompletado,
    marcarNoCompletado,
    deleteEjercicio
  };
};

/**
 * Hook para obtener el progreso de ejercicios de un paciente
 */
export const useProgresoEjercicios = (pacienteId = null) => {
  const { user } = useAuth();
  const [progreso, setProgreso] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProgreso = useCallback(async () => {
    const targetPacienteId = pacienteId || (user?.role === 'paciente' ? user.id : null);
    
    if (!targetPacienteId) return;

    try {
      setLoading(true);
      setError(null);

      const data = await apiServices.ejercicios.getProgresoEjercicios(targetPacienteId);
      setProgreso(data);
    } catch (err) {
      console.error('Error loading progreso ejercicios:', err);
      setError(err.message || 'Error al cargar progreso de ejercicios');
    } finally {
      setLoading(false);
    }
  }, [pacienteId, user]);

  useEffect(() => {
    loadProgreso();
  }, [loadProgreso]);

  return {
    progreso,
    loading,
    error,
    loadProgreso
  };
};
