/**
 * Presenter component para TestResultDetail
 * Implementa Container/Presenter pattern - solo lógica de presentación
 */
import React from 'react';
import PropTypes from 'prop-types';

const TestResultDetailPresenter = ({ result, onGoBack }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Encabezado */}
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">{result.Prueba.titulo}</h1>
            <p className="mt-2 opacity-90">{result.Prueba.descripcion}</p>
            <p className="mt-2 text-sm">
              Realizado el: {formatDate(result.fechaRealizacion || result.createdAt)}
            </p>
          </div>

          {/* Resumen de resultados */}
          <div className="p-6 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Puntuación Total</h3>
                <p className="text-2xl font-bold text-blue-600">{result.puntuacionTotal}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-700">Puntuación Promedio</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {result.puntuacionPromedio?.toFixed(2)}
                </p>
              </div>
            </div>
            
            {result.interpretacion && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-gray-700">Interpretación</h3>
                <p className="mt-2 text-gray-800">{result.interpretacion}</p>
              </div>
            )}
          </div>

          {/* Lista de respuestas */}
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Respuestas</h2>
            <div className="space-y-6">
              {result.respuestas && result.respuestas.length > 0 ? (
                result.respuestas.map((respuesta, index) => (
                  <div key={respuesta.idPregunta || index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-900">
                      {index + 1}. {respuesta.pregunta || 'Pregunta sin enunciado'}
                    </p>
                    <div className="mt-2">
                      <p className="text-blue-600 font-medium">
                        Respuesta: {
                          respuesta.opciones && respuesta.opciones[respuesta.respuesta] 
                          ? respuesta.opciones[respuesta.respuesta] 
                          : `Opción ${(respuesta.respuesta || 0) + 1}`
                        }
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        Puntuación: {respuesta.puntuacion !== undefined ? respuesta.puntuacion : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg text-center">
                  <p className="text-yellow-700">No se encontraron respuestas detalladas para esta prueba.</p>
                </div>
              )}
            </div>
          </div>

          {/* Botón de volver */}
          <div className="p-6 bg-gray-50">
            <button
              onClick={onGoBack}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Volver al menú de pruebas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TestResultDetailPresenter.propTypes = {
  result: PropTypes.shape({
    Prueba: PropTypes.shape({
      titulo: PropTypes.string.isRequired,
      descripcion: PropTypes.string,
    }).isRequired,
    fechaRealizacion: PropTypes.string,
    createdAt: PropTypes.string,
    puntuacionTotal: PropTypes.number,
    puntuacionPromedio: PropTypes.number,
    interpretacion: PropTypes.string,
    respuestas: PropTypes.arrayOf(PropTypes.shape({
      idPregunta: PropTypes.string,
      pregunta: PropTypes.string,
      respuesta: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      opciones: PropTypes.array,
      puntuacion: PropTypes.number,
    })),
  }).isRequired,
  onGoBack: PropTypes.func.isRequired,
};

export default TestResultDetailPresenter;
