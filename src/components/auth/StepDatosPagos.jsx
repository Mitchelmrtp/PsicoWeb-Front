import React, { useState } from "react";
import Button from "../common/Button";

const StepDatosPago = ({ citaData, onBack, onConfirm }) => {
  const [showModal, setShowModal] = useState(false);

  const handleConfirm = () => {
    setShowModal(true);
  };

  const handleOk = () => {
    setShowModal(false);
    onConfirm();
  };

  return (
    <>
      <div className="grid grid-cols-3 bg-white rounded-xl shadow-md p-8 gap-8">
        <div className="col-span-1 space-y-6 text-gray-700 border-r pr-8">
          <button onClick={onBack} className="text-gray-600">
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
              readOnly
              value={citaData.descripcion}
            />
          </div>
        </div>

        <div className="col-span-2 pl-8 space-y-6">
          <h2 className="text-xl font-semibold">Detalles de Cita</h2>
          <p>
            <strong>Fecha:</strong> {citaData.date}
          </p>
          <p>
            <strong>Hora:</strong> {citaData.time}
          </p>

          <div>
            <label>Nombre del Paciente</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              defaultValue="steve.madden@gmail.com"
            />
          </div>

          <div>
            <label>Teléfono</label>
            <div className="flex border rounded overflow-hidden">
              <span className="p-2 bg-gray-100 border-r">🇵🇪 +51</span>
              <input
                type="tel"
                className="flex-1 p-2"
                placeholder="Ingresar número"
              />
            </div>
          </div>

          <div>
            <label>Diagnóstico</label>
            <select className="w-full border p-2 rounded">
              <option>Ansiedad</option>
              <option>Depresión</option>
              <option>Estrés</option>
            </select>
          </div>

          <div>
            <label>Método de Pago</label>
            <div className="space-y-2 mt-2">
              <label>
                <input type="radio" name="pago" defaultChecked /> Yape
              </label>
              <br />
              <label>
                <input type="radio" name="pago" /> Tarjeta
              </label>
              <br />
              <label>
                <input type="radio" name="pago" /> Credit Card
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="primary" onClick={handleConfirm}>
              Confirmar
            </Button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-8 rounded-xl shadow-xl text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">✅ Bien hecho</h2>
            <p className="text-gray-700">¡Cita confirmada!</p>
            <Button variant="primary" onClick={handleOk}>
              OK
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default StepDatosPago;
