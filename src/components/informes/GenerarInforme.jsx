/* eslint-disable react/prop-types */
import { useState } from "react";
import { toast } from "react-toastify";
import NavigationSidebar from "../layout/NavigationSidebar"; // Sidebar
import { ENDPOINTS, getAuthHeader } from "../../config/api";
import { jsPDF } from "jspdf"; // Importar jsPDF

const GenerarInforme = ({ onSubmit }) => {
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [nombrePaciente, setNombrePaciente] = useState("");
  const [nombrePsicologo, setNombrePsicologo] = useState("");
  const [objetivoSesion, setObjetivoSesion] = useState("");
  const [comentarioSesion, setComentarioSesion] = useState("");
  const [motivo, setMotivo] = useState("");
  const [fechaSesion, setFechaSesion] = useState(new Date());
  const [submitting, setSubmitting] = useState(false);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos
    if (!nombrePaciente.trim() || !nombrePsicologo.trim()) {
      toast.error("Debe completar todos los campos requeridos");
      return;
    }

    const formData = {
      nombre_paciente: nombrePaciente,
      nombre_psicologo: nombrePsicologo,
      hora_inicio: horaInicio,
      hora_fin: horaFin,
      fecha_sesion: fechaSesion.toISOString().split("T")[0], // Solo la fecha (YYYY-MM-DD)
      motivo_consulta: motivo,
      objetivo_sesion: objetivoSesion,
      comentario_sesion: comentarioSesion,
    };

    setSubmitting(true);

    try {
      const response = await fetch(ENDPOINTS.INFORMES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Informe creado correctamente");
        onSubmit(result.data); // Llamamos al onSubmit para pasar los datos al componente principal
      } else {
        toast.error(result.message || "Error al crear el informe");
      }
    } catch (error) {
      console.error("Error al enviar los datos al backend:", error);
      toast.error("Error al enviar los datos al backend");
    } finally {
      setSubmitting(false);
    }
  };

  // Función para generar el PDF
  const generarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Informe de la Sesión Psicológica", 20, 20);

    const fechaFormateada = fechaSesion.toLocaleDateString();
    doc.text(fechaFormateada, 180, 20); // Fecha en esquina superior derecha

    doc.setFontSize(12);
    doc.text(`Nombre del Paciente: ${nombrePaciente}`, 20, 40);
    doc.text(`Nombre del Psicólogo: ${nombrePsicologo}`, 20, 50);
    doc.text(`Hora de Inicio: ${horaInicio}`, 20, 60);
    doc.text(`Hora de Finalización: ${horaFin}`, 20, 70);
    doc.text(`Objetivo de la sesión: ${objetivoSesion}`, 20, 80);
    doc.text(`Comentario: ${comentarioSesion}`, 20, 90);

    // Guardar el PDF generado
    doc.save("informe_sesion.pdf");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar de navegación */}
      <NavigationSidebar />

      <div className="flex-1 p-6">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">Generar Informe</h1>
          </header>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nombre del Paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Paciente</label>
              <input
                type="text"
                value={nombrePaciente}
                onChange={(e) => setNombrePaciente(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Nombre del Psicólogo */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Nombre del Psicólogo</label>
              <input
                type="text"
                value={nombrePsicologo}
                onChange={(e) => setNombrePsicologo(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Hora de Inicio y Hora de Finalización */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de Inicio</label>
                <input
                  type="time"
                  value={horaInicio}
                  onChange={(e) => setHoraInicio(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Hora de Finalización</label>
                <input
                  type="time"
                  value={horaFin}
                  onChange={(e) => setHoraFin(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Fecha de la sesión */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Fecha de la sesión</label>
              <input
                type="date"
                value={fechaSesion.toISOString().split("T")[0]}
                onChange={(e) => setFechaSesion(new Date(e.target.value))}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Motivo de la consulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Motivo de la consulta</label>
              <input
                type="text"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Objetivo de la sesión */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Objetivo de la sesión</label>
              <input
                type="text"
                value={objetivoSesion}
                onChange={(e) => setObjetivoSesion(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Comentario de la sesión */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Comentario de la sesión</label>
              <textarea
                value={comentarioSesion}
                onChange={(e) => setComentarioSesion(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Botón de enviar */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-indigo-600 text-white rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {submitting ? "Guardando..." : "Generar Informe"}
            </button>
          </form>

          {/* Botón para generar el PDF */}
          <button
            onClick={generarPDF}
            className="w-full py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-6"
          >
            Descargar Informe en PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default GenerarInforme;
