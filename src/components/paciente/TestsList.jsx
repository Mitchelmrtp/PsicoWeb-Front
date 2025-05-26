import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAuthHeader } from '../../utils/authUtils';
import { LIKERT_OPTIONS } from '../../constants/likertScale';

const TestsList = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loadingTests, setLoadingTests] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoadingTests(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pruebas`, {
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
        setTests(data.filter(test => test.activa));
      } catch (err) {
        console.error('Error loading tests:', err);
        setError('Error al cargar las pruebas');
      } finally {
        setLoadingTests(false);
      }
    };

    fetchTests();
  }, []);

  const handlePreview = async (testId) => {
    if (selectedTest === testId) {
      setSelectedTest(null);
      return;
    }
    
    try {
      setSelectedTest(testId);
      // Podemos precargar la prueba aquí si lo necesitas
    } catch (err) {
      console.error('Error loading test preview:', err);
    }
  };

  if (loadingTests) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-800 rounded-md">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Tests Psicológicos Disponibles</h2>
      
      {tests.length === 0 ? (
        <p className="text-gray-500">No hay tests disponibles en este momento.</p>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="border rounded-lg overflow-hidden">
              <div 
                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => handlePreview(test.id)}
              >
                <div>
                  <h3 className="font-medium">{test.titulo}</h3>
                  <p className="text-sm text-gray-500">{test.descripcion}</p>
                </div>
                <div>
                  <button className="text-blue-500 hover:underline">
                    {selectedTest === test.id ? 'Ocultar detalles' : 'Ver detalles'}
                  </button>
                </div>
              </div>
              
              {selectedTest === test.id && (
                <div className="p-4 bg-gray-50 border-t">
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Descripción</h4>
                    <p>{test.descripcion}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-medium mb-2">Escala de respuesta</h4>
                    <div className="flex justify-between items-center bg-blue-100 p-4 rounded-lg">
                      {LIKERT_OPTIONS.map((option) => (
                        <div key={option.value} className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow">
                            {option.value}
                          </div>
                          <span className="text-xs text-center mt-1">{option.label}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Todas las preguntas utilizan esta escala de valoración.
                    </p>
                  </div>
                  
                  <div className="flex justify-end">
                    <Link 
                      to={`/tests/${test.id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Realizar Test
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestsList;