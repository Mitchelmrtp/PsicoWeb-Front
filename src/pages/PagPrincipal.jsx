import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/common/Button";
import TestMenu from "../components/test/TestMenu";
import TestForm from "../components/test/TestForm";
import TestResults from "../components/test/TestResults";

export const PagPrincipal = () => {
  const navigate = useNavigate();
  const [testSeleccionado, setTestSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [resultadosTests, setResultadosTests] = useState([]);

  // Simulación de usuario psicólogo/paciente
  const usuario = {
    email: "psico@web.com",
    tipo: "psicologo", // Cambia a "paciente" para test
  };

  const email = usuario.email;
  const esPsicologo = usuario.tipo === "psicologo";
  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const handleDisponibilidad = () => navigate("/disponibilidad");
  const handleReserva = () => navigate("/reserva");
  const handleCrearTest = () => navigate("/crearPruebas");

  const handleVerResultados = () => {
    const datosGuardados =
      JSON.parse(localStorage.getItem(`resultadosTests_${email}`)) || [];
    setResultadosTests(datosGuardados);
    setMostrarResultados(true);
  };

  if (mostrarResultados) {
    return (
      <div className="p-6">
        <Button variant="secondary" onClick={() => setMostrarResultados(false)}>
          ← Volver a la página principal
        </Button>
        <TestResults resultados={resultadosTests} onBack={() => setMostrarResultados(false)} />
      </div>
    );
  }

  if (!testSeleccionado) {
    return (
      <div className="w-full min-h-screen bg-gray-50">

        <div className="flex gap-4 p-4 min-h-[600px]">

          {/* Contenido central que ocupa el ancho restante */}
          <div className="flex-1 flex flex-col items-center">
            <h2 className="text-3xl font-semibold text-center px-8 py-6 text-indigo-700 mb-6">
              Bienvenido a <span className="text-indigo-500 font-bold">PSICOWEB</span>
            </h2>

            {/* Card de acciones */}
            <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mb-8">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Acciones rápidas</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="primary" onClick={handleDisponibilidad}>
                  Ver disponibilidad
                </Button>
                <Button variant="primary" onClick={handleReserva}>
                  Reservar cita
                </Button>

                {esPsicologo && (
                  <>
                    <Button variant="primary" onClick={handleCrearTest}>
                      Crear nuevo test
                    </Button>
                    <Button variant="primary" onClick={handleVerResultados}>
                      Ver resultados de los tests
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Menú de tests */}
            <div className="w-full max-w-3xl">
              <TestMenu onSelectTest={setTestSeleccionado} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <TestForm test={testSeleccionado} />;
};
