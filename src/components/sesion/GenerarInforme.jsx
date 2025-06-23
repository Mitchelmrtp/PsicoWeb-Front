import React, { useState } from 'react';
import PsicologoSidebar from '../dashboard/PsicologoSidebar'

const GenerarInforme = () => {
  const [duracion, setDuracion] = useState('');
  const [nombreTest, setNombreTest] = useState('');
  const [pregunta, setPregunta] = useState('');
  const [nombrePaciente, setNombrePaciente] = useState('');
  const [nombrePsicologo, setNombrePsicologo] = useState('');
  const [temaSesion, setTemaSesion] = useState('');
  const [comentarioSesion, setComentarioSesion] = useState('');
  const [obligatorio, setObligatorio] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes procesar o enviar el formulario de manera básica
    console.log({
      duracion,
      nombreTest,
      pregunta,
      nombrePaciente,
      nombrePsicologo,
      temaSesion,
      comentarioSesion,
      obligatorio,
    });
  };

return (
  <div className="flex min-h-screen">
    {/* Sidebar */}
    <PsicologoSidebar />
    
    {/* Contenido principal */}
    <div className="flex-1 p-4 min-h-[600px]">
      <div className="flex flex-col gap-6">
        <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800">Generar Informe</h1>
        </header>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>

          {/* Nombre del Paciente */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#555', fontWeight: '600' }}>Nombre del Paciente</label>
            <input
              type="text"
              value={nombrePaciente}
              onChange={(e) => setNombrePaciente(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Nombre del Psicólogo */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#555', fontWeight: '600' }}>Nombre del Psicólogo</label>
            <input
              type="text"
              value={nombrePsicologo}
              onChange={(e) => setNombrePsicologo(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Duración */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#555', fontWeight: '600' }}>Duración de la sesión</label>
            <input
              type="text"
              value={duracion}
              onChange={(e) => setDuracion(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Tema Desarrollado en la Sesión */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#555', fontWeight: '600' }}>Tema Desarrollado en la Sesión</label>
            <input
              type="text"
              value={temaSesion}
              onChange={(e) => setTemaSesion(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Comentario de la Sesión */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ color: '#555', fontWeight: '600' }}>Comentario de la Sesión</label>
            <textarea
              value={comentarioSesion}
              onChange={(e) => setComentarioSesion(e.target.value)}
              style={{
                padding: '10px',
                borderRadius: '5px',
                border: '1px solid #ccc',
                backgroundColor: '#fff',
              }}
            />
          </div>

          {/* Botón de Enviar */}
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Generar Informe
          </button>
        </form>
      </div>
    </div>
  </div>

  );
};

export default GenerarInforme;
