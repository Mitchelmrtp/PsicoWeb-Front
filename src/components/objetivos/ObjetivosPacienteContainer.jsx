/**
 * Container para la página de Objetivos del Paciente (Psicólogo)
 * Implementa Container/Presenter pattern para separar lógica de presentación
 */
import React, { useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useObjetivos, useEjercicios } from '../../hooks/useObjetivos';
import { useAuth } from '../../hooks/useAuth';
import ObjetivosPacientePresenter from './ObjetivosPacientePresenter';
import ErrorBoundary from '../common/ErrorBoundary';

const ObjetivosPacienteContainer = () => {
  const { pacienteId } = useParams();
  const { user } = useAuth();
  
  // Validate that patient ID is provided
  if (!pacienteId) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <svg className="mx-auto h-12 w-12 text-yellow-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No hay paciente seleccionado</h3>
          <p className="text-yellow-700 mb-4">
            Para crear objetivos, primero debe seleccionar un paciente desde la sección "Pacientes".
          </p>
          <a 
            href="/pacientes" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Ir a Pacientes
          </a>
        </div>
      </div>
    );
  }
  
  // Estados para la UI
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignModalObjetivo, setAssignModalObjetivo] = useState(null);

  // Hooks para datos
  const {
    objetivos,
    loading: loadingObjetivos,
    error: objetivosError,
    createObjetivo,
    updateObjetivo,
    deleteObjetivo,
    updateProgreso
  } = useObjetivos(pacienteId);

  const {
    ejercicios,
    loading: loadingEjercicios,
    error: ejerciciosError,
    asignarEjercicio,
    deleteEjercicio: eliminarEjercicio
  } = useEjercicios(selectedObjetivo?.id);

  // Handlers para objetivos
  const handleSelectObjetivo = useCallback((objetivo) => {
    setSelectedObjetivo(objetivo);
  }, []);

  const handleCreateObjetivo = useCallback(async (objetivoData) => {
    try {
      // Validate that a patient is selected
      if (!pacienteId) {
        throw new Error('Debe seleccionar un paciente primero');
      }

      // Prepare data for backend validation
      const dataToSend = {
        titulo: objetivoData.titulo,
        descripcion: objetivoData.descripcion,
        fechaLimite: objetivoData.fechaLimite || undefined,
        prioridad: objetivoData.prioridad || 'media',
        pacienteId: pacienteId, // Keep as string UUID, don't parse as integer
      };

      await createObjetivo(dataToSend);
      setShowCreateModal(false);
    } catch (error) {
      // Error manejado por el hook
      throw error;
    }
  }, [createObjetivo, pacienteId]);

  const handleUpdateObjetivo = useCallback(async (objetivoId, objetivoData) => {
    try {
      await updateObjetivo(objetivoId, objetivoData);
    } catch (error) {
      // Error manejado por el hook
      throw error;
    }
  }, [updateObjetivo]);

  const handleDeleteObjetivo = useCallback(async (objetivoId) => {
    try {
      await deleteObjetivo(objetivoId);
      if (selectedObjetivo?.id === objetivoId) {
        setSelectedObjetivo(null);
      }
    } catch (error) {
      // Error manejado por el hook
      throw error;
    }
  }, [deleteObjetivo, selectedObjetivo]);

  const handleUpdateProgreso = useCallback(async (objetivoId, progreso) => {
    try {
      await updateProgreso(objetivoId, progreso);
    } catch (error) {
      // Error manejado por el hook
      throw error;
    }
  }, [updateProgreso]);

  // Handlers para ejercicios
  const handleShowAssignModal = useCallback((objetivo) => {
    setAssignModalObjetivo(objetivo);
    setShowAssignModal(true);
  }, []);

  const handleAsignarEjercicio = useCallback(async (ejercicioData) => {
    try {
      await asignarEjercicio({
        ...ejercicioData,
        objetivoId: assignModalObjetivo.id,
        pacienteId: assignModalObjetivo.pacienteId,
        psicologoId: user.id
      });
      setShowAssignModal(false);
      setAssignModalObjetivo(null);
    } catch (error) {
      // Error manejado por el hook
      throw error;
    }
  }, [asignarEjercicio, assignModalObjetivo, user.id]);

  const handleDeleteEjercicio = useCallback(async (ejercicioId) => {
    try {
      await eliminarEjercicio(ejercicioId);
    } catch (error) {
      // Error manejado por el hook
      throw error;
    }
  }, [eliminarEjercicio]);

  // Handlers para modales
  const handleCloseCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const handleCloseAssignModal = useCallback(() => {
    setShowAssignModal(false);
    setAssignModalObjetivo(null);
  }, []);

  // Preparar props para el presenter
  const presenterProps = {
    // Datos
    objetivos,
    ejercicios,
    selectedObjetivo,
    
    // Estados de carga
    loadingObjetivos,
    loadingEjercicios,
    
    // Errores
    objetivosError,
    ejerciciosError,
    
    // Estados de modales
    showCreateModal,
    showAssignModal,
    assignModalObjetivo,
    
    // Handlers de objetivos
    onSelectObjetivo: handleSelectObjetivo,
    onCreateObjetivo: handleCreateObjetivo,
    onUpdateObjetivo: handleUpdateObjetivo,
    onDeleteObjetivo: handleDeleteObjetivo,
    onUpdateProgreso: handleUpdateProgreso,
    
    // Handlers de ejercicios
    onShowAssignModal: handleShowAssignModal,
    onAsignarEjercicio: handleAsignarEjercicio,
    onDeleteEjercicio: handleDeleteEjercicio,
    
    // Handlers de modales
    onShowCreateModal: () => setShowCreateModal(true),
    onCloseCreateModal: handleCloseCreateModal,
    onCloseAssignModal: handleCloseAssignModal,
    
    // Datos de usuario
    user
  };

  return (
    <ErrorBoundary>
      <ObjetivosPacientePresenter {...presenterProps} />
    </ErrorBoundary>
  );
};

export default ObjetivosPacienteContainer;
