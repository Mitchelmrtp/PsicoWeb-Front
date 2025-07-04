/**
 * Presenter para la página "Mis Objetivos" (Paciente)
 * Componente de presentación pura - solo recibe props y renderiza UI
 */
import React from 'react';
import { Card, Button, LoadingSpinner, ProgressBar, ProgressCircle } from '../ui';
import ObjetivoCard from './ObjetivoCard';
import EjerciciosList from './EjerciciosList';

const MisObjetivosPresenter = ({
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
  onSelectObjetivo,
  onBackToList,
  onToggleEjercicio,
  onChangeViewMode,
  
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

  // Vista de detalle de objetivo
  if (selectedObjetivo) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {/* Header con botón de regreso */}
          <div className="mb-6">
            <button
              onClick={onBackToList}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors mb-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a mis objetivos
            </button>
            
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {selectedObjetivo.titulo}
              </h1>
              <p className="mt-2 text-gray-600">
                {selectedObjetivo.descripcion}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información del objetivo */}
            <div className="lg:col-span-1">
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Información del objetivo
                  </h2>
                  
                  {/* Progreso */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Progreso</span>
                      <span className="text-sm text-gray-500">{selectedObjetivo.progreso || 0}%</span>
                    </div>
                    <ProgressBar
                      value={selectedObjetivo.progreso || 0}
                      variant="auto"
                      size="lg"
                    />
                  </div>

                  {/* Fechas */}
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Fecha de creación:</span>
                      <p className="text-gray-600 mt-1">
                        {new Date(selectedObjetivo.fechaCreacion).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {selectedObjetivo.fechaLimite && (
                      <div>
                        <span className="font-medium text-gray-700">Fecha límite:</span>
                        <p className="text-gray-600 mt-1">
                          {new Date(selectedObjetivo.fechaLimite).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <span className="font-medium text-gray-700">Prioridad:</span>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        selectedObjetivo.prioridad === 'alta' ? 'bg-red-100 text-red-800' :
                        selectedObjetivo.prioridad === 'media' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {selectedObjetivo.prioridad?.charAt(0).toUpperCase() + selectedObjetivo.prioridad?.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Lista de ejercicios */}
            <div className="lg:col-span-2">
              <Card>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Ejercicios asignados
                  </h2>
                  
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
                      onToggleComplete={onToggleEjercicio}
                      isPsychologist={false}
                    />
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista principal de la lista de objetivos
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Objetivos
              </h1>
              <p className="mt-2 text-gray-600">
                Revisa tu progreso y completa los ejercicios asignados
              </p>
            </div>
            
            {/* Controles de vista */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChangeViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Vista en grilla"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => onChangeViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                title="Vista en lista"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <div className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <ProgressCircle
                  value={estadisticas.progresoPromedio}
                  size={60}
                  variant="auto"
                  showLabel={true}
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Progreso General</h3>
              <p className="text-sm text-gray-600">Promedio de todos los objetivos</p>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {estadisticas.total}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Total</h3>
              <p className="text-sm text-gray-600">Objetivos asignados</p>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {estadisticas.activos}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Activos</h3>
              <p className="text-sm text-gray-600">En progreso</p>
            </div>
          </Card>

          <Card>
            <div className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {estadisticas.completados}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Completados</h3>
              <p className="text-sm text-gray-600">100% logrados</p>
            </div>
          </Card>
        </div>

        {/* Lista de objetivos */}
        {objetivos.length === 0 ? (
          <Card>
            <div className="p-6 text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No tienes objetivos asignados
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Tu psicólogo aún no ha creado objetivos para ti. Los objetivos aparecerán aquí cuando sean asignados.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Objetivos activos */}
            {objetivosActivos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  Objetivos Activos
                </h2>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {objetivosActivos.map((objetivo) => (
                    <ObjetivoCard
                      key={objetivo.id}
                      objetivo={objetivo}
                      onClick={() => onSelectObjetivo(objetivo)}
                      isPaciente={true}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Objetivos completados */}
            {objetivosCompletados.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  Objetivos Completados
                </h2>
                <div className={`grid gap-4 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {objetivosCompletados.map((objetivo) => (
                    <ObjetivoCard
                      key={objetivo.id}
                      objetivo={objetivo}
                      onClick={() => onSelectObjetivo(objetivo)}
                      isPaciente={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MisObjetivosPresenter;
