import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import TestMenu from "./TestMenu";
import TestForm from "./TestForm";

export const PagPrincipal = () => {
    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();
        navigate('/login');
    };

    const handleDisponibilidad = (e) => {
        e.preventDefault();
        navigate('/Disponibilidad');
    };

    // Estado para saber qué test está activo
    const [testSeleccionado, setTestSeleccionado] = useState(null);

    // Define aquí tus preguntas para cada test (puedes externalizar luego)
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
                <div className="flex justify-center mt-12">
                    <Button
                        type="submit"
                        variant="primary"
                        className="auth-btn"
                        onClick={handleDisponibilidad}
                    >
                        Ver disponibilidad de psicólogos
                    </Button>
                </div>

                {/* Aquí mostramos el menú de selección de tests */}
                <TestMenu onSelectTest={setTestSeleccionado} />
            </div>
        );
    }

    // Si ya se seleccionó un test, mostramos el formulario con sus preguntas
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
            {/* Botón para regresar al menú */}
            <Button
                variant="secondary"
                className="mb-6"
                onClick={() => setTestSeleccionado(null)}
            >
                ← Volver al menú de tests
            </Button>

            {/* Formulario del test */}
            <TestForm preguntas={preguntasActuales} onBack={() => setTestSeleccionado(null)} />
        </div>
    );
};
