import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Button from "../common/Button";
import TestMenu from "./TestMenu";
import TestForm from "./TestForm";
import TestResults from "./TestResults";
export const Form = () => {
  const navigate = useNavigate();
  const [testSeleccionado, setTestSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [resultadosTests, setResultadosTests] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("user"));
  const email = usuario?.email || "anonimo";

  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/login");
  };

  const handleDisponibilidad = (e) => {
    e.preventDefault();
    navigate("/disponibilidad");
  };

  const handleReserva = (e) => {
    e.preventDefault();
    navigate("/reserva");
  };

  if (mostrarResultados) {
    return (
      <div className="p-6">
        <Button variant="secondary" onClick={() => setMostrarResultados(false)}>
          ← Volver a la página principal
        </Button>
        <TestResults
          resultados={resultadosTests}
          onBack={() => setMostrarResultados(false)}
        />
      </div>
    );
  }

  if (!testSeleccionado) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <header className="flex items-center justify-between px-8 py-6">
          <h1 className="text-4xl font-extrabold text-gray-800">FORM</h1>
        </header>
      </div>
    );
  }

  let preguntasActuales;
  switch (testSeleccionado) {
    case "depresion":
      preguntasActuales = preguntasDepresion;
      break;
    case "ansiedad":
      preguntasActuales = preguntasAnsiedad;
      break;
    case "bipolaridad":
      preguntasActuales = preguntasBipolaridad;
      break;
    default:
      preguntasActuales = [];
  }

  return (
    <div className="">
      <Button
        variant="secondary"
        className="mb-6"
        onClick={() => setTestSeleccionado(null)}
      >
        ← Volver al menú de tests
      </Button>

      <TestForm
        preguntas={preguntasActuales}
        tipoTest={testSeleccionado}
        onBack={() => setTestSeleccionado(null)}
      />
    </div>
  );
};
