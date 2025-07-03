import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS, getAuthHeader } from '../../config/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

// Helper functions for interpreting test results
const interpretarNivelAnsiedad = (puntuacion) => {
  if (puntuacion <= 1.5) return 'Mínima';
  if (puntuacion <= 2.5) return 'Leve';
  if (puntuacion <= 3.5) return 'Moderada';
  return 'Severa';
};

const interpretarNivelDepresion = (puntuacion) => {
  if (puntuacion <= 1.5) return 'Mínima';
  if (puntuacion <= 2.5) return 'Leve';
  if (puntuacion <= 3.5) return 'Moderada';
  return 'Severa';
};

const interpretarNivelEstres = (puntuacion) => {
  if (puntuacion <= 1.5) return 'Bajo';
  if (puntuacion <= 2.5) return 'Moderado';
  if (puntuacion <= 3.5) return 'Alto';
  return 'Severo';
};

const interpretarNivelGeneral = (puntuacion) => {
  if (puntuacion <= 1.5) return 'Bajo';
  if (puntuacion <= 2.5) return 'Moderado';
  if (puntuacion <= 3.5) return 'Alto';
  return 'Significativo';
};

const TestPage = () => {
  const { testId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState({});
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchTest = async () => {
      try {
        setLoading(true);
        
        // Construir la URL correctamente
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
        const url = `${API_URL}/pruebas/${testId}`;
        
        console.log('Fetching test from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });

        // Si la respuesta no es OK, manejarlo antes de intentar parsear
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API response error:', response.status, errorText);
          throw new Error(`Error fetching test: ${response.status}`);
        }

        // Obtener el texto primero para debuggear si hay problemas
        const responseText = await response.text();
        
        // Verificar que es un JSON válido antes de parsear
        let data;
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Invalid JSON response:', responseText.substring(0, 200) + '...');
          throw new Error('La respuesta del servidor no es un JSON válido');
        }
        
        console.log('Test data received:', data);
        
        // Extract the test data from the response if it's in a data property
        const testData = data.data || data;
        
        // Asegúrate de que las preguntas tengan arrays de opciones válidos
        if (testData.Preguntas && Array.isArray(testData.Preguntas)) {
          testData.Preguntas = testData.Preguntas.map(question => {
            let opciones = question.opciones;
            
            // Si opciones es string, intentar parsearlo como JSON
            if (typeof opciones === 'string') {
              try {
                opciones = JSON.parse(opciones);
              } catch (e) {
                console.error('Error parsing options:', e);
                opciones = [];
              }
            }
            
            // Si opciones no es array, crear array vacío
            if (!Array.isArray(opciones)) {
              opciones = [];
            }
            
            return {
              ...question,
              opciones
            };
          });
          
          // Inicializar las respuestas
          const initialResponses = {};
          testData.Preguntas.forEach(pregunta => {
            initialResponses[pregunta.id] = null;
          });
          setResponses(initialResponses);
        }
        
        setTest(testData);
      } catch (err) {
        console.error('Error loading test:', err);
        setError(err.message || 'Error al cargar la prueba');
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [testId]);

  const handleResponse = (questionId, optionIndex) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < test.Preguntas.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if all questions are answered
    const unansweredQuestions = Object.values(responses).filter(r => r === null).length;
    if (unansweredQuestions > 0) {
      toast.warning(`Tienes ${unansweredQuestions} preguntas sin responder`);
      return;
    }

    try {
      setSubmitting(true);

      // Format responses for submission - ensure consistent format
      const formattedResponses = Object.entries(responses).map(([questionId, optionIndex]) => ({
        idPregunta: questionId,
        respuesta: optionIndex,  // Send as number
        puntuacion: optionIndex + 1
      }));

      // Calcular puntuaciones
      const puntuacionTotal = formattedResponses.reduce((sum, r) => sum + r.puntuacion, 0);
      const puntuacionPromedio = puntuacionTotal / formattedResponses.length;

      // Generar interpretación basada en el tipo de test
      let interpretacion = '';
      if (test.titulo.toLowerCase().includes('ansiedad')) {
        interpretacion = `Nivel de ansiedad: ${interpretarNivelAnsiedad(puntuacionPromedio)}`;
      } else if (test.titulo.toLowerCase().includes('depresion') || test.titulo.toLowerCase().includes('depresión')) {
        interpretacion = `Nivel de depresión: ${interpretarNivelDepresion(puntuacionPromedio)}`;
      } else if (test.titulo.toLowerCase().includes('estres') || test.titulo.toLowerCase().includes('estrés')) {
        interpretacion = `Nivel de estrés: ${interpretarNivelEstres(puntuacionPromedio)}`;
      } else {
        interpretacion = `Nivel general: ${interpretarNivelGeneral(puntuacionPromedio)}`;
      }

      const datos = {
        idPrueba: testId,
        idPaciente: user.userId,
        respuestas: formattedResponses,
        interpretacion,
        puntuacionTotal,
        puntuacionPromedio
      };

      console.log('Enviando resultado:', datos);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';
      const response = await fetch(`${API_URL}/pruebas/${testId}/resultados`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', response.status, errorText);
        throw new Error(`Error al enviar los resultados: ${response.status}`);
      }

      const data = await response.json();
      console.log('Test result submission successful:', data);
      
      // Extract the ID from the response
      const resultData = data.data || data;
      const resultId = resultData.id;
      
      toast.success('Prueba completada correctamente');
      navigate(`/resultados/${resultId}`);
    } catch (err) {
      console.error('Error al enviar la prueba:', err);
      toast.error(err.message || 'Error al enviar los resultados');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('User info:', user);
      if (!user.userId) {
        console.warn('Warning: user.userId is missing or undefined!');
      }
    } else {
      console.warn('Warning: user object is null or undefined!');
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error || 'No se pudo cargar la prueba'}</p>
          <button
            onClick={() => navigate('/testmenu')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  // Check if test.Preguntas exists and has elements before accessing
  if (!test.Preguntas || !Array.isArray(test.Preguntas) || test.Preguntas.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>Esta prueba no contiene preguntas</p>
          <button
            onClick={() => navigate('/testmenu')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const currentQ = test.Preguntas[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/testmenu')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">{test.titulo}</h1>
            <p className="text-gray-600 mt-2">{test.descripcion}</p>
          </div>
          
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${((currentQuestion + 1) / test.Preguntas.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-right text-sm text-gray-500 mt-1">
              {currentQuestion + 1} de {test.Preguntas.length}
            </div>
          </div>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">{currentQ.enunciado}</h2>
            
            <div className="space-y-3">
              {currentQ.opciones.map((opcion, index) => (
                <div 
                  key={index}
                  className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                    responses[currentQ.id] === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleResponse(currentQ.id, index)}
                >
                  {opcion}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className={`px-4 py-2 border border-gray-300 rounded-md ${
                currentQuestion === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Anterior
            </button>
            
            {currentQuestion < test.Preguntas.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Siguiente
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className={`px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Enviando...' : 'Finalizar'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;