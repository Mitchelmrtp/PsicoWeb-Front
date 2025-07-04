/**
 * Container para la página "Mis Objetivos" (Paciente)
 * Implementa Container/Presenter pattern para separar lógica de presentación
 */
import React, { useState, useCallback } from 'react';
import { useObjetivos, useEjercicios } from '../../hooks/useObjetivos';
import { useAuth } from '../../hooks/useAuth';
import MisObjetivosPresenter from './MisObjetivosPresenter';
import ErrorBoundary from '../common/ErrorBoundary';

const MisObjetivosContainer = () => {
  const { user } = useAuth();
  
  // Estados para la UI
  const [selectedObjetivo, setSelectedObjetivo] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'

  // Hooks para datos
  const {
    objetivos,
    loading: loadingObjetivos,
    error: objetivosError,
    loadObjetivos
  } = useObjetivos();

  const {
    ejercicios,
    loading: loadingEjercicios,
    error: ejerciciosError,
    marcarCompletado,
    marcarNoCompletado,
    loadEjercicios
  } = useEjercicios(selectedObjetivo?.id);

  // Handlers para objetivos
  const handleSelectObjetivo = useCallback((objetivo) => {
    setSelectedObjetivo(objetivo);
  }, []);

  const handleBackToList = useCallback(() => {
    setSelectedObjetivo(null);
  }, []);

  // Handlers para ejercicios
  const handleToggleEjercicio = useCallback(async (ejercicioId, completado) => {
    try {
      if (completado) {
        await marcarCompletado(ejercicioId);
      } else {
        await marcarNoCompletado(ejercicioId);
      }
      
      // Recargar datos para actualizar progreso
      loadObjetivos();
      loadEjercicios();
    } catch (error) {
      console.error('Error toggling ejercicio:', error);
    }
  }, [marcarCompletado, marcarNoCompletado, loadObjetivos, loadEjercicios]);

  // Filtrar y ordenar objetivos
  const objetivosActivos = objetivos.filter(obj => (obj.progreso || 0) < 100);
  const objetivosCompletados = objetivos.filter(obj => (obj.progreso || 0) >= 100);

  // Calcular estadísticas
  const estadisticas = {
    total: objetivos.length,
    activos: objetivosActivos.length,
    completados: objetivosCompletados.length,
    progresoPromedio: objetivos.length > 0 
      ? Math.round(objetivos.reduce((acc, obj) => acc + (obj.progreso || 0), 0) / objetivos.length)
      : 0
  };

  // Preparar props para el presenter
  const presenterProps = {
    // Datos
    objetivos,
    objetivosActivos,
    objetivosCompletados,
    ejercicios,
    selectedObjetivo,
    estadisticas,
    
    // Estados
    viewMode,
    loadingObjetivos,
    loadingEjercicios,
    objetivosError,
    ejerciciosError,
    
    // Handlers
    onSelectObjetivo: handleSelectObjetivo,
    onBackToList: handleBackToList,
    onToggleEjercicio: handleToggleEjercicio,
    onChangeViewMode: setViewMode,
    
    // Datos de usuario
    user
  };

  return (
    <ErrorBoundary>
      <MisObjetivosPresenter {...presenterProps} />
    </ErrorBoundary>
  );
};

export default MisObjetivosContainer;
