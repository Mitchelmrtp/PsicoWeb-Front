/**
 * Presenter component para PatientTestView
 * Implementa Container/Presenter pattern - solo lógica de presentación
 */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SidebarManager from '../dashboard/SidebarManager';
import LoadingSpinner from '../ui/LoadingSpinner';

const PatientTestViewPresenter = ({
  tests,
  results,
  loadingTests,
  loadingResults,
  testsError,
  resultsError,
  onTakeTest,
  onViewResult,
  onToggleDetails,
}) => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [testDetails, setTestDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleToggleDetails = (testId) => {
    onToggleDetails(testId, selectedTest, setSelectedTest, setTestDetails, setLoadingDetails);
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
          {/* Sección de Pruebas Disponibles */}
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Pruebas Disponibles</h2>
            
            {loadingTests ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
              </div>
            ) : testsError ? (
              <div className="bg-red-50 p-4 rounded-lg text-red-700">
                {testsError}. Por favor intente de nuevo más tarde.
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
                  <TestCard
                    key={test.id}
                    test={test}
                    results={results}
                    selectedTest={selectedTest}
                    testDetails={testDetails}
                    loadingDetails={loadingDetails}
                    onTakeTest={onTakeTest}
                    onToggleDetails={handleToggleDetails}
                  />
                ))}
              </div>
            )}
          </section>
          
          {/* Sección de Mis Resultados */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Resultados</h2>
            
            {loadingResults ? (
              <div className="flex justify-center items-center h-40">
                <LoadingSpinner />
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
              <ResultsTable results={results} onViewResult={onViewResult} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

// Componente para cada tarjeta de prueba
const TestCard = ({
  test,
  results,
  selectedTest,
  testDetails,
  loadingDetails,
  onTakeTest,
  onToggleDetails,
}) => {
  const isCompleted = results.some(r => r.idPrueba === test.id);
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-800 mb-2">{test.titulo}</h3>
        <p className="text-gray-600 mb-4">{test.descripcion}</p>
        
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => onToggleDetails(test.id)}
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {selectedTest === test.id ? 'Ocultar información' : 'Ver más información'}
          </button>
          
          <span className="text-xs text-gray-500">
            {isCompleted ? 'Completada' : 'Sin completar'}
          </span>
        </div>
        
        {/* Panel de detalles expandible */}
        {selectedTest === test.id && (
          <div className="mt-2 mb-4">
            {loadingDetails ? (
              <div className="flex justify-center py-3">
                <LoadingSpinner size="small" />
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
        
        {isCompleted ? (
          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-green-600 font-medium flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Completada
            </span>
            <button
              onClick={() => onTakeTest(test.id)}
              className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition-colors text-sm"
            >
              Volver a realizar
            </button>
          </div>
        ) : (
          <button
            onClick={() => onTakeTest(test.id)}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Realizar prueba
          </button>
        )}
      </div>
    </div>
  );
};

// Componente para la tabla de resultados
const ResultsTable = ({ results, onViewResult }) => (
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
                onClick={() => onViewResult(result.id)}
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
);

// PropTypes
PatientTestViewPresenter.propTypes = {
  tests: PropTypes.array.isRequired,
  results: PropTypes.array.isRequired,
  loadingTests: PropTypes.bool.isRequired,
  loadingResults: PropTypes.bool.isRequired,
  testsError: PropTypes.string,
  resultsError: PropTypes.string,
  onTakeTest: PropTypes.func.isRequired,
  onViewResult: PropTypes.func.isRequired,
  onToggleDetails: PropTypes.func.isRequired,
};

TestCard.propTypes = {
  test: PropTypes.object.isRequired,
  results: PropTypes.array.isRequired,
  selectedTest: PropTypes.string,
  testDetails: PropTypes.object,
  loadingDetails: PropTypes.bool.isRequired,
  onTakeTest: PropTypes.func.isRequired,
  onToggleDetails: PropTypes.func.isRequired,
};

ResultsTable.propTypes = {
  results: PropTypes.array.isRequired,
  onViewResult: PropTypes.func.isRequired,
};

export default PatientTestViewPresenter;
