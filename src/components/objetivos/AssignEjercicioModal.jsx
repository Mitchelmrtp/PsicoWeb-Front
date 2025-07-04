/**
 * Modal para asignar ejercicios a un objetivo
 * Permite crear y asignar nuevos ejercicios
 */
import React, { useState } from 'react';
import { Modal, Button, Input } from '../ui';

const AssignEjercicioModal = ({ isOpen, onClose, onSubmit, objetivo }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    instrucciones: '',
    fechaLimite: '',
    tipo: 'tarea'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    } else if (formData.titulo.length < 3) {
      newErrors.titulo = 'El título debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.length < 5) {
      newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres';
    }

    if (!formData.instrucciones.trim()) {
      newErrors.instrucciones = 'Las instrucciones son requeridas';
    } else if (formData.instrucciones.length < 10) {
      newErrors.instrucciones = 'Las instrucciones deben tener al menos 10 caracteres';
    }

    if (formData.fechaLimite) {
      const fechaLimite = new Date(formData.fechaLimite);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fechaLimite < hoy) {
        newErrors.fechaLimite = 'La fecha límite no puede ser anterior a hoy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit({
        ...formData
      });
      
      // Resetear formulario
      setFormData({
        titulo: '',
        descripcion: '',
        instrucciones: '',
        fechaLimite: '',
        tipo: 'tarea'
      });
      setErrors({});
    } catch (error) {
      console.error('Error asignando ejercicio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        titulo: '',
        descripcion: '',
        instrucciones: '',
        fechaLimite: '',
        tipo: 'tarea'
      });
      setErrors({});
      onClose();
    }
  };

  const tiposEjercicio = [
    { value: 'tarea', label: 'Tarea' },
    { value: 'reflexion', label: 'Reflexión' },
    { value: 'actividad', label: 'Actividad' },
    { value: 'cuestionario', label: 'Cuestionario' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleSubmit}
      title={`Asignar Ejercicio: ${objetivo?.titulo || ''}`}
      confirmText="Asignar Ejercicio"
      isLoading={isLoading}
      size="lg"
    >
      <div className="space-y-4">
        {/* Información del objetivo */}
        {objetivo && (
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              Objetivo: {objetivo.titulo}
            </h4>
            <p className="text-sm text-gray-600">
              {objetivo.descripcion}
            </p>
          </div>
        )}

        {/* Tipo de ejercicio */}
        <div>
          <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de ejercicio
          </label>
          <select
            id="tipo"
            value={formData.tipo}
            onChange={(e) => handleChange('tipo', e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isLoading}
          >
            {tiposEjercicio.map(tipo => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título del ejercicio *
          </label>
          <Input
            id="titulo"
            type="text"
            value={formData.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
            placeholder="Ej: Registro diario de emociones"
            error={errors.titulo}
            disabled={isLoading}
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del ejercicio *
          </label>
          <Input
            id="descripcion"
            type="text"
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Ej: Anotar las emociones experimentadas durante el día"
            error={errors.descripcion}
            disabled={isLoading}
          />
        </div>

        {/* Instrucciones */}
        <div>
          <label htmlFor="instrucciones" className="block text-sm font-medium text-gray-700 mb-1">
            Instrucciones detalladas *
          </label>
          <textarea
            id="instrucciones"
            rows={5}
            value={formData.instrucciones}
            onChange={(e) => handleChange('instrucciones', e.target.value)}
            placeholder="Proporciona instrucciones claras y específicas sobre cómo realizar el ejercicio..."
            className={`block w-full rounded-md border ${
              errors.instrucciones ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500`}
            disabled={isLoading}
          />
          {errors.instrucciones && (
            <p className="mt-1 text-sm text-red-600">{errors.instrucciones}</p>
          )}
        </div>

        {/* Fecha límite */}
        <div>
          <label htmlFor="fechaLimite" className="block text-sm font-medium text-gray-700 mb-1">
            Fecha límite (opcional)
          </label>
          <Input
            id="fechaLimite"
            type="date"
            value={formData.fechaLimite}
            onChange={(e) => handleChange('fechaLimite', e.target.value)}
            error={errors.fechaLimite}
            disabled={isLoading}
            min={new Date().toISOString().split('T')[0]}
          />
          <p className="mt-1 text-xs text-gray-500">
            Si no especificas una fecha, el ejercicio no tendrá límite de tiempo
          </p>
        </div>

        {/* Sugerencias según el tipo */}
        {formData.tipo && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex">
              <svg className="h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h5 className="text-sm font-medium text-blue-800 mb-1">
                  Sugerencias para {tiposEjercicio.find(t => t.value === formData.tipo)?.label}:
                </h5>
                <div className="text-sm text-blue-700">
                  {formData.tipo === 'tarea' && (
                    <p>Asigna actividades específicas que el paciente pueda realizar entre sesiones.</p>
                  )}
                  {formData.tipo === 'reflexion' && (
                    <p>Incluye preguntas guía para ayudar al paciente a reflexionar sobre su experiencia.</p>
                  )}
                  {formData.tipo === 'actividad' && (
                    <p>Describe actividades prácticas o ejercicios específicos que el paciente debe realizar.</p>
                  )}
                  {formData.tipo === 'cuestionario' && (
                    <p>Proporciona preguntas estructuradas para evaluar el progreso o comprensión del paciente.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AssignEjercicioModal;
