import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS, getAuthHeader } from "../../config/api";
import { toast } from "react-toastify";
import NavigationSidebar from "../layout/NavigationSidebar";
import { Button } from "../ui";  

const MostrarInformes = () => {
  const [informes, setInformes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Función para obtener los informes
  const fetchInformes = async () => {
    try {
      const response = await fetch(ENDPOINTS.INFORMES, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error("Error al obtener los informes");
      }

      const data = await response.json();
      setInformes(data.data);
    } catch (error) {
      toast.error("Error al cargar los informes");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInformes();
  }, []);

  return (
    <div className="flex min-h-screen">
      <NavigationSidebar />

      <div className="flex-1 p-4 min-h-[600px]">
        <div className="flex flex-col gap-6">
          <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-800">
              Mostrar Informes
            </h1>
            <Button onClick={() => navigate("/GenerarInforme")}>
              Generar Informe
            </Button>
          </header>

          {loading ? (
            <p>Cargando...</p>
          ) : (
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">Nombre del Paciente</th>
                  <th className="px-4 py-2">Psicólogo</th>
                  <th className="px-4 py-2">Fecha de la sesión</th>
                  <th className="px-4 py-2">Hora de inicio</th>
                  <th className="px-4 py-2">Hora de fin</th>
                  <th className="px-4 py-2">Duración de la sesión</th>
                  <th className="px-4 py-2">Motivo de la consulta</th>
                  <th className="px-4 py-2">Comentario</th>
                </tr>
              </thead>
              <tbody>
                {informes.length > 0 ? (
                  informes.map((informe) => (
                    <tr key={informe.id}>
                      <td className="px-4 py-2">{informe.nombre_paciente}</td>
                      <td className="px-4 py-2">{informe.nombre_psicologo}</td>
                      <td className="px-4 py-2">{informe.fecha_sesion}</td>
                      <td className="px-4 py-2">{informe.hora_inicio}</td>
                      <td className="px-4 py-2">{informe.hora_fin}</td>
                      <td className="px-4 py-2">{informe.duracion_sesion}</td>
                      <td className="px-4 py-2">{informe.motivo_consulta}</td>
                      <td className="px-4 py-2">{informe.comentario_sesion}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-2">
                      No hay informes disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MostrarInformes;
