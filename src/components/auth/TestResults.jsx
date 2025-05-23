// src/components/auth/TestResults.jsx
import React from 'react';

const interpretacion = (tipo, puntaje) => {
  switch (tipo) {
    case 'depresion':
      if (puntaje <= 10) return 'Sin síntomas significativos';
      if (puntaje <= 20) return 'Depresión leve';
      if (puntaje <= 30) return 'Depresión moderada';
      return 'Depresión severa';

    case 'ansiedad':
      if (puntaje <= 10) return 'Sin síntomas relevantes';
      if (puntaje <= 20) return 'Ansiedad leve';
      if (puntaje <= 30) return 'Ansiedad moderada';
      return 'Ansiedad severa';

    case 'bipolaridad':
      if (puntaje <= 10) return 'Sin manifestaciones importantes';
      if (puntaje <= 20) return 'Posibles rasgos bipolares';
      if (puntaje <= 30) return 'Bipolaridad moderada';
      return 'Alto riesgo de trastorno bipolar';

    default:
      return 'No evaluado';
  }
};

const TestResults = ({ resultados, onBack }) => {
  return (
    <div className="p-6">
      <button
        onClick={onBack}
        className="mb-6 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
      >
        ← Volver al menú de tests
      </button>

      {(!resultados || resultados.length === 0) ? (
        <p className="text-center text-gray-500">No se han realizado tests aún.</p>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center mb-4">Tests realizados</h2>
          {resultados.map((res, idx) => (
            <div key={idx} className="border rounded p-4 shadow-sm bg-white">
              <h3 className="text-lg font-bold capitalize">{res.tipo}</h3>
              <p className="text-gray-700">Puntaje total: {res.puntaje}</p>
              <p className="text-blue-700 font-semibold">
                Interpretación: {interpretacion(res.tipo, res.puntaje)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResults;
