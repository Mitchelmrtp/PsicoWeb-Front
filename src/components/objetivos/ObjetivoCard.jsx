/**
 * Componente Card para mostrar un objetivo individual
 * Implementa principio de responsabilidad única
 */
import React, { useState } from 'react';
import { ProgressCircle } from '../ui/ProgressBar';
import { Button } from '../ui';

const ObjetivoCard = ({ 
  objetivo, 
  isSelected, 
  onClick, 
  onDelete, 
  onUpdateProgreso,
  isPaciente = false 
}) => {
  const [showProgressInput, setShowProgressInput] = useState(false);
  const [progressValue, setProgressValue] = useState(objetivo.progreso || 0);

  const handleUpdateProgress = () => {
    onUpdateProgreso(progressValue);
    setShowProgressInput(false);
  };

  const getEstadoColor = (progreso) => {
    if (progreso >= 100) return 'text-green-600 bg-green-100';
    if (progreso >= 50) return 'text-blue-600 bg-blue-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getEstadoTexto = (progreso) => {
    if (progreso >= 100) return 'Completado';
    if (progreso >= 50) return 'En progreso';
    return 'Iniciado';
  };

  return (
    <div 
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? 'border-blue-500 bg-blue-50 shadow-md' 
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {objetivo.titulo}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {objetivo.descripcion}
          </p>
        </div>
        
        <div className="ml-3 flex items-center gap-2">
          <ProgressCircle
            value={objetivo.progreso || 0}
            size={40}
            strokeWidth={3}
            variant="auto"
            showLabel={false}
          />
          
          {!isPaciente && (
            <div className="flex flex-col gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProgressInput(!showProgressInput);
                }}
                className="text-gray-400 hover:text-blue-500 transition-colors"
                title="Actualizar progreso"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('¿Estás seguro de que quieres eliminar este objetivo?')) {
                    onDelete();
                  }
                }}
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Eliminar objetivo"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Estado y fechas */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          getEstadoColor(objetivo.progreso || 0)
        }`}>
          {getEstadoTexto(objetivo.progreso || 0)}
        </span>
        
        <div className="text-xs text-gray-500">
          {objetivo.fechaLimite && (
            <span>
              Límite: {new Date(objetivo.fechaLimite).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Input para actualizar progreso */}
      {showProgressInput && !isPaciente && (
        <div className="mt-3 pt-3 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={progressValue}
              onChange={(e) => setProgressValue(parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium text-gray-700 w-12">
              {progressValue}%
            </span>
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <Button
              size="xs"
              variant="secondary"
              onClick={() => setShowProgressInput(false)}
            >
              Cancelar
            </Button>
            <Button
              size="xs"
              onClick={handleUpdateProgress}
            >
              Guardar
            </Button>
          </div>
        </div>
      )}

      {/* Información adicional para pacientes */}
      {isPaciente && objetivo.ejercicios && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span>
              {objetivo.ejercicios.filter(e => e.completado).length} de {objetivo.ejercicios.length} ejercicios completados
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjetivoCard;
