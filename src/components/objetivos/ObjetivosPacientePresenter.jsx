/**
 * Presenter para la página de Objetivos del Paciente (Psicólogo)
 * Componente de presentación pura - solo recibe props y renderiza UI
 */
import React from 'react';
import { Card, Button, LoadingSpinner, Modal, ProgressBar } from '../ui';
import CreateObjetivoModal from './CreateObjetivoModal';
import AssignEjercicioModal from './AssignEjercicioModal';
import ObjetivoCard from './ObjetivoCard';
import EjerciciosList from './EjerciciosList';

const ObjetivosPacientePresenter = ({
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
  onSelectObjetivo,
  onCreateObjetivo,
  onUpdateObjetivo,
  onDeleteObjetivo,
  onUpdateProgreso,
  
  // Handlers de ejercicios
  onShowAssignModal,
  onAsignarEjercicio,
  onDeleteEjercicio,
  
  // Handlers de modales
  onShowCreateModal,
  onCloseCreateModal,
  onCloseAssignModal,
  
  // Datos de usuario
  user
}) => {
  if (loadingObjetivos) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Objetivos del Paciente
              </h1>
              <p className="mt-2 text-gray-600">
                Gestiona los objetivos terapéuticos y ejercicios asignados
              </p>
            </div>
            <Button
              onClick={onShowCreateModal}
              className="flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear nuevo objetivo
            </Button>
          </div>
        </div>

        {/* Error States */}
        {objetivosError && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error al cargar objetivos</h3>
                <p className="text-sm text-red-700 mt-1">{objetivosError}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Objetivos */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Lista de Objetivos
                </h2>
                
                {objetivos.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No hay objetivos
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Comienza creando el primer objetivo para este paciente.
                    </p>
                    <div className="mt-6">
                      <Button
                        onClick={onShowCreateModal}
                        size="sm"
                      >
                        Crear objetivo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {objetivos.map((objetivo) => (
                      <ObjetivoCard
                        key={objetivo.id}
                        objetivo={objetivo}
                        isSelected={selectedObjetivo?.id === objetivo.id}
                        onClick={() => onSelectObjetivo(objetivo)}
                        onDelete={() => onDeleteObjetivo(objetivo.id)}
                        onUpdateProgreso={(progreso) => onUpdateProgreso(objetivo.id, progreso)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Detalles del Objetivo Seleccionado */}
          <div className="lg:col-span-2">
            {selectedObjetivo ? (
              <Card>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {selectedObjetivo.titulo}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        {selectedObjetivo.descripcion}
                      </p>
                    </div>
                    <Button
                      onClick={() => onShowAssignModal(selectedObjetivo)}
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Asignar ejercicio
                    </Button>
                  </div>

                  {/* Progreso del objetivo */}
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">
                      Progreso del objetivo
                    </h3>
                    <ProgressBar
                      value={selectedObjetivo.progreso || 0}
                      variant="auto"
                      size="lg"
                      label={`${selectedObjetivo.progreso || 0}% completado`}
                    />
                  </div>

                  {/* Lista de ejercicios */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Ejercicios asignados
                    </h3>
                    
                    {ejerciciosError && (
                      <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-700">{ejerciciosError}</p>
                      </div>
                    )}

                    {loadingEjercicios ? (
                      <div className="flex justify-center py-8">
                        <LoadingSpinner size="sm" />
                      </div>
                    ) : (
                      <EjerciciosList
                        ejercicios={ejercicios}
                        onDelete={onDeleteEjercicio}
                        isPsychologist={true}
                      />
                    )}
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="p-6 text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    Selecciona un objetivo
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Elige un objetivo de la lista para ver los detalles y ejercicios asignados.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Modales */}
        <CreateObjetivoModal
          isOpen={showCreateModal}
          onClose={onCloseCreateModal}
          onSubmit={onCreateObjetivo}
        />

        <AssignEjercicioModal
          isOpen={showAssignModal}
          onClose={onCloseAssignModal}
          onSubmit={onAsignarEjercicio}
          objetivo={assignModalObjetivo}
        />
      </div>
    </div>
  );
};

export default ObjetivosPacientePresenter;
