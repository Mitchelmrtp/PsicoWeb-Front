import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENDPOINTS, getAuthHeader } from '../../config/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';
import SidebarManager from '../dashboard/SidebarManager';

const PatientTestView = () => {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoadingTests(true);
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

        const responseData = await response.json();
        // Handle both array and { data: Array } response formats
        const testsData = Array.isArray(responseData) ? responseData : (responseData.data || []);
        setTests(testsData.filter(test => test.activa));
      } catch (err) {
        console.error('Error loading tests:', err);
        setError('Error al cargar las pruebas disponibles');
        toast.error('Error al cargar las pruebas');
      } finally {
        setLoadingTests(false);
      }
    };

    const fetchResults = async () => {
      try {
        setLoadingResults(true);
        // Check if user ID exists before attempting to fetch
        const patientId = user?.id || user?.userId;
        
        if (!patientId) {
          console.warn('No patient ID available, skipping results fetch');
          setLoadingResults(false);
          return;
        }
        
        const response = await fetch(`${ENDPOINTS.RESULTADOS}?pacienteId=${patientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', response.status, errorText);
          throw new Error(`Error al cargar los resultados: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Results data:', responseData);
        
        // Manejar tanto respuestas directas como envueltas
        const resultsData = Array.isArray(responseData) ? responseData : (responseData.data || []);
        
        // Ordenar resultados por fecha, más recientes primero
        const sortedResults = resultsData.sort((a, b) => 
          new Date(b.fechaRealizacion) - new Date(a.fechaRealizacion)
        );
        
        setResults(sortedResults);
      } catch (err) {
        console.error('Error loading test results:', err);
        toast.error('Error al cargar los resultados');
        setError('Error al cargar resultados de pruebas');
      } finally {
        setLoadingResults(false);
      }
    };

    fetchTests();
    fetchResults();
  }, [user?.id, user?.userId]);

  useEffect(() => {
    if (results?.length > 0) {
      console.log('Results to display:', results);
    }
  }, [results]);

  const handleTakeTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handleViewResult = (resultId) => {
    navigate(`/resultados/${resultId}`);
  };

  const handleToggleDetails = async (testId) => {
    if (selectedTest === testId) {
      setSelectedTest(null);
      setTestDetails(null);
      return;
    }

    try {
      setLoadingDetails(true);
      setSelectedTest(testId);
      
      const response = await fetch(`${ENDPOINTS.PRUEBAS}/${testId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Error fetching test details');
      }

      const data = await response.json();
      setTestDetails(data);
    } catch (err) {
      console.error('Error loading test details:', err);
      toast.error('Error al cargar los detalles de la prueba');
      setTestDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarManager />
      
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Pruebas Psicológicas</h1>
          <p className="text-gray-500">Realiza pruebas y consulta tus resultados previos</p>
        </header>
        
        <main className="p-6">
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pruebas Disponibles</h2>
            
            {loadingTests ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700">
                {error}. Por favor intente de nuevo más tarde.
              </div>
            ) : tests.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No hay pruebas disponibles</h4>
                <p className="text-gray-500">Tu psicólogo creará pruebas para ti próximamente</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tests.map((test) => (
                  <div key={test.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{test.titulo}</h3>
                      <p className="text-gray-600 mb-4">{test.descripcion}</p>
                      
                      <div className="flex justify-between items-center mb-4">
                        <button
                          onClick={() => handleToggleDetails(test.id)}
                          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {selectedTest === test.id ? 'Ocultar información' : 'Ver más información'}
                        </button>
                        
                        <span className="text-xs text-gray-500">
                          {results.some(r => r.idPrueba === test.id) ? 'Completada' : 'Sin completar'}
                        </span>
                      </div>
                      
                      {/* Panel de detalles expandible */}
                      {selectedTest === test.id && (
                        <div className="mt-2 mb-4">
                          {loadingDetails ? (
                            <div className="flex justify-center py-3">
                              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-500"></div>
                            </div>
                          ) : !testDetails ? (
                            <p className="text-sm text-gray-500">No se pudieron cargar los detalles.</p>
                          ) : (
                            <div className="bg-gray-50 p-3 rounded-md">
                              <h4 className="font-medium text-sm mb-2">Esta prueba contiene:</h4>
                              <p className="text-sm">{testDetails.Preguntas?.length || 0} preguntas</p>
                              <p className="text-sm text-gray-500 mt-2">
                                Se mostrarán una por una cuando inicies la prueba. Tómate tu tiempo para responder.
                              </p>
                              
                              {testDetails.Preguntas && testDetails.Preguntas.length > 0 && (
                                <div className="mt-3">
                                  <p className="text-sm font-medium">Ejemplo de pregunta:</p>
                                  <div className="bg-white p-2 rounded mt-1 text-sm border border-gray-200">
                                    {testDetails.Preguntas[0].enunciado}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {results.some(r => r.idPrueba === test.id) ? (
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-sm text-green-600 font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completada
                          </span>
                          <button
                            onClick={() => handleTakeTest(test.id)}
                            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
                          >
                            Volver a realizar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleTakeTest(test.id)}
                          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
                        >
                          Realizar prueba
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Resultados</h2>
            
            {loadingResults ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : results.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No has realizado ninguna prueba</h4>
                <p className="text-gray-500">Completa alguna de las pruebas disponibles para ver tus resultados</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Prueba
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Resultado
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {result.Prueba?.titulo || result.prueba?.titulo || "Prueba sin título"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(result.fechaRealizacion).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center">
                              <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    result.puntuacionPromedio >= 4 ? 'bg-red-500' :
                                    result.puntuacionPromedio >= 3 ? 'bg-yellow-500' :
                                    result.puntuacionPromedio >= 2 ? 'bg-blue-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${(result.puntuacionPromedio / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">
                                {result.puntuacionPromedio ? `${result.puntuacionPromedio.toFixed(1)}/5` : 'N/A'}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {result.interpretacion || 'Sin interpretación'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewResult(result.id)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Ver detalle
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default PatientTestView;