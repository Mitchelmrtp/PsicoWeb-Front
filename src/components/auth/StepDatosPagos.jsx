import React, { useState } from "react";
import Button from "../ui/Button";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StepDatosPago = ({ citaData, onBack, onConfirm, loading }) => {
  const [paymentMethod, setPaymentMethod] = useState("tarjeta");
  
  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'EEEE d MMMM yyyy', { locale: es });
  };

  // Handle submission - payment info is collected but not sent to backend yet
  const handleSubmit = () => {
    // We're proceeding without sending payment info to backend
    onConfirm();
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8">
      <h2 className="text-xl font-semibold mb-6">Confirmar Reserva</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium text-lg mb-4">Detalles de la Cita</h3>
          
          <div className="bg-indigo-50 p-4 rounded-lg mb-6">
            <p className="mb-2">
              <span className="font-medium">Psicólogo:</span> {citaData.psicologoNombre}
            </p>
            <p className="mb-2">
              <span className="font-medium">Fecha:</span> {citaData.date ? formatDate(citaData.date) : ''}
            </p>
            <p className="mb-2">
              <span className="font-medium">Hora:</span> {citaData.time}
            </p>
            <p className="mb-2">
              <span className="font-medium">Duración:</span> 60 minutos
            </p>
            
            {citaData.descripcion && (
              <div className="mt-4">
                <p className="font-medium">Descripción:</p>
                <p className="text-sm mt-1 text-gray-700">{citaData.descripcion}</p>
              </div>
            )}
          </div>
          
          <h3 className="font-medium text-lg mb-4">Método de Pago <span className="text-xs text-gray-500">(Para implementación futura)</span></h3>
          
          <div className="space-y-3">
            <div onClick={() => setPaymentMethod("tarjeta")} className={`border rounded-lg p-3 flex items-center cursor-pointer ${paymentMethod === 'tarjeta' ? 'border-blue-500' : 'border-gray-300'}`}>
              <input
                type="radio"
                checked={paymentMethod === "tarjeta"}
                onChange={() => setPaymentMethod("tarjeta")}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Tarjeta de crédito/débito</div>
                <div className="text-xs text-gray-500">Visa, Mastercard, American Express</div>
              </div>
            </div>
            
            <div onClick={() => setPaymentMethod("paypal")} className={`border rounded-lg p-3 flex items-center cursor-pointer ${paymentMethod === 'paypal' ? 'border-blue-500' : 'border-gray-300'}`}>
              <input
                type="radio"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="mr-3"
              />
              <div>
                <div className="font-medium">PayPal</div>
                <div className="text-xs text-gray-500">Pago seguro con tu cuenta PayPal</div>
              </div>
            </div>
            
            <div onClick={() => setPaymentMethod("efectivo")} className={`border rounded-lg p-3 flex items-center cursor-pointer ${paymentMethod === 'efectivo' ? 'border-blue-500' : 'border-gray-300'}`}>
              <input
                type="radio"
                checked={paymentMethod === "efectivo"}
                onChange={() => setPaymentMethod("efectivo")}
                className="mr-3"
              />
              <div>
                <div className="font-medium">Pago en consultorio</div>
                <div className="text-xs text-gray-500">Pago en efectivo al momento de la consulta</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Nota:</span> El sistema de pagos está siendo implementado. Por el momento, las citas se agendarán sin procesar el pago.
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-lg mb-4">Resumen del Pago</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span>Sesión terapéutica (60 min)</span>
              <span>$50.00</span>
            </div>
            
            <div className="flex justify-between py-2 border-b border-gray-200">
              <span>Impuestos</span>
              <span>$5.00</span>
            </div>
            
            <div className="flex justify-between py-3 font-bold">
              <span>Total</span>
              <span>$55.00</span>
            </div>
          </div>
          
          <div className="mt-6 space-y-4 text-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <p className="ml-2">El pago es seguro y encriptado</p>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="ml-2">Puedes cancelar la cita hasta 24 horas antes sin cargo</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={onBack}>
          Atrás
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Procesando...' : 'Confirmar Reserva'}
        </Button>
      </div>
    </div>
  );
};

export default StepDatosPago;
