/**
 * Formulario para registrar emociones
 * Solo accesible para psicólogos
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { psychologistService } from '../../services/api';
import { registroEmocionService } from '../../services/api/registroEmocionService';

const RegistroEmocionForm = ({ 
  pacienteId,
  pacienteIdPreseleccionado,
  sesionId = null, 
  onSuccess, 
  onCancel,
  mostrarBotonesCancelar = false
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    idPaciente: pacienteId || pacienteIdPreseleccionado || '',
    idPsicologo: user?.id || '',
    idSesion: sesionId || '',
    emociones: {
      ansiedad: 5,
      tristeza: 5,
      alegria: 5,
      ira: 5,
      estres: 5,
      calma: 5
    },
    comentarios: '',
    estadoGeneral: 'regular'
  });

  const [errors, setErrors] = useState({});
  const [pacientes, setPacientes] = useState([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);

  const emocionesConfig = {
    ansiedad: { nombre: 'Ansiedad', icono: '😰' },
    tristeza: { nombre: 'Tristeza', icono: '😢' },
    alegria: { nombre: 'Alegría', icono: '😊' },
    ira: { nombre: 'Ira', icono: '😠' },
    estres: { nombre: 'Estrés', icono: '😫' },
    calma: { nombre: 'Calma', icono: '😌' }
  };

  const estadosGenerales = [
    { value: 'muy_malo', label: 'Muy Malo', icono: '😞' },
    { value: 'malo', label: 'Malo', icono: '😔' },
    { value: 'regular', label: 'Regular', icono: '😐' },
    { value: 'bueno', label: 'Bueno', icono: '🙂' },
    { value: 'muy_bueno', label: 'Muy Bueno', icono: '😊' }
  ];

  useEffect(() => {
    const pacienteSeleccionado = pacienteId || pacienteIdPreseleccionado;
    if (pacienteSeleccionado) {
      setFormData(prev => ({
        ...prev,
        idPaciente: pacienteSeleccionado,
        idPsicologo: user?.id || ''
      }));
    }
  }, [pacienteId, pacienteIdPreseleccionado, user]);

  useEffect(() => {
    const cargarPacientes = async () => {
      try {
        setLoadingPacientes(true);
        const response = await psychologistService.getMyPatients();
        const pacientesData = response.data || response;
        setPacientes(pacientesData);
      } catch (error) {
        console.error('Error al cargar pacientes:', error);
      } finally {
        setLoadingPacientes(false);
      }
    };

    cargarPacientes();
  }, []);

  const handleEmocionChange = (emocion, valor) => {
    setFormData(prev => ({
      ...prev,
      emociones: {
        ...prev.emociones,
        [emocion]: parseInt(valor)
      }
    }));
    
    // Limpiar error de esta emoción si existe
    if (errors[emocion]) {
      setErrors(prev => ({ ...prev, [emocion]: null }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo si existe
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar que hay al menos una emoción registrada
    const hasEmociones = Object.values(formData.emociones).some(val => val > 0);
    if (!hasEmociones) {
      newErrors.emociones = 'Debe registrar al menos una emoción';
    }

    // Validar intensidades
    Object.entries(formData.emociones).forEach(([emocion, intensidad]) => {
      if (intensidad < 1 || intensidad > 10) {
        newErrors[emocion] = 'La intensidad debe estar entre 1 y 10';
      }
    });

    // Validar estado general
    if (!formData.estadoGeneral) {
      newErrors.estadoGeneral = 'El estado general es requerido';
    }

    // Validar selección del paciente
    if (!formData.idPaciente) {
      newErrors.idPaciente = 'Debe seleccionar un paciente';
    }

    // Validar ID del psicólogo
    if (!formData.idPsicologo) {
      newErrors.idPsicologo = 'ID del psicólogo requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      // Sanitize data before sending
      const submitData = {
        ...formData,
        idSesion: formData.idSesion || null // Convert empty string to null
      };

      await registroEmocionService.createRegistro(submitData);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al guardar registro:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIntensidadColor = (intensidad) => {
    if (intensidad <= 3) return 'bg-green-500';
    if (intensidad <= 6) return 'bg-yellow-500';
    if (intensidad <= 8) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getIntensidadLabel = (intensidad) => {
    if (intensidad <= 2) return 'Muy Baja';
    if (intensidad <= 4) return 'Baja';
    if (intensidad <= 6) return 'Moderada';
    if (intensidad <= 8) return 'Alta';
    return 'Muy Alta';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Nuevo Registro de Emociones
        </h3>
        <p className="text-gray-600">
          Registra el estado emocional del paciente según la sesión terapéutica
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información de la Sesión */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">Información de la Sesión</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paciente
              </label>
              {loadingPacientes ? (
                <div className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100">
                  <span className="text-gray-500">Cargando pacientes...</span>
                </div>
              ) : (
                <select
                  value={formData.idPaciente}
                  onChange={(e) => handleInputChange('idPaciente', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccionar paciente</option>
                  {pacientes.map(paciente => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.first_name} {paciente.last_name} - {paciente.email}
                    </option>
                  ))}
                </select>
              )}
              {errors.idPaciente && (
                <p className="text-red-500 text-xs mt-1">{errors.idPaciente}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ID de la Sesión (Opcional)
              </label>
              <input
                type="number"
                value={formData.idSesion}
                onChange={(e) => handleInputChange('idSesion', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dejar vacío si no aplica"
              />
            </div>
          </div>
        </div>

        {/* Registro de Emociones */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">Intensidad de Emociones (1-10)</h4>
          {errors.emociones && (
            <p className="text-red-500 text-sm mb-3">{errors.emociones}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(emocionesConfig).map(([key, config]) => (
              <div key={key} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">{config.icono}</span>
                  <span className={`font-medium ${config.color}`}>
                    {config.nombre}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={formData.emociones[key]}
                    onChange={(e) => handleEmocionChange(key, e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      {formData.emociones[key]}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getIntensidadColor(formData.emociones[key])}`}>
                      {getIntensidadLabel(formData.emociones[key])}
                    </span>
                  </div>
                </div>
                
                {errors[key] && (
                  <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Estado General */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Estado General del Paciente
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {estadosGenerales.map((estado) => (
              <label
                key={estado.value}
                className={`cursor-pointer p-3 rounded-lg border-2 transition-all ${
                  formData.estadoGeneral === estado.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="estadoGeneral"
                  value={estado.value}
                  checked={formData.estadoGeneral === estado.value}
                  onChange={(e) => handleInputChange('estadoGeneral', e.target.value)}
                  className="sr-only"
                />
                <div className="text-center">
                  <div className="text-2xl mb-1">{estado.icono}</div>
                  <div className={`text-sm font-medium ${estado.color}`}>
                    {estado.label}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.estadoGeneral && (
            <p className="text-red-500 text-xs mt-1">{errors.estadoGeneral}</p>
          )}
        </div>

        {/* Comentarios */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Comentarios y Observaciones
          </label>
          <textarea
            value={formData.comentarios}
            onChange={(e) => handleInputChange('comentarios', e.target.value)}
            rows="4"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe observaciones sobre el estado emocional del paciente, contexto de la sesión, etc."
          />
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          {(mostrarBotonesCancelar || onCancel) && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Guardando...' : 'Crear Registro'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default RegistroEmocionForm;
