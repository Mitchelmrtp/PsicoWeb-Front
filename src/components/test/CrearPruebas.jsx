import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

export const CrearPruebas = () => {
  const navigate = useNavigate();
  const [nombreTest, setNombreTest] = useState("Test de ansiedad");
  const [duracion, setDuracion] = useState("30 mins");
  const [preguntas, setPreguntas] = useState([
    { id: Date.now(), texto: "", opciones: [""], obligatorio: false }
  ]);

  const handleAgregarPregunta = () => {
    setPreguntas(prev => [
      ...prev,
      { id: Date.now(), texto: "", opciones: [""], obligatorio: false }
    ]);
  };

  const handleEliminarPregunta = (id) => {
    setPreguntas(prev => prev.filter(p => p.id !== id));
  };

  const handleCambioPregunta = (id, campo, valor) => {
    setPreguntas(prev =>
      prev.map(p =>
        p.id === id ? { ...p, [campo]: valor } : p
      )
    );
  };

  const handleCambioOpcion = (idPregunta, indexOpcion, valor) => {
    setPreguntas(prev =>
      prev.map(p => {
        if (p.id !== idPregunta) return p;
        const nuevasOpciones = [...p.opciones];
        nuevasOpciones[indexOpcion] = valor;
        return { ...p, opciones: nuevasOpciones };
      })
    );
  };

  const handleAgregarOpcion = (idPregunta) => {
    setPreguntas(prev =>
      prev.map(p =>
        p.id === idPregunta ? { ...p, opciones: [...p.opciones, ""] } : p
      )
    );
  };

  const handleToggleObligatorio = (id) => {
    setPreguntas(prev =>
      prev.map(p =>
        p.id === id ? { ...p, obligatorio: !p.obligatorio } : p
      )
    );
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex gap-4 p-4 min-h-[600px]">

        <div className="flex-1 px-10 py-6">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Crear pruebas</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Hola, Javier Soldevilla</span>
              <img
                src="https://avatars.githubusercontent.com/u/1?v=4"
                alt="Stevan"
                className="w-8 h-8 rounded-full"
              />
            </div>
          </header>

          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Insertar pregunta</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Duración</label>
                <select
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option>30 mins</option>
                  <option>60 mins</option>
                  <option>90 mins</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Nombre de test</label>
                <input
                  type="text"
                  value={nombreTest}
                  onChange={(e) => setNombreTest(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {/* Preguntas dinámicas */}
            {preguntas.map((pregunta, idx) => (
              <div key={pregunta.id} className="border rounded-xl p-4 bg-gray-50 mb-6">
                <input
                  type="text"
                  placeholder={`Pregunta ${idx + 1}`}
                  value={pregunta.texto}
                  onChange={(e) => handleCambioPregunta(pregunta.id, "texto", e.target.value)}
                  className="w-full border-b py-2 px-1 text-lg font-medium focus:outline-none mb-3"
                />

                <select className="border px-3 py-1 rounded mb-4">
                  <option>Varias opciones</option>
                  <option>Respuesta corta</option>
                </select>

                {pregunta.opciones.map((op, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <input type="radio" disabled />
                    <input
                      type="text"
                      value={op}
                      onChange={(e) => handleCambioOpcion(pregunta.id, i, e.target.value)}
                      placeholder={`Opción ${i + 1}`}
                      className="flex-1 border-b px-2 py-1 focus:outline-none"
                    />
                  </div>
                ))}

                <button
                  onClick={() => handleAgregarOpcion(pregunta.id)}
                  className="text-blue-600 hover:underline text-sm mb-4"
                >
                  Añadir otra opción
                </button>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-2 text-gray-500">
                    <button>📄</button>
                    <button onClick={() => handleEliminarPregunta(pregunta.id)}>🗑️</button>
                  </div>

                  <label className="flex items-center text-sm gap-2">
                    Obligatorio
                    <input
                      type="checkbox"
                      checked={pregunta.obligatorio}
                      onChange={() => handleToggleObligatorio(pregunta.id)}
                      className="accent-indigo-600"
                    />
                  </label>
                </div>

                {/* Botón flotante para añadir nueva pregunta al lado derecho */}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleAgregarPregunta}
                    className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200"
                  >
                    + Añadir nueva pregunta
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-end gap-4">
              <Button variant="secondary">Restablecer</Button>
              <Button variant="primary">Guardar</Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
