import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SessionService } from "@/services/SessionService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

const sessionService = new SessionService();

const SesionesPendientes = () => {
  const [sesiones, setSesiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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

  const verDetalles = (sesionId) => {
    navigate(`/citas/${sesionId}`);
  };

  useEffect(() => {
    cargarSesiones();
  }, []);

  if (loading) return <p>Cargando sesiones...</p>;

  if (!sesiones.length) {
    return <p>No hay sesiones pendientes.</p>;
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
              onClick={() => verDetalles(sesion.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Ver Detalles
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SesionesPendientes;
