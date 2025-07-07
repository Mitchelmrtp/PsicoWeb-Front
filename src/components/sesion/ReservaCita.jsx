import React, { useState, useEffect } from "react";
import StepDisponibilidad from "../Calendario/StepDisponibilidad";
import { useNavigate } from "react-router-dom";
import StepDatosPago from "../auth/StepDatosPagos";
import SidebarManager from "../dashboard/SidebarManager";
import PaymentReceipt from "../payment/PaymentReceipt";
import { useAuth } from "../../hooks/useAuth";
import { usePagos } from "../../hooks/usePagos";
import { toast } from "react-toastify";
import { ENDPOINTS, getAuthHeader } from "../../config/api";

const ReservaCita = () => {
  const [step, setStep] = useState(1);
  const [reservaData, setReservaData] = useState({});
  const [loading, setLoading] = useState(false);
  const [psicologos, setPsicologos] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [pagoData, setPagoData] = useState(null);
  const [comprobanteData, setComprobanteData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('tarjeta');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    procesarPago, 
    procesarPagoConSesion,
    verificarEstado, 
    confirmarPago, 
    generarComprobante,
    loading: pagoLoading 
  } = usePagos();

  // Fetch psychologists when component mounts
  useEffect(() => {
    fetchPsicologos();
  }, []);

  // Fetch psychologists from backend
  const fetchPsicologos = async () => {
    try {
      const response = await fetch(ENDPOINTS.PSICOLOGOS, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('No se pudieron cargar los psicólogos');
      }

      const data = await response.json();
      // Processing psychologist data from API
      
      // Handle the new Clean Architecture response structure
      const psicologosArray = data.data || data;
      
      // Format the psychologist data properly
      const formattedPsicologos = psicologosArray.map(psicologo => {
        let displayName = 'Psicólogo';
        
        // Extract name from correct data structure
        if (psicologo.User) {
          // First try to use name field
          if (psicologo.User.name) {
            displayName = `Psic. ${psicologo.User.name}`;
          }
          // Fall back to first_name and last_name
          else if (psicologo.User.first_name || psicologo.User.last_name) {
            const firstName = psicologo.User.first_name || '';
            const lastName = psicologo.User.last_name || '';
            displayName = `Psic. ${firstName} ${lastName}`;
          }
        } else if (psicologo.first_name || psicologo.last_name) {
          const firstName = psicologo.first_name || '';
          const lastName = psicologo.last_name || '';
          displayName = `Psic. ${firstName} ${lastName}`;
        } else if (psicologo.name) {
          displayName = `Psic. ${psicologo.name}`;
        }
        
        return {
          ...psicologo,
          displayName: displayName.trim()
        };
      });
      
      setPsicologos(formattedPsicologos);
    } catch (error) {
      console.error('Error fetching psychologists:', error);
      setError('No se pudieron cargar los psicólogos');
    } finally {
      setLoading(false);
    }
  };

  // Function to create session in backend
  const createSesion = async (sessionData) => {
    try {
      setLoading(true);
      
      // Log the exact data being sent
      // Sending session data to API
      
      const response = await fetch(ENDPOINTS.SESIONES, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(sessionData),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error("API error response:", responseData);
        
        // Extract detailed validation errors if available
        if (responseData.errors) {
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, message]) => `${field}: ${message}`)
            .join(", ");
          throw new Error(`Validation errors: ${errorMessages}`);
        }
        
        throw new Error(responseData.message || 'Error al crear la cita');
      }

      return responseData;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Handle final confirmation and create session in backend with payment integration
  const handleConfirm = async (paymentData) => {
    const { method: paymentMethod, monto, montoImpuestos, montoTotal } = paymentData;
    try {
      // Validate user
      const userId = user?.userId || user?.id;
      if (!userId) {
        toast.error("Debe iniciar sesión para reservar una cita");
        return;
      }

      if (!reservaData.psicologoId) {
        toast.error("Por favor seleccione un psicólogo");
        return;
      }

      // Parse time from "08:00am" format to "08:00:00" format
      const parseTime = (timeStr) => {
        // Extract hour and minute
        const timeParts = timeStr.match(/(\d+):(\d+)([ap]m)/i);
        if (!timeParts) return null;
        
        let hour = parseInt(timeParts[1]);
        const minute = parseInt(timeParts[2]);
        const isPM = timeParts[3].toLowerCase() === 'pm';
        
        // Convert to 24-hour format if PM
        if (isPM && hour !== 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        
        return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
      };

      const horaInicio = parseTime(reservaData.time);
      if (!horaInicio) {
        toast.error("Formato de hora inválido");
        return;
      }

      // Calculate end time (assuming 1 hour sessions)
      const [startHour, startMinute] = horaInicio.split(':').map(Number);
      const endHour = (startHour + 1) % 24; // Add 1 hour, wrap around 24
      const horaFin = `${endHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}:00`;

      // Format the date as YYYY-MM-DD
      const fecha = reservaData.date.toISOString().split('T')[0];

      // Prepare data for payment and session creation
      const requestData = {
        // Payment data - usando valores dinámicos del psicólogo
        monto: monto,
        montoImpuestos: montoImpuestos,
        montoTotal: montoTotal,
        metodoPago: paymentMethod,
        descripcion: `Sesión con ${reservaData.psicologoNombre} - ${fecha} ${reservaData.time}`,
        // Session data
        idPsicologo: reservaData.psicologoId,
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin
      };

      console.log('Enviando datos para pago y sesión:', requestData);
      toast.info("Procesando pago y creando cita...");
      
      // Process payment and create session in one transaction
      const resultado = await procesarPagoConSesion(requestData);
      console.log('Resultado completo:', resultado);

      // Check if payment was processed successfully
      // For cash and transfer payments, they start as 'pendiente' and that's acceptable
      // For card and PayPal, they should be 'completado'
      const paymentSuccess = (
        resultado.pago && (
          resultado.pago.estado === 'completado' || 
          resultado.pago.estado === 'procesado' || 
          resultado.pago.estado === 'confirmado' ||
          (resultado.pago.estado === 'pendiente' && ['efectivo', 'transferencia'].includes(resultado.pago.metodoPago))
        )
      );

      if (paymentSuccess) {
        setPagoData(resultado.pago);

        // Generate receipt
        try {
          const comprobante = await generarComprobante(resultado.pago.id);
          setComprobanteData(comprobante);
        } catch (comprob_error) {
          console.warn('No se pudo generar el comprobante, pero el pago fue exitoso:', comprob_error);
        }
        
        setBookingSuccess(true);
        
        // Different success messages based on payment method
        if (resultado.pago.metodoPago === 'efectivo') {
          toast.success("¡Cita reservada! El pago en efectivo se confirmará en el consultorio.");
        } else if (resultado.pago.metodoPago === 'transferencia') {
          toast.success("¡Cita reservada! El pago por transferencia se confirmará cuando se reciba.");
        } else {
          toast.success("¡Cita reservada y pago procesado exitosamente!");
        }

        // Wait 3 seconds before redirecting to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        const estado = resultado.pago?.estado || 'desconocido';
        toast.error(`Error en el procesamiento del pago: ${estado}. Por favor, inténtelo de nuevo.`);
      }
      
    } catch (error) {
      console.error("Error in booking confirmation:", error);
      
      // More specific error handling
      if (error.message.includes('pago') || error.message.includes('payment')) {
        toast.error(`Error en el pago: ${error.message}`);
      } else if (error.message.includes('sesión') || error.message.includes('session')) {
        toast.error(`Error al crear la cita: ${error.message}`);
      } else {
        toast.error(`Error al procesar la solicitud: ${error.message}`);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarManager />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-indigo-900">
            Reservar Cita
          </h1>

          {bookingSuccess ? (
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="text-center mb-6">
                <div className="text-green-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-800">¡Cita Reservada y Pago Procesado!</h2>
                <p className="text-gray-600 mb-6">
                  Su cita ha sido programada exitosamente
                </p>
              </div>

              <PaymentReceipt 
                pagoData={pagoData}
                comprobanteData={comprobanteData}
                citaData={reservaData}
              />
              
              <div className="text-center mt-6">
                <p className="text-sm text-gray-500">Redirigiendo al panel principal...</p>
                <div className="mt-4">
                  <button 
                    onClick={() => navigate("/dashboard")}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Ir al Dashboard
                  </button>
                </div>
              </div>
            </div>
          ) : step === 1 ? (
            <StepDisponibilidad
              psicologos={psicologos}
              onNext={(data) => {
                setReservaData(data);
                setStep(2);
              }}
            />
          ) : (
            <StepDatosPago
              citaData={reservaData}
              onBack={() => setStep(1)}
              onConfirm={handleConfirm}
              loading={loading || pagoLoading}
              onPaymentMethodChange={setSelectedPaymentMethod}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservaCita;