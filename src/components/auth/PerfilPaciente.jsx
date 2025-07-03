import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ENDPOINTS, getAuthHeader } from '../../config/api';
import SidebarManager from '../dashboard/SidebarManager';
import { useParams } from 'react-router-dom';

const PerfilPaciente = () => {
  const { user } = useAuth();
  const { id } = useParams(); // Obtenemos el ID de la URL si existe
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    motivoConsulta: '',
    diagnosticoPreliminar: '',
    diagnostico: ''
  });
  const fetchAttemptedRef = useRef(false);

  useEffect(() => {
    const fetchPaciente = async (retryCount = 0, maxRetries = 2) => {
      // Si tenemos un ID en la URL, usamos ese, de lo contrario usamos el ID del usuario actual
      const pacienteId = id || (user?.id);
      
      if (!pacienteId) {
        setError('ID de paciente no encontrado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null); // Limpiar errores anteriores
        
        // Create fetch request with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout
        
        console.log(`Intentando obtener datos del paciente con ID: ${pacienteId}`);
        
        const response = await fetch(`${ENDPOINTS.PACIENTES}/${pacienteId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          if (response.status === 403) {
            setError('No tienes permiso para acceder a este perfil de paciente');
            console.error('Error 403: Acceso denegado al perfil de paciente');
            setLoading(false);
            return;
          } else if (response.status === 404) {
            setError('Paciente no encontrado');
            console.error('Error 404: Paciente no encontrado');
            setLoading(false);
            return;
          } else if (response.status === 503) {
            // Server resource constraint error - retry after a delay if we haven't reached max retries
            if (retryCount < maxRetries) {
              console.log(`Error de recursos, reintentando en ${(retryCount + 1) * 2} segundos... (${retryCount + 1}/${maxRetries})`);
              setTimeout(() => fetchPaciente(retryCount + 1, maxRetries), (retryCount + 1) * 2000);
              return;
            }
          }
          throw new Error(`Error al cargar los datos del paciente: ${response.status}`);
        }

        const data = await response.json();
        console.log('Datos del paciente recibidos:', data);
        
        const pacienteData = data.data || data;
        if (!pacienteData || Object.keys(pacienteData).length === 0) {
          throw new Error('No se recibieron datos del paciente');
        }
        
        setPaciente(pacienteData);
        
        // Inicializar form data con los datos existentes
        setFormData({
          motivoConsulta: pacienteData.motivoConsulta || '',
          diagnosticoPreliminar: pacienteData.diagnosticoPreliminar || '',
          diagnostico: pacienteData.diagnostico || ''
        });
      } catch (err) {
        console.error('Error en fetchPaciente:', err);
        
        // Handle abort errors (timeout)
        if (err.name === 'AbortError') {
          setError('La petición ha tardado demasiado. Por favor, inténtelo de nuevo más tarde.');
        }
        // Handle network errors with retry
        else if ((err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) && retryCount < maxRetries) {
          console.log(`Error de red, reintentando en ${(retryCount + 1) * 2} segundos... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => fetchPaciente(retryCount + 1, maxRetries), (retryCount + 1) * 2000);
          return;
        } 
        else {
          setError(err.message || 'Error desconocido al cargar los datos del paciente');
        }
      } finally {
        setLoading(false);
      }
    };

    // Usamos pacienteId para evitar re-ejecutar el efecto innecesariamente
    const pacienteId = id || user?.id;
    
    if (pacienteId && !paciente && !error && !fetchAttemptedRef.current) {
      fetchAttemptedRef.current = true; // Marcar que ya intentamos obtener datos
      fetchPaciente();
    } else if (!pacienteId) {
      setLoading(false);
      setError('ID de paciente no encontrado');
    }
    
    // Solo depende del ID, no del objeto usuario completo
    // y reinicia el flag si el ID cambia
    return () => {
      if ((id && id !== id) || (!id && user?.id !== pacienteId)) {
        fetchAttemptedRef.current = false;
      }
    };
  }, [id, user?.id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`${ENDPOINTS.PACIENTES}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const updatedData = await response.json();
      setPaciente(updatedData.data || updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No disponible';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return (
    <div className="flex h-screen">
      <SidebarManager />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-4"></div>
          <p>Cargando perfil de paciente...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen">
      <SidebarManager />
      <div className="flex-1 flex items-center justify-center flex-col p-6">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="space-y-4 mt-6">
            <p className="text-gray-600">
              {error.includes('no encontrado') && 'Parece que el perfil de paciente no existe. Si eres paciente, puedes crear tu perfil.'}
              {error.includes('permiso') && 'No tienes permiso para acceder a este perfil. Verifica tu inicio de sesión.'}
              {error.includes('timed out') && 'El servidor tardó demasiado en responder. Por favor, intenta de nuevo más tarde.'}
              {error.includes('network') && 'Hay problemas de conexión. Verifica tu conexión a internet.'}
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
              >
                Reintentar
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen">
      <SidebarManager />
      
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isEditing ? 'Cancelar' : 'Editar Perfil'}
            </button>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Información Personal
                </h3>
              </div>
              
              <div className="px-6 py-4 space-y-6">
                {/* Información del Usuario */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.name || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.email || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <p className="mt-1 text-sm text-gray-900">{user?.telephone || 'No disponible'}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Registro</label>
                    <p className="mt-1 text-sm text-gray-900">{formatDate(paciente?.fechaRegistro)}</p>
                  </div>
                </div>

                {/* Información Clínica */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información Clínica</h4>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Motivo de Consulta</label>
                      {isEditing ? (
                        <textarea
                          name="motivoConsulta"
                          value={formData.motivoConsulta}
                          onChange={handleInputChange}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Describe el motivo por el cual buscas ayuda psicológica..."
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                          {paciente?.motivoConsulta || 'No especificado'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Diagnóstico Preliminar</label>
                      {isEditing ? (
                        <textarea
                          name="diagnosticoPreliminar"
                          value={formData.diagnosticoPreliminar}
                          onChange={handleInputChange}
                          rows={3}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Diagnóstico preliminar (solo si está disponible)..."
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                          {paciente?.diagnosticoPreliminar || 'No disponible'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Diagnóstico</label>
                      <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md">
                        {paciente?.diagnostico || 'No disponible (será establecido por su psicólogo)'}
                      </p>
                      <p className="mt-1 text-xs text-gray-500">
                        * El diagnóstico solo puede ser establecido por un profesional de la salud mental
                      </p>
                    </div>
                  </div>
                </div>

                {/* Información del Psicólogo Asignado */}
                {paciente?.idPsicologo && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Psicólogo Asignado</h4>
                    <div className="bg-indigo-50 p-4 rounded-md">
                      <p className="text-sm text-indigo-900">
                        Tienes un psicólogo asignado para tu tratamiento.
                      </p>
                      <p className="text-xs text-indigo-700 mt-1">
                        ID del Psicólogo: {paciente.idPsicologo}
                      </p>
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div className="border-t border-gray-200 pt-6">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSave}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PerfilPaciente;
