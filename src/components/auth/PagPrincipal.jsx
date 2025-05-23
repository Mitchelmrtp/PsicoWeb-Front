import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // ✅ nueva línea
import Button from '../common/Button';
import TestMenu from "./TestMenu";
import TestForm from "./TestForm";
import TestResults from "./TestResults";

export const PagPrincipal = () => {
  const navigate = useNavigate();
  const [testSeleccionado, setTestSeleccionado] = useState(null);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [resultadosTests, setResultadosTests] = useState([]);

  const usuario = JSON.parse(localStorage.getItem("user"));
  const email = usuario?.email || 'anonimo';

  const { logout } = useAuth(); // ✅ extraer función del contexto

    const handleLogout = (e) => {
    e.preventDefault();
    logout(); // ✅ limpia el token, el usuario y redirige
    navigate('/login'); // ✅ adicional por seguridad, si tu logout no redirige solo
    };



  const handleDisponibilidad = (e) => {
    e.preventDefault();
    navigate('/Disponibilidad');
  };

  const preguntasDepresion = [
        "¿Te sientes triste o vacío la mayor parte del tiempo?",
        "¿Has perdido interés en actividades que antes disfrutabas?",
        "¿Tienes dificultades para dormir o duermes demasiado?",
        "¿Te sientes cansado o con poca energía frecuentemente?",
        "¿Tienes problemas para concentrarte o tomar decisiones?",
        "¿Sientes que no vales nada o tienes sentimientos de culpa excesiva?",
        "¿Tienes pensamientos recurrentes de muerte o suicidio?",
        "¿Has notado cambios en tu apetito o peso sin proponértelo?",
        "¿Te sientes irritable o inquieto sin razón aparente?",
        "¿Sientes que tus movimientos o pensamientos están más lentos o acelerados?"
    ];

    const preguntasAnsiedad = [
        "¿Te sientes nervioso o inquieto con frecuencia?",
        "¿Tienes dificultades para controlar preocupaciones o pensamientos negativos?",
        "¿Te sudan las manos o tienes palpitaciones sin razón aparente?",
        "¿Evitas situaciones sociales porque te generan miedo o incomodidad?",
        "¿Sientes que algo malo va a suceder aunque no haya evidencia?",
        "¿Tienes problemas para dormir debido a pensamientos que no te dejan tranquilo?",
        "¿Te sientes fácilmente fatigado o con poca energía?",
        "¿Te cuesta concentrarte por estar preocupado o ansioso?",
        "¿Experimentas tensión muscular o dolores sin causa médica?",
        "¿Te molestan ruidos o situaciones que antes no te afectaban?"
    ];

    const preguntasBipolaridad = [
        "¿Experimentas cambios extremos en tu estado de ánimo, pasando de muy feliz a muy triste rápidamente?",
        "¿Sientes que tienes mucha energía incluso cuando deberías descansar?",
        "¿Te cuesta controlar pensamientos acelerados o te saltas de una idea a otra?",
        "¿Has tenido periodos donde te sientes irritable o agresivo sin razón clara?",
        "¿A veces tienes dificultad para dormir, aunque no te sientas cansado?",
        "¿En ocasiones sientes que tus habilidades son superiores a las de los demás?",
        "¿Has hecho gastos impulsivos o decisiones riesgosas que después lamentaste?",
        "¿Has experimentado momentos donde te sientes muy optimista pero luego te desplomas?",
        "¿Te cuesta mantener la concentración por largos periodos?",
        "¿Tu comportamiento a veces cambia tanto que otras personas lo notan y te preguntan qué pasa?"
    ];

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
      <div className="">
        <div className="flex justify-between items-center px-8 py-6 bg-gray-50">
          <h1 className="text-4xl font-extrabold text-gray-800">Bienvenido a PSICOWEB</h1>
          <Button
            type="submit"
            variant="danger"
            className="auth-btn logout-btn"
            onClick={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>

        <div className="flex justify-center mt-12 space-x-4">
          <Button
            type="submit"
            variant="primary"
            className="auth-btn"
            onClick={handleDisponibilidad}
          >
            Ver disponibilidad de psicólogos
          </Button>

          <Button
            type="button"
            variant="primary"
            className="auth-btn"
            onClick={() => {
              const datosGuardados = JSON.parse(localStorage.getItem(`resultadosTests_${email}`)) || [];
              setResultadosTests(datosGuardados);
              setMostrarResultados(true);
            }}
          >
            Ver resultados de los tests
          </Button>
        </div>

        <TestMenu onSelectTest={setTestSeleccionado} />
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
