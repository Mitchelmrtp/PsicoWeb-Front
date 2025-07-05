import React, { useEffect, useState } from "react";
import { SessionService } from "@/services/SessionService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const sessionService = new SessionService();

const SesionesPendientes = () => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const cargarSesiones = async () => {
    try {
      setLoading(true);
      const { data } = await sessionService.getPsychologistSessions(
        user?.userId || user?.id
      );
      const filtradas = data.filter((s) => s.estado === "programada");
      setSesiones(filtradas);
    } catch (error) {
      toast.error("Error al cargar sesiones");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const registrarAsistencia = async (sesionId) => {
    try {
      await sessionService.registerAttendance(sesionId, {
        estado: "completada",
        notas: "Sesión marcada como completada.",
      });
      toast.success("Asistencia registrada");
      // Recargar sesiones
      cargarSesiones();
    } catch (error) {
      toast.error("Error al registrar asistencia");
      console.error(error);
    }
  };

  useEffect(() => {
    cargarSesiones();
  }, []);

  if (loading) return <p>Cargando sesiones...</p>;

  if (!sesiones.length) {
    return <p>No hay sesiones pendientes de asistencia.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-bold text-indigo-900 mb-4">
        Sesiones Pendientes
      </h2>
      <ul className="space-y-4">
        {sesiones.map((sesion) => (
          <li
            key={sesion.id}
            className="border p-4 rounded-xl flex justify-between items-center"
          >
            <div>
              <p>
                <strong>Paciente:</strong>{" "}
                {sesion.Paciente?.User?.name || "Nombre no disponible"}
              </p>
              <p>
                <strong>Fecha:</strong> {sesion.fecha}
              </p>
              <p>
                <strong>Hora:</strong> {sesion.horaInicio} - {sesion.horaFin}
              </p>
            </div>
            <button
              onClick={() => registrarAsistencia(sesion.id)}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Registrar Asistencia
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SesionesPendientes;
