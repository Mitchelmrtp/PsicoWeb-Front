import React, { useState } from "react";
import MyCalendar from "../Calendario/Calendar";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const StepDisponibilidad = ({ onNext }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [descripcion, setDescripcion] = useState("");

  const navigate = useNavigate();

  const horarios = [
    "08:00am",
    "09:00am",
    "10:00am",
    "11:00am",
    "12:00pm",
    "02:00pm",
    "03:00pm",
    "04:00pm",
    "05:00pm",
  ];

  const eventosSeleccionados =
    selectedDate && selectedTime
      ? [
          {
            title: `Cita: ${selectedTime}`,
            start: new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              parseInt(selectedTime.split(":")[0]) +
                (selectedTime.includes("pm") &&
                selectedTime.split(":")[0] !== "12"
                  ? 12
                  : 0),
              parseInt(selectedTime.split(":")[1])
            ),
            end: new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              parseInt(selectedTime.split(":")[0]) +
                (selectedTime.includes("pm") &&
                selectedTime.split(":")[0] !== "12"
                  ? 12
                  : 0) +
                1,
              parseInt(selectedTime.split(":")[1])
            ),
          },
        ]
      : [];

  const handleNext = () => {
    if (selectedDate && selectedTime) {
      onNext({
        date: selectedDate.toDateString(),
        time: selectedTime,
        descripcion,
      });
    } else {
      alert("Por favor selecciona una fecha y una hora.");
    }
  };

  return (
    <div className="grid grid-cols-3 bg-white rounded-xl shadow-md p-8 gap-8">
      <div className="col-span-1 space-y-6 text-gray-700 border-r pr-8">
        <button
          onClick={() => navigate("/PagPrincipal")}
          className="text-gray-600"
        >
          ← Volver
        </button>
        <p>👨‍⚕️ Dr. Steven John</p>
        <p>⏱️ 60 min</p>
        <p>💻 Sesión vía Zoom</p>
        <p>📝 Diagnóstico</p>
        <div>
          <label className="text-blue-600 font-medium">
            Describe tu problema
          </label>
          <textarea
            className="w-full mt-2 p-4 border rounded-lg"
            rows={5}
            placeholder="Escribe aquí ..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>
      </div>

      <div className="col-span-2 pl-8">
        <h2 className="text-xl font-semibold mb-4">Selecciona Fecha y Hora</h2>
        <MyCalendar
          events={eventosSeleccionados}
          onSelectDate={setSelectedDate}
        />

        {selectedDate && (
          <>
            <p className="text-gray-700 mt-4">
              Horarios disponibles para:{" "}
              <strong>{selectedDate.toDateString()}</strong>
            </p>
            <div className="grid grid-cols-3 gap-3 mt-2">
              {horarios.map((hora) => (
                <button
                  key={hora}
                  onClick={() => setSelectedTime(hora)}
                  className={`border px-4 py-2 rounded ${
                    selectedTime === hora
                      ? "bg-blue-500 text-white"
                      : "hover:bg-blue-100"
                  }`}
                >
                  {hora}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="flex justify-end mt-8">
          <Button variant="primary" onClick={handleNext}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepDisponibilidad;
