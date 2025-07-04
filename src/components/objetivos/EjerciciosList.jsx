/**
 * Componente para mostrar lista de ejercicios
 * Reutilizable para psicólogos y pacientes
 */
import React from 'react';
import { Button } from '../ui';

const EjerciciosList = ({ 
  ejercicios, 
  onDelete, 
  onToggleComplete,
  isPsychologist = false,
  showActions = true 
}) => {
  const getTipoIcon = (tipo) => {
    const icons = {
      tarea: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      reflexion: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      practica: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      lectura: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      ejercicio: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      meditacion: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      escritura: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      )
    };
    return icons[tipo] || icons.tarea;
  };

  const getTipoLabel = (tipo) => {
    const labels = {
      tarea: 'Tarea',
      reflexion: 'Reflexión',
      practica: 'Práctica',
      lectura: 'Lectura',
      ejercicio: 'Ejercicio físico',
      meditacion: 'Meditación',
      escritura: 'Escritura terapéutica'
    };
    return labels[tipo] || 'Tarea';
  };

  const getEstadoClasses = (completado, fechaLimite) => {
    if (completado) {
      return 'bg-green-50 border-green-200';
    }
    
    if (fechaLimite) {
      const limite = new Date(fechaLimite);
      const hoy = new Date();
      
      if (limite < hoy) {
        return 'bg-red-50 border-red-200';
      } else if (limite.getTime() - hoy.getTime() < 24 * 60 * 60 * 1000) {
        return 'bg-yellow-50 border-yellow-200';
      }
    }
    
    return 'bg-white border-gray-200';
  };

  if (!ejercicios || ejercicios.length === 0) {
    return (
      <div className="text-center py-8">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No hay ejercicios asignados
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {isPsychologist 
            ? 'Comienza asignando el primer ejercicio para este objetivo.'
            : 'Tu psicólogo aún no ha asignado ejercicios para este objetivo.'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ejercicios.map((ejercicio) => (
        <div
          key={ejercicio.id}
          className={`border rounded-lg p-4 transition-all duration-200 ${getEstadoClasses(ejercicio.completado, ejercicio.fechaLimite)}`}
        >
          {/* Header del ejercicio */}
          <div className="flex items-start gap-3">
            {/* Checkbox para completar (solo pacientes) */}
            {!isPsychologist && onToggleComplete && (
              <button
                onClick={() => onToggleComplete(ejercicio.id, !ejercicio.completado)}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  ejercicio.completado
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-400'
                }`}
              >
                {ejercicio.completado && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            )}

            {/* Icono del tipo */}
            <div className={`mt-1 p-1 rounded ${
              ejercicio.completado ? 'text-green-600' : 'text-gray-600'
            }`}>
              {getTipoIcon(ejercicio.tipo)}
            </div>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Tipo y descripción */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      {getTipoLabel(ejercicio.tipo)}
                    </span>
                    {ejercicio.completado && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completado
                      </span>
                    )}
                  </div>
                  
                  <h4 className={`text-sm font-medium ${
                    ejercicio.completado ? 'text-gray-500 line-through' : 'text-gray-900'
                  }`}>
                    {ejercicio.descripcion}
                  </h4>
                </div>

                {/* Acciones */}
                {showActions && isPsychologist && onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que quieres eliminar este ejercicio?')) {
                        onDelete(ejercicio.id);
                      }
                    }}
                    className="text-gray-400 hover:text-red-500 transition-colors ml-2"
                    title="Eliminar ejercicio"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Instrucciones */}
              <p className={`text-sm mt-2 ${
                ejercicio.completado ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {ejercicio.instrucciones}
              </p>

              {/* Fechas */}
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                {ejercicio.fechaAsignacion && (
                  <span>
                    Asignado: {new Date(ejercicio.fechaAsignacion).toLocaleDateString()}
                  </span>
                )}
                
                {ejercicio.fechaLimite && (
                  <span className={
                    new Date(ejercicio.fechaLimite) < new Date() && !ejercicio.completado
                      ? 'text-red-600 font-medium'
                      : ''
                  }>
                    Límite: {new Date(ejercicio.fechaLimite).toLocaleDateString()}
                  </span>
                )}
                
                {ejercicio.fechaCompletado && (
                  <span className="text-green-600">
                    Completado: {new Date(ejercicio.fechaCompletado).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EjerciciosList;
