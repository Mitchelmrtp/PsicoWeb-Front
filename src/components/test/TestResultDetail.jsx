import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ENDPOINTS, getAuthHeader } from '../../config/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

const LIKERT_OPTIONS = [
  { value: 1, label: 'Muy en desacuerdo' },
  { value: 2, label: 'En desacuerdo' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'De acuerdo' },
  { value: 5, label: 'Muy de acuerdo' },
];

const TestResultDetail = () => {
  const { resultId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchResultDetail = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${ENDPOINTS.RESULTADOS}/${resultId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });

        if (!response.ok) {
          throw new Error('Error fetching test result');
        }

        const data = await response.json();
        setResult(data);
      } catch (err) {
        console.error('Error loading test result:', err);
        setError('Error al cargar el resultado de la prueba');
        toast.error('Error al cargar el resultado');
      } finally {
        setLoading(false);
      }
    };

    fetchResultDetail();
  }, [resultId]);

  // Parse the JSON result
  const parseResponses = (result) => {
    if (!result || !result.resultado) return [];
    
    try {
      return JSON.parse(result.resultado);
    } catch (err) {
      console.error('Error parsing result JSON:', err);
      return [];
    }
  };
  
  const responses = result ? parseResponses(result) : [];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p>{error || 'No se pudo cargar el resultado de la prueba'}</p>
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
          <div className="mb-6 border-b pb-4">
            <h1 className="text-2xl font-bold text-gray-800">{result.Prueba?.titulo || 'Resultado de Prueba'}</h1>
            <p className="text-gray-600 mt-2">
              Realizada el: {new Date(result.fechaRealizacion).toLocaleDateString()}
            </p>
          </div>
          
          <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h2 className="text-lg font-semibold text-blue-800 mb-2">Interpretación</h2>
            <p className="text-blue-700">{result.interpretacion || 'No hay interpretación disponible'}</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Respuestas</h2>
            
            {result.puntuacionPromedio && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-medium text-yellow-800 mb-2">Puntuación</h3>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4 mr-2">
                    <div 
                      className={`h-4 rounded-full ${
                        result.puntuacionPromedio >= 4 ? 'bg-red-500' :
                        result.puntuacionPromedio >= 3 ? 'bg-yellow-500' :
                        result.puntuacionPromedio >= 2 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(result.puntuacionPromedio / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-bold">{result.puntuacionPromedio.toFixed(1)}/5</span>
                </div>
              </div>
            )}
            
            {responses.length === 0 ? (
              <p className="text-gray-500">No hay detalles de respuestas disponibles</p>
            ) : (
              <div className="space-y-4">
                {responses.map((response, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-gray-50">
                    <p className="font-medium mb-2 text-gray-800">{index + 1}. {response.question}</p>
                    <div className="grid grid-cols-5 gap-2 my-3">
                      {LIKERT_OPTIONS.map((option) => (
                        <div key={option.value} className="flex flex-col items-center">
                          <div 
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              response.value === option.value 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-400'
                            }`}
                          >
                            {option.value}
                          </div>
                          <span className="text-xs text-center mt-1">{option.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {user.role === 'paciente' && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => navigate(`/test/${result.idPrueba}`)}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Realizar prueba nuevamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestResultDetail;