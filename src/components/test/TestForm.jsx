import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { LIKERT_OPTIONS } from '../../constants/likertScale';

const TestForm = ({ preguntas, onBack, tipoTest, onSubmit }) => {
  const [respuestas, setRespuestas] = useState({});

  const handleRespuestaChange = (idPregunta, valor) => {
    setRespuestas({
      ...respuestas,
      [idPregunta]: valor
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Verificar que todas las preguntas tengan respuesta
    const todasRespondidas = preguntas.every(pregunta => respuestas[pregunta.id] !== undefined);
    
    if (!todasRespondidas) {
      toast.error('Debes responder todas las preguntas');
      return;
    }
    
    // Crear array de respuestas con formato para almacenar
    const respuestasFormateadas = preguntas.map(pregunta => ({
      questionId: pregunta.id,
      question: pregunta.enunciado,
      answer: LIKERT_OPTIONS[respuestas[pregunta.id] - 1].label,
      value: respuestas[pregunta.id], // Valor numérico para cálculos
      score: respuestas[pregunta.id] * pregunta.pesoEvaluativo // Ponderar por peso evaluativo
    }));
    
    onSubmit(respuestasFormateadas);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        {tipoTest === 'ansiedad' ? 'Test de Ansiedad' : 
         tipoTest === 'depresion' ? 'Test de Depresión' : 
         tipoTest === 'estres' ? 'Test de Estrés' : 'Test Psicológico'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        {preguntas.map((pregunta, index) => (
          <div key={pregunta.id} className="mb-6 pb-4 border-b">
            <p className="mb-3 font-medium">{index + 1}. {pregunta.enunciado}</p>
            
            <div className="grid grid-cols-5 gap-2 mt-4">
              {LIKERT_OPTIONS.map((option) => (
                <div key={option.value} className="flex flex-col items-center">
                  <button
                    type="button"
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      respuestas[pregunta.id] === option.value 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                    onClick={() => handleRespuestaChange(pregunta.id, option.value)}
                  >
                    {option.value}
                  </button>
                  <span className="text-xs text-center mt-1">{option.label}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Volver
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Enviar Respuestas
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestForm;
