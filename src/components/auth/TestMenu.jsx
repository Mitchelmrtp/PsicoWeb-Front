import React from 'react';

const buttonStyle = {
  margin: '10px',
  padding: '15px 30px',
  borderRadius: '8px',
  border: '2px solid #007bff',
  backgroundColor: '#007bff',
  color: 'white',
  fontWeight: '700',
  fontSize: '18px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  minWidth: '180px',
};

const buttonHoverStyle = {
  backgroundColor: '#0056b3',
  borderColor: '#0056b3',
};

export default function TestsMenu({ onSelectTest }) {
  const [hovered, setHovered] = React.useState(null);

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2 style={{ marginBottom: '25px' }}>Selecciona un test</h2>
      {['depresion', 'ansiedad', 'bipolaridad'].map((test) => (
        <button
          key={test}
          style={hovered === test ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
          onMouseEnter={() => setHovered(test)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelectTest(test)}
          type="button"
        >
          {`Test ${test.charAt(0).toUpperCase() + test.slice(1)}`}
        </button>
      ))}
    </div>
  );
}




