import React, { useState } from 'react';

const opciones = [
  { label: 'Nunca', value: 0 },
  { label: 'Algunas veces', value: 1 },
  { label: 'Frecuentemente', value: 2 },
  { label: 'Casi siempre', value: 3 },
];

const TestForm = ({ preguntas, onBack, tipoTest }) => {
  const [respuestas, setRespuestas] = useState(Array(preguntas.length).fill(null));
  const [resultado, setResultado] = useState(null);
  const [puntajeTotal, setPuntajeTotal] = useState(null);

  const handleChange = (index, value) => {
    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[index] = value;
    setRespuestas(nuevasRespuestas);
  };

  const calcularResultado = (total) => {
    if (total <= 10) return 'Bajo riesgo';
    if (total <= 20) return 'Riesgo moderado';
    return 'Alto riesgo';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (respuestas.some(r => r === null)) {
      alert('Por favor responde todas las preguntas');
      return;
    }

    const total = respuestas.reduce((a, b) => a + b, 0);
    setPuntajeTotal(total);
    const categoria = calcularResultado(total);
    setResultado(categoria);

    // ✅ Guardar resultados por usuario
    const usuario = JSON.parse(localStorage.getItem("user"));
    const email = usuario?.email || 'anonimo';

    const nuevoResultado = {
      tipo: tipoTest,
      puntaje: total,
    };

    const key = `resultadosTests_${email}`;
    const resultadosPrevios = JSON.parse(localStorage.getItem(key)) || [];
    resultadosPrevios.push(nuevoResultado);
    localStorage.setItem(key, JSON.stringify(resultadosPrevios));
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: '20px',
          padding: '8px 15px',
          borderRadius: '6px',
          border: '1px solid #6c757d',
          backgroundColor: '#6c757d',
          color: 'white',
          cursor: 'pointer',
          fontWeight: '600',
        }}
      >
        ← Volver
      </button>

      {!resultado ? (
        <form onSubmit={handleSubmit}>
          {preguntas.map((pregunta, i) => (
            <div key={i} style={{ marginBottom: '1rem' }}>
              <p>{i + 1}. {pregunta}</p>
              {opciones.map(opt => (
                <label key={opt.value} style={{ marginRight: '15px' }}>
                  <input
                    type="radio"
                    name={`p${i}`}
                    value={opt.value}
                    onChange={() => handleChange(i, opt.value)}
                    required
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          ))}

          <button
            type="submit"
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#28a745',
              color: 'white',
              fontWeight: '700',
              fontSize: '16px',
              cursor: 'pointer',
            }}
          >
            Enviar
          </button>
        </form>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <h3>Resultado: {resultado}</h3>
          <p><strong>Puntaje total:</strong> {puntajeTotal}</p>
        </div>
      )}
    </div>
  );
};

export default TestForm;
