import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ENDPOINTS, getAuthHeader } from '../../config/api';
import SidebarManager from '../dashboard/SidebarManager';

const PerfilPsicologo = () => {
  const { user } = useAuth();
  const [psicologo, setPsicologo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    especialidad: '',
    licencia: '',
    formacion: '',
    biografia: '',
    anosExperiencia: '',
    tarifaPorSesion: ''
  });

  useEffect(() => {
    const fetchPsicologo = async () => {
      if (!user || !user.id) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`${ENDPOINTS.PSICOLOGOS}/${user.id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los datos del psicólogo');
        }

        const data = await response.json();
        const psicologoData = data.data || data;
        setPsicologo(psicologoData);
        
        // Inicializar form data con los datos existentes
        setFormData({
          especialidad: psicologoData.especialidad || '',
          licencia: psicologoData.licencia || '',
          formacion: psicologoData.formacion || '',
          biografia: psicologoData.biografia || '',
          anosExperiencia: psicologoData.anosExperiencia || '',
          tarifaPorSesion: psicologoData.tarifaPorSesion || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPsicologo();
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
      const response = await fetch(`${ENDPOINTS.PSICOLOGOS}/profile`, {
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
      setPsicologo(updatedData.data || updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
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
            <h1 className="text-2xl font-bold text-gray-900">Mi Perfil Profesional</h1>
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
                </div>

                {/* Información Profesional */}
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Información Profesional</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Especialidad</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="especialidad"
                          value={formData.especialidad}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{psicologo?.especialidad || 'No especificada'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Licencia</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="licencia"
                          value={formData.licencia}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{psicologo?.licencia || 'No especificada'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Formación</label>
                      {isEditing ? (
                        <input
                          type="text"
                          name="formacion"
                          value={formData.formacion}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{psicologo?.formacion || 'No especificada'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Años de Experiencia</label>
                      {isEditing ? (
                        <input
                          type="number"
                          name="anosExperiencia"
                          value={formData.anosExperiencia}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">{psicologo?.anosExperiencia || 'No especificado'}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tarifa por Sesión ($)</label>
                      {isEditing ? (
                        <input
                          type="number"
                          step="0.01"
                          name="tarifaPorSesion"
                          value={formData.tarifaPorSesion}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">${psicologo?.tarifaPorSesion || 'No especificada'}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700">Biografía</label>
                    {isEditing ? (
                      <textarea
                        name="biografia"
                        value={formData.biografia}
                        onChange={handleInputChange}
                        rows={4}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Describe tu experiencia y enfoque profesional..."
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{psicologo?.biografia || 'No hay biografía disponible'}</p>
                    )}
                  </div>
                </div>

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

export default PerfilPsicologo;