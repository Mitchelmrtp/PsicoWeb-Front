import React, { useState, useEffect } from "react";
import StepDisponibilidad from "../Calendario/StepDisponibilidad";
import { useNavigate } from "react-router-dom";
import StepDatosPago from "../auth/StepDatosPagos";
import Sidebar from "../dashboard/Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";
import { ENDPOINTS, getAuthHeader } from "../../config/api";

const ReservaCita = () => {
  const [step, setStep] = useState(1);
  const [reservaData, setReservaData] = useState({});
  const [loading, setLoading] = useState(false);
  const [psicologos, setPsicologos] = useState([]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      console.log('Raw psychologist data from API:', data);
      
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
      console.log("Sending to API:", sessionData);
      
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

  // Handle final confirmation and create session in backend
  const handleConfirm = async () => {
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

      // Prepare session data for backend - removed notas field
      const sessionData = {
        idPsicologo: reservaData.psicologoId,
        idPaciente: userId,
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: horaFin,
        estado: "programada"
        // notas field has been removed
      };

      // Debug: Log the session data being sent
      console.log('Session data being sent:', sessionData);

      // Send to backend
      await createSesion(sessionData);
      
      setBookingSuccess(true);
      toast.success("¡Cita reservada exitosamente!");

      // Wait 2 seconds before redirecting to dashboard
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error(`Error al reservar la cita: ${error.message}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-indigo-900">
            Reservar Cita
          </h1>

          {bookingSuccess ? (
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="text-green-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">¡Cita Reservada Exitosamente!</h2>
              <p className="mb-6">Su cita ha sido programada con {reservaData.psicologoNombre} para el {reservaData.date?.toLocaleDateString()} a las {reservaData.time}</p>
              <p className="text-sm text-gray-500">Redirigiendo al panel principal...</p>
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
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservaCita;