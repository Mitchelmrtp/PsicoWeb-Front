import React, { useState } from "react";
import StepDisponibilidad from "../Calendario/StepDisponibilidad";
import { useNavigate } from "react-router-dom";
import StepDatosPago from "./StepDatosPagos";

const ReservaCita = () => {
  const [step, setStep] = useState(1);
  const [reservaData, setReservaData] = useState({});
  const navigate = useNavigate();

  const handleConfirm = () => {
    alert("Cita confirmada");
    navigate("/pagprincipal");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {step === 1 && (
        <StepDisponibilidad
          onNext={(data) => {
            setReservaData(data);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <StepDatosPago
          citaData={reservaData}
          onBack={() => setStep(1)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
};

export default ReservaCita;
