import React, { useState, useEffect, useRef } from 'react';
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
  const [dataLoaded, setDataLoaded] = useState(false);
  const fetchAttemptedRef = useRef(false);

  useEffect(() => {
    const fetchPsicologo = async (retryCount = 0, maxRetries = 2) => {
      if (!user || !user.id) {
        setError('Usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null); // Limpiar errores anteriores
        
        // Create fetch request with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8-second timeout
        
        console.log(`Intentando obtener datos del psicólogo con ID: ${user.id}`);
        
        const response = await fetch(`${ENDPOINTS.PSICOLOGOS}/${user.id}`, {
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
            throw new Error('No tienes permiso para acceder a este perfil');
          } else if (response.status === 404) {
            throw new Error('Perfil de psicólogo no encontrado');
          } else if (response.status === 503 && retryCount < maxRetries) {
            console.log(`Error de recursos, reintentando en ${(retryCount + 1) * 2} segundos... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => fetchPsicologo(retryCount + 1, maxRetries), (retryCount + 1) * 2000);
            return;
          } else {
            throw new Error(`Error al cargar los datos del psicólogo: ${response.status}`);
          }
        }

        const data = await response.json();
        console.log('Datos del psicólogo recibidos:', data);
        
        const psicologoData = data.data || data;
        if (!psicologoData || Object.keys(psicologoData).length === 0) {
          throw new Error('No se recibieron datos del psicólogo');
        }
        
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
        console.error('Error en fetchPsicologo:', err);
        
        if (err.name === 'AbortError') {
          setError('La petición ha tardado demasiado. Por favor, inténtelo de nuevo más tarde.');
        } else if ((err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) && retryCount < maxRetries) {
          console.log(`Error de red, reintentando en ${(retryCount + 1) * 2} segundos... (${retryCount + 1}/${maxRetries})`);
          setTimeout(() => fetchPsicologo(retryCount + 1, maxRetries), (retryCount + 1) * 2000);
          return;
        } else {
          setError(err.message || 'Error desconocido al cargar los datos del psicólogo');
        }
      } finally {
        setLoading(false);
      }
    };

    // Usar una referencia para asegurarnos de que solo se ejecute una vez
    // y evitar ciclos infinitos
    const userId = user?.id;
    
    if (userId && !psicologo && !error && !fetchAttemptedRef.current) {
      fetchAttemptedRef.current = true; // Marcar que ya intentamos obtener datos
      fetchPsicologo();
    } else if (!userId) {
      setLoading(false);
      setError('Usuario no autenticado');
    }
    
    // Dependencia explícita en el ID del usuario, no en todo el objeto user
    // y solo se ejecuta una vez por cambio de ID
    return () => {
      // Si el ID cambia, reiniciamos el flag para permitir un nuevo fetch
      if (userId !== user?.id) {
        fetchAttemptedRef.current = false;
      }
    };
  }, [user?.id]);

  useEffect(() => {
    if (psicologo && user && !dataLoaded) {
      // Verificamos que tenemos datos tanto del usuario como del psicólogo
      // y solo actualizamos dataLoaded una vez para evitar re-renders
      setDataLoaded(true);
      console.log('Datos completos cargados:', { user, psicologo });
    }
  }, [psicologo, user, dataLoaded]);

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
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700 mb-4"></div>
          <p>Cargando perfil de psicólogo...</p>
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
              {error.includes('no encontrado') && 'Parece que tu perfil de psicólogo no existe. ¿Quieres crearlo?'}
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