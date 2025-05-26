import React from 'react';

const Pregunta = ({ id, enunciado, opciones, respuestaSeleccionada, onSeleccionRespuesta, pesoEvaluativo }) => {
  return (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <p className="font-medium text-lg mb-4">{enunciado}</p>
      
      <div className="space-y-2">
        {opciones.map((opcion, index) => (
          <div key={index} className="flex items-start">
            <input
              type="radio"
              id={`pregunta-${id}-opcion-${index}`}
              name={`pregunta-${id}`}
              value={index}
              checked={respuestaSeleccionada === index}
              onChange={() => onSeleccionRespuesta(id, index)}
              className="mt-1 mr-2"
            />
            <label 
              htmlFor={`pregunta-${id}-opcion-${index}`}
              className="cursor-pointer"
            >
              {opcion}
            </label>
          </div>
        ))}
      </div>
      
      {pesoEvaluativo > 1 && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Valor de esta pregunta: {pesoEvaluativo} {pesoEvaluativo > 1 ? 'puntos' : 'punto'}
        </div>
      )}
    </div>
  );
};

export default Pregunta;
