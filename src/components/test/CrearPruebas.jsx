import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../common/Button";
import { ENDPOINTS, getAuthHeader } from "../../config/api";
import { toast } from "react-toastify";

export const CrearPruebas = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const isEditing = Boolean(testId);
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [nombreTest, setNombreTest] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [duracion, setDuracion] = useState("30");
  const [preguntas, setPreguntas] = useState([
    { id: Date.now(), enunciado: "", opciones: [""], pesoEvaluativo: 1 },
  ]);

  // Fetch test data if editing
  useEffect(() => {
    if (testId) {
      const fetchTestData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`${ENDPOINTS.PRUEBAS}/${testId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              ...getAuthHeader(),
            },
          });

          if (!response.ok) {
            throw new Error('Error fetching test data');
          }

          const data = await response.json();
          setNombreTest(data.titulo);
          setDescripcion(data.descripcion || '');
          
          // If the test has questions, load them
          if (data.Preguntas && data.Preguntas.length > 0) {
            setPreguntas(data.Preguntas.map(q => ({
              id: q.id,
              enunciado: q.enunciado,
              opciones: Array.isArray(q.opciones) ? q.opciones : [],
              pesoEvaluativo: q.pesoEvaluativo || 1
            })));
          }
        } catch (err) {
          console.error('Error loading test:', err);
          toast.error('Error al cargar la prueba');
        } finally {
          setLoading(false);
        }
      };

      fetchTestData();
    }
  }, [testId]);

  const handleAgregarPregunta = () => {
    setPreguntas((prev) => [
      ...prev,
      { id: Date.now(), enunciado: "", opciones: [""], pesoEvaluativo: 1 },
    ]);
  };

  const handleEliminarPregunta = (id) => {
    setPreguntas((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCambioPregunta = (id, campo, valor) => {
    setPreguntas((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [campo]: valor } : p))
    );
  };

  const handleCambioOpcion = (idPregunta, indexOpcion, valor) => {
    setPreguntas((prev) =>
      prev.map((p) => {
        if (p.id !== idPregunta) return p;
        const nuevasOpciones = [...p.opciones];
        nuevasOpciones[indexOpcion] = valor;
        return { ...p, opciones: nuevasOpciones };
      })
    );
  };

  const handleAgregarOpcion = (idPregunta) => {
    setPreguntas((prev) =>
      prev.map((p) =>
        p.id === idPregunta ? { ...p, opciones: [...p.opciones, ""] } : p
      )
    );
  };

  const handleReset = () => {
    if (window.confirm("¿Estás seguro de querer restablecer el formulario?")) {
      setNombreTest("");
      setDescripcion("");
      setDuracion("30");
      setPreguntas([
        { id: Date.now(), enunciado: "", opciones: [""], pesoEvaluativo: 1 },
      ]);
    }
  };

  const handleSubmit = async () => {
    // Validate form
    if (!nombreTest.trim()) {
      toast.error("Debe proporcionar un nombre para la prueba");
      return;
    }

    if (!descripcion.trim()) {
      toast.error("Debe proporcionar una descripción para la prueba");
      return;
    }

    // Validate questions
    const invalidQuestions = preguntas.filter(
      (p) => !p.enunciado.trim() || p.opciones.some((o) => !o.trim())
    );

    if (invalidQuestions.length > 0) {
      toast.error("Todas las preguntas y opciones deben tener contenido");
      return;
    }

    try {
      setSubmitting(true);

      // Create or update the test
      const testMethod = isEditing ? 'PUT' : 'POST';
      const testUrl = isEditing 
        ? `${ENDPOINTS.PRUEBAS}/${testId}` 
        : ENDPOINTS.PRUEBAS;
      
      const testPayload = {
        titulo: nombreTest,
        descripcion: descripcion,
        activa: true
      };

      const testResponse = await fetch(testUrl, {
        method: testMethod,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(testPayload),
      });

      if (!testResponse.ok) {
        throw new Error('Error saving test');
      }

      const testData = await testResponse.json();
      const savedTestId = testData.id || testId;

      // Now save all questions
      for (const pregunta of preguntas) {
        let questionMethod = 'POST';
        let questionUrl = `${ENDPOINTS.PRUEBAS}/${savedTestId}/preguntas`;

        // If we're editing and the question has an ID that's a UUID (not a timestamp)
        if (isEditing && typeof pregunta.id === 'string' && pregunta.id.includes('-')) {
          questionMethod = 'PUT';
          questionUrl = `${ENDPOINTS.PRUEBAS}/${savedTestId}/preguntas/${pregunta.id}`;
        }

        const questionPayload = {
          enunciado: pregunta.enunciado,
          opciones: pregunta.opciones,
          pesoEvaluativo: pregunta.pesoEvaluativo
        };

        const questionResponse = await fetch(questionUrl, {
          method: questionMethod,
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
          body: JSON.stringify(questionPayload),
        });

        if (!questionResponse.ok) {
          throw new Error(`Error saving question: ${pregunta.enunciado}`);
        }
      }

      toast.success(isEditing ? 'Prueba actualizada correctamente' : 'Prueba creada correctamente');
      navigate('/testmenu');
      
    } catch (err) {
      console.error('Error saving test:', err);
      toast.error('Error al guardar la prueba');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="flex gap-4 p-4 min-h-[600px]">
        <div className="flex-1 px-10 py-6">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditing ? 'Editar prueba' : 'Crear prueba'}
            </h1>
            <button 
              onClick={() => navigate('/testmenu')}
              className="text-gray-500 hover:text-gray-700"
            >
              Volver
            </button>
          </header>

          <section className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Detalles de la prueba
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Duración estimada (minutos)
                </label>
                <select
                  value={duracion}
                  onChange={(e) => setDuracion(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="15">15 mins</option>
                  <option value="30">30 mins</option>
                  <option value="60">60 mins</option>
                  <option value="90">90 mins</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nombre de la prueba
                </label>
                <input
                  type="text"
                  value={nombreTest}
                  onChange={(e) => setNombreTest(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Ej: Test de ansiedad"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Descripción
              </label>
              <textarea
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full border rounded px-3 py-2"
                rows="3"
                placeholder="Breve descripción de la prueba..."
              ></textarea>
            </div>

            <h2 className="text-xl font-semibold text-gray-700 mb-4 mt-8">
              Preguntas
            </h2>

            {/* Preguntas dinámicas */}
            {preguntas.map((pregunta, idx) => (
              <div
                key={pregunta.id}
                className="border rounded-xl p-4 bg-gray-50 mb-6"
              >
                <input
                  type="text"
                  placeholder={`Pregunta ${idx + 1}`}
                  value={pregunta.enunciado}
                  onChange={(e) =>
                    handleCambioPregunta(pregunta.id, "enunciado", e.target.value)
                  }
                  className="w-full border-b py-2 px-1 text-lg font-medium focus:outline-none mb-3"
                />

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Peso evaluativo
                  </label>
                  <input 
                    type="number" 
                    min="1"
                    max="10"
                    value={pregunta.pesoEvaluativo}
                    onChange={(e) => 
                      handleCambioPregunta(pregunta.id, "pesoEvaluativo", parseInt(e.target.value) || 1)
                    }
                    className="border rounded px-3 py-1 w-20"
                  />
                </div>

                <h3 className="font-medium mb-2">Opciones</h3>
                {pregunta.opciones.map((op, i) => (
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className="text-gray-500">{i + 1}.</span>
                    <input
                      type="text"
                      value={op}
                      onChange={(e) =>
                        handleCambioOpcion(pregunta.id, i, e.target.value)
                      }
                      placeholder={`Opción ${i + 1}`}
                      className="flex-1 border px-2 py-1 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <button
                  onClick={() => handleAgregarOpcion(pregunta.id)}
                  className="text-blue-600 hover:underline text-sm mb-4 flex items-center mt-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Añadir opción
                </button>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handleEliminarPregunta(pregunta.id)}
                    className="text-red-500 hover:text-red-700 flex items-center text-sm"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar pregunta
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAgregarPregunta}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 mb-6 hover:bg-gray-50"
            >
              + Añadir pregunta
            </button>

            <div className="flex justify-end gap-4">
              <Button 
                variant="secondary" 
                onClick={handleReset}
                disabled={submitting}
              >
                Restablecer
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CrearPruebas;
