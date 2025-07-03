import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ENDPOINTS, getAuthHeader } from '../../config/api';
import SidebarManager from '../dashboard/SidebarManager';

const PerfilPaciente = () => {
  const { user } = useAuth();
  const [paciente, setPaciente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    motivoConsulta: '',
    diagnosticoPreliminar: '',
    diagnostico: ''
  });

  useEffect(() => {
    const fetchPaciente = async () => {
      if (!user || !user.id) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${ENDPOINTS.PACIENTES}/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los datos del paciente');
        }

        const data = await response.json();
        const pacienteData = data.data || data;
        setPaciente(pacienteData);
        
        // Inicializar form data con los datos existentes
        setFormData({
          motivoConsulta: pacienteData.motivoConsulta || '',
          diagnosticoPreliminar: pacienteData.diagnosticoPreliminar || '',
          diagnostico: pacienteData.diagnostico || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPaciente();
  }, [user]);

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
        <p>Cargando perfil...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen">
      <SidebarManager />
      <div className="flex-1 flex items-center justify-center">
        <p className="text-red-600">Error: {error}</p>
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
