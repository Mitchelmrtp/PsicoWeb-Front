/**
 * Modal para crear un nuevo objetivo
 * Implementa formulario controlado con validación
 */
import React, { useState } from 'react';
import { Modal, Button, Input } from '../ui';

const CreateObjetivoModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    prioridad: 'media'
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
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
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
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        fechaLimite: formData.fechaLimite || undefined,
        prioridad: formData.prioridad
      });
      
      // Resetear formulario
      setFormData({
        titulo: '',
        descripcion: '',
        fechaLimite: '',
        prioridad: 'media'
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating objetivo:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({
        titulo: '',
        descripcion: '',
        fechaLimite: '',
        prioridad: 'media'
      });
      setErrors({});
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleSubmit}
      title="Crear Nuevo Objetivo"
      confirmText="Crear Objetivo"
      isLoading={isLoading}
      size="md"
    >
      <div className="space-y-4">
        {/* Título */}
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
            Título del objetivo *
          </label>
          <Input
            id="titulo"
            type="text"
            value={formData.titulo}
            onChange={(e) => handleChange('titulo', e.target.value)}
            placeholder="Ej: Reducir niveles de ansiedad"
            error={errors.titulo}
            disabled={isLoading}
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción *
          </label>
          <textarea
            id="descripcion"
            rows={4}
            value={formData.descripcion}
            onChange={(e) => handleChange('descripcion', e.target.value)}
            placeholder="Describe detalladamente el objetivo terapéutico..."
            className={`block w-full rounded-md border ${
              errors.descripcion ? 'border-red-300' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500`}
            disabled={isLoading}
          />
          {errors.descripcion && (
            <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
          )}
        </div>

        {/* Prioridad */}
        <div>
          <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">
            Prioridad
          </label>
          <select
            id="prioridad"
            value={formData.prioridad}
            onChange={(e) => handleChange('prioridad', e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            disabled={isLoading}
          >
            <option value="baja">Baja</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
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
        </div>

        {/* Información adicional */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <div className="flex">
            <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Una vez creado el objetivo, podrás asignar ejercicios específicos para ayudar al paciente a alcanzarlo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateObjetivoModal;
