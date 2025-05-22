import React from 'react';

const Pregunta = ({ texto, opciones, valorSeleccionado, onCambiar }) => {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <p>{texto}</p>
      {opciones.map(opt => (
        <label key={opt.value} style={{ marginRight: '15px' }}>
          <input
            type="radio"
            name={texto}
            value={opt.value}
            checked={valorSeleccionado === opt.value}
            onChange={() => onCambiar(opt.value)}
            required
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
};

export default Pregunta;
