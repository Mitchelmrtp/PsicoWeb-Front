import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS, getAuthHeader } from '../../config/api';
import { toast } from 'react-toastify';
import SidebarManager from '../dashboard/SidebarManager';

const TestManagement = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testQuestions, setTestQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);
        const response = await fetch(ENDPOINTS.PRUEBAS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching tests');
        }

        const data = await response.json();
        setTests(data);
      } catch (err) {
        console.error('Error loading tests:', err);
        setError(err.message);
        toast.error('Error al cargar las pruebas');
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  const handleCreateTest = () => {
    navigate('/CrearPruebas');
  };

  const handleEditTest = (testId) => {
    navigate(`/EditarPrueba/${testId}`);
  };

  const handleViewResults = (testId) => {
    navigate(`/resultados-prueba/${testId}`);
  };

  const handleViewDetails = async (testId) => {
    if (selectedTest === testId) {
      // Si ya está seleccionado, cerramos el detalle
      setSelectedTest(null);
      setTestQuestions([]);
      return;
    }

    try {
      setLoadingQuestions(true);
      setSelectedTest(testId);
      
      const response = await fetch(`${ENDPOINTS.PRUEBAS}/${testId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      // Obtener el texto de la respuesta antes de intentar parsear como JSON
      const responseText = await response.text();
      let data;
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        console.error('Raw response:', responseText);
        throw new Error(`Error parsing server response: ${parseError.message}`);
      }

      if (!response.ok) {
        console.error('Server returned error:', data);
        throw new Error(data.message || 'Error fetching test details');
      }

      console.log('Test details received:', data);
      
      // Verificar si existe la propiedad Preguntas
      if (data.Preguntas) {
        if (!Array.isArray(data.Preguntas)) {
          console.error('Preguntas is not an array:', data.Preguntas);
          data.Preguntas = [];
        }
        
        const processedQuestions = data.Preguntas.map(question => {
          let opciones = question.opciones;
          if (typeof opciones === 'string') {
            try {
              opciones = JSON.parse(opciones);
            } catch (e) {
              console.error('Error parsing options:', e);
              opciones = [];
            }
          } else if (!Array.isArray(opciones)) {
            opciones = [];
          }
          
          return {
            ...question,
            opciones
          };
        });
        
        setTestQuestions(processedQuestions);
      } else {
        console.warn('No questions property found in response:', data);
        setTestQuestions([]);
      }
    } catch (err) {
      console.error('Error loading test details:', err);
      toast.error(`Error al cargar detalles de la prueba: ${err.message}`);
      setTestQuestions([]);
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleToggleActive = async (testId, currentStatus) => {
    try {
      const response = await fetch(`${ENDPOINTS.PRUEBAS}/${testId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ activa: !currentStatus }),
      });

      if (!response.ok) {
        throw new Error('Error updating test status');
      }

      setTests(tests.map(test => 
        test.id === testId ? { ...test, activa: !currentStatus } : test
      ));

      toast.success(`Prueba ${!currentStatus ? 'activada' : 'desactivada'} correctamente`);
    } catch (err) {
      console.error('Error toggling test status:', err);
      toast.error('Error al cambiar el estado de la prueba');
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarManager />
      
      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Pruebas Psicológicas</h2>
          <button
            onClick={handleCreateTest}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Crear Nueva Prueba
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700">
            {error}. Por favor intente de nuevo.
          </div>
        ) : tests.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h4 className="text-lg font-medium text-gray-700 mb-2">No hay pruebas disponibles</h4>
            <p className="text-gray-500 mb-4">Crea tu primera prueba psicológica</p>
          </div>
        ) : (
          <div className="space-y-6">
            {tests.map((test) => (
              <div key={test.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{test.titulo}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${test.activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {test.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{test.descripcion}</p>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center">
                      <button
                        onClick={() => handleViewDetails(test.id)}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center text-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {selectedTest === test.id ? 'Ocultar preguntas' : 'Ver preguntas'}
                      </button>
                      <span className="ml-4 text-sm text-gray-500">
                        Creada: {new Date(test.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleToggleActive(test.id, test.activa)}
                        className={`p-2 rounded-md ${test.activa ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}
                        title={test.activa ? 'Desactivar prueba' : 'Activar prueba'}
                      >
                        {test.activa ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </button>
                      
                      <button
                        onClick={() => handleEditTest(test.id)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-md"
                        title="Editar prueba"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleViewResults(test.id)}
                        className="p-2 bg-purple-50 text-purple-600 rounded-md"
                        title="Ver resultados"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Panel de preguntas expandible */}
                {selectedTest === test.id && (
                  <div className="bg-gray-50 p-4 border-t">
                    <h4 className="font-medium mb-3">Preguntas del test</h4>
                    
                    {loadingQuestions ? (
                      <p>Cargando preguntas...</p>
                    ) : testQuestions.length === 0 ? (
                      <p>No hay preguntas para este test</p>
                    ) : (
                      <div className="mt-4">
                        <h4 className="text-lg font-medium mb-2">Preguntas del test:</h4>
                        <ul className="list-disc pl-5 space-y-2">
                          {testQuestions.map((question) => (
                            <li key={question.id} className="flex justify-between items-center">
                              <span>{question.enunciado}</span>
                              <div>
                                <span className="ml-2 text-sm text-gray-500">
                                  {Array.isArray(question.opciones) && question.opciones.length > 0 
                                    ? `${question.opciones.length} opciones` 
                                    : "Sin opciones"}
                                </span>
                                <button 
                                  onClick={() => navigate(`/tests/${selectedTest}/preguntas/${question.id}/opciones`)}
                                  className="ml-2 px-2 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
                                >
                                  Editar opciones
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestManagement;