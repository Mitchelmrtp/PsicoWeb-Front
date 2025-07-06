import React, { useState, useEffect } from "react";
import MyCalendar from "./Calendar";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { ENDPOINTS, getAuthHeader } from "../../config/api";
import { addDays, format, parseISO, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import disponibilidadService from "../../services/disponibilidadService";
import { toast } from "react-toastify";

const StepDisponibilidad = ({ psicologos = [], onNext }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [selectedPsicologo, setSelectedPsicologo] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [psicologoData, setPsicologoData] = useState(null);
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [existingAppointments, setExistingAppointments] = useState([]);
  
  const navigate = useNavigate();

  // When a psychologist is selected, fetch their availability
  useEffect(() => {
    if (selectedPsicologo) {
      // Find the selected psychologist object
      const selected = psicologos.find(p => p.id === selectedPsicologo);
      if (selected) {
        setPsicologoData(selected);
      }
      fetchPsicologoDisponibilidad(selectedPsicologo);
      fetchPsicologoAppointments(selectedPsicologo);
    }
  }, [selectedPsicologo, psicologos]);
  
  // Generate calendar events from availability data
  useEffect(() => {
    generateCalendarEvents();
  }, [disponibilidades, existingAppointments]);
  
  // When a date is selected, calculate available times for that day
  useEffect(() => {
    if (selectedDate && selectedPsicologo) {
      calculateAvailableTimesForDate(selectedDate);
    }
  }, [selectedDate, selectedPsicologo, disponibilidades, existingAppointments]);

  // Fetch the psychologist's existing appointments for the current week
  const fetchPsicologoAppointments = async (psicologoId) => {
    setLoading(true);
    try {
      const today = new Date();
      const start = format(startOfWeek(today), 'yyyy-MM-dd');
      const end = format(endOfWeek(addDays(today, 28)), 'yyyy-MM-dd'); // 4 weeks of appointments
      
      const response = await fetch(
        `${ENDPOINTS.SESIONES}?idPsicologo=${psicologoId}&startDate=${start}&endDate=${end}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al obtener citas existentes');
      }

      const data = await response.json();
      // Handle response that might be in { data: [...] } format or direct array
      const appointments = data.data ? data.data : (Array.isArray(data) ? data : []);
      setExistingAppointments(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setExistingAppointments([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a psychologist's availability
  const fetchPsicologoDisponibilidad = async (psicologoId) => {
    setLoading(true);
    try {
      // Using the new service method to get availability for specific psychologist
      const data = await disponibilidadService.getPsicologoDisponibilidad(psicologoId);
      setDisponibilidades(data);
      setAvailableTimes([]);
      setSelectedTime(null);
      
      // Generate calendar events from the fetched availability data
      if (data.length > 0) {
        generateCalendarEvents(data);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      toast.error("No se pudo cargar la disponibilidad del psicólogo");
    } finally {
      setLoading(false);
    }
  };
  
  // Generate calendar events from the psychologist's availability schedule
  const generateCalendarEvents = () => {
    if (!Array.isArray(disponibilidades) || disponibilidades.length === 0) {
      return;
    }

    const events = [];
    const today = new Date();
    const startWeek = startOfWeek(today);
    
    // Ensure existingAppointments is an array
    const appointments = Array.isArray(existingAppointments) ? existingAppointments : [];
    
    // Convert day names from Spanish to their numeric values
    const dayNameToNumber = {
      'DOMINGO': 0,
      'LUNES': 1,
      'MARTES': 2,
      'MIERCOLES': 3,
      'JUEVES': 4,
      'VIERNES': 5,
      'SABADO': 6
    };
    
    // Generate 4 weeks of availability
    for (let weekOffset = 0; weekOffset < 4; weekOffset++) {
      disponibilidades.forEach(disp => {
        if (!disp.activo) return;
        
        const dayNumber = dayNameToNumber[disp.diaSemana];
        if (dayNumber === undefined) return;
        
        // Calculate the specific date for this availability slot for this week
        const slotDate = addDays(startWeek, dayNumber + (weekOffset * 7));
        
        // Parse the start and end times
        const [startHour, startMinute] = disp.horaInicio.split(':').map(Number);
        const [endHour, endMinute] = disp.horaFin.split(':').map(Number);
        
        const start = new Date(slotDate);
        start.setHours(startHour, startMinute, 0);
        
        const end = new Date(slotDate);
        end.setHours(endHour, endMinute, 0);
        
        // Check if this time slot conflicts with any existing appointment
        const isBooked = appointments.some(appt => {
          const apptDate = new Date(appt.fecha);
          const sameDay = 
            apptDate.getDate() === slotDate.getDate() && 
            apptDate.getMonth() === slotDate.getMonth() && 
            apptDate.getFullYear() === slotDate.getFullYear();
            
          if (!sameDay) return false;
          
          const [apptStartHour, apptStartMinute] = appt.horaInicio.split(':').map(Number);
          const [apptEndHour, apptEndMinute] = appt.horaFin.split(':').map(Number);
          
          const apptStart = new Date(apptDate);
          apptStart.setHours(apptStartHour, apptStartMinute, 0);
          
          const apptEnd = new Date(apptDate);
          apptEnd.setHours(apptEndHour, apptEndMinute, 0);
          
          // Check for overlap
          return (start < apptEnd && end > apptStart);
        });
        
        // Add the event with appropriate styling based on availability
        events.push({
          title: isBooked ? 'Ocupado' : 'Disponible',
          start,
          end,
          allDay: false,
          className: isBooked ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800 cursor-pointer',
          isAvailable: !isBooked,
          // Store original time info for selection
          timeInfo: {
            startHour,
            startMinute,
            endHour,
            endMinute
          }
        });
      });
    }
    
    setCalendarEvents(events);
  };
  
  // Calculate available times for a specific date based on availability and existing appointments
  const calculateAvailableTimesForDate = async (date) => {
    if (!date || !selectedPsicologo) return;
    
    setLoading(true);
    try {
      // Get day of week from selected date (0 = Sunday, 1 = Monday, etc.)
      const dayOfWeek = date.getDay();
      const dayNames = ['DOMINGO', 'LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];
      const diaSemana = dayNames[dayOfWeek];
      
      // Filter disponibilidades for this day of week
      const dispsDelDia = Array.isArray(disponibilidades) 
        ? disponibilidades.filter(disp => disp.diaSemana === diaSemana && disp.activo)
        : [];
      
      if (dispsDelDia.length === 0) {
        setAvailableTimes([]);
        return;
      }

      // Format the date as YYYY-MM-DD for comparison
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Ensure existingAppointments is an array
      const appointments = Array.isArray(existingAppointments) ? existingAppointments : [];
      
      // Filter already booked appointments for this day
      const todaysAppointments = appointments.filter(appt => {
        return appt.fecha === formattedDate;
      });
      
      // Generate hourly slots from disponibilidades
      let availableSlots = [];
      
      dispsDelDia.forEach(disp => {
        // Extract hours and minutes
        const startParts = disp.horaInicio.split(':');
        const endParts = disp.horaFin.split(':');
        
        const startHour = parseInt(startParts[0]);
        const endHour = parseInt(endParts[0]);
        
        // Generate hourly slots
        for (let hour = startHour; hour < endHour; hour++) {
          const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
          
          // Check if this slot overlaps with any booked appointment
          const isBooked = todaysAppointments.some(appt => {
            const apptStart = appt.horaInicio.substring(0, 5); // "08:00"
            const apptEnd = appt.horaFin.substring(0, 5); // "09:00"
            return timeSlot >= apptStart && timeSlot < apptEnd;
          });
          
          if (!isBooked) {
            // Format the time as "08:00am" or "02:00pm"
            const ampm = hour >= 12 ? 'pm' : 'am';
            const displayHour = hour % 12 || 12;
            availableSlots.push(`${displayHour}:00${ampm}`);
          }
        }
      });
      
      setAvailableTimes(availableSlots);
    } catch (error) {
      console.error("Error calculating available times:", error);
      setAvailableTimes([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle click on a calendar event (for selecting available time slots directly from calendar)
  const handleEventClick = (event) => {
    if (event.isAvailable) {
      const date = event.start;
      setSelectedDate(date);
      
      // Format the time as "8:00am" or "2:00pm"
      const { startHour } = event.timeInfo;
      const hour = startHour % 12 || 12;
      const ampm = startHour >= 12 ? 'pm' : 'am';
      const timeStr = `${hour}:00${ampm}`;
      
      setSelectedTime(timeStr);
    }
  };

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
            className: 'bg-blue-500 text-white'
          },
        ]
      : [];

  const handleNext = () => {
    if (!selectedPsicologo) {
      alert("Por favor seleccione un psicólogo.");
      return;
    }
    
    if (selectedDate && selectedTime) {
      // Get the psychologist name properly from the data structure
      let psicologoName = 'Psicólogo';
      if (psicologoData) {
        if (psicologoData.User) {
          if (psicologoData.User.name) {
            psicologoName = psicologoData.User.name;
          } else if (psicologoData.User.first_name || psicologoData.User.last_name) {
            const firstName = psicologoData.User.first_name || '';
            const lastName = psicologoData.User.last_name || '';
            psicologoName = `${firstName} ${lastName}`.trim();
          }
        } else if (psicologoData.first_name || psicologoData.last_name) {
          const firstName = psicologoData.first_name || '';
          const lastName = psicologoData.last_name || '';
          psicologoName = `${firstName} ${lastName}`.trim();
        } else if (psicologoData.name) {
          psicologoName = psicologoData.name;
        } else if (psicologoData.displayName) {
          psicologoName = psicologoData.displayName.replace('Psic. ', '');
        }
      }
      
      onNext({
        psicologoId: selectedPsicologo,
        psicologoNombre: psicologoName,
        tarifaPorSesion: psicologoData?.tarifaPorSesion || 50.00, // Incluir tarifa del psicólogo
        psicologo: psicologoData, // Incluir objeto completo del psicólogo para referencia
        date: selectedDate,
        time: selectedTime,
        descripcion,
      });
    } else {
      alert("Por favor selecciona una fecha y una hora.");
    }
  };

  // Combine calendar events and selection
  const allEvents = [...calendarEvents, ...eventosSeleccionados];

  return (
    <div className="grid grid-cols-3 bg-white rounded-xl shadow-md p-8 gap-8">
      <div className="col-span-1 space-y-6 text-gray-700 border-r pr-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-gray-600 hover:text-gray-900"
        >
          ← Volver
        </button>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccione un Psicólogo
          </label>
          <select
            value={selectedPsicologo}
            onChange={(e) => setSelectedPsicologo(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Seleccionar psicólogo</option>
            {psicologos.map((psicologo) => {
              // Extract psychologist name correctly
              let displayName = 'Psicólogo';
              
              if (psicologo.User) {
                // First try to use name field
                if (psicologo.User.name) {
                  displayName = `${psicologo.User.name}`;
                }
                // Fall back to first_name and last_name
                else if (psicologo.User.first_name || psicologo.User.last_name) {
                  const firstName = psicologo.User.first_name || '';
                  const lastName = psicologo.User.last_name || '';
                  displayName = `${firstName} ${lastName}`;
                }
              } else if (psicologo.first_name || psicologo.last_name) {
                const firstName = psicologo.first_name || '';
                const lastName = psicologo.last_name || '';
                displayName = `${firstName} ${lastName}`;
              } else if (psicologo.name) {
                displayName = psicologo.name;
              }
              
              return (
                <option key={psicologo.id} value={psicologo.id}>
                  {`Psic. ${displayName.trim()}`}
                </option>
              );
            })}
          </select>
        </div>

        {selectedPsicologo && (
          <>
            <p>⏱️ 60 min</p>
            <p>💻 Sesión vía Zoom</p>
            <p>📝 {psicologoData?.especialidad || 'Diagnóstico'}</p>
          </>
        )}
        
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
        
        {!selectedPsicologo ? (
          <div className="text-center py-8 text-gray-500">
            Por favor, primero seleccione un psicólogo
          </div>
        ) : loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            <p className="mt-2">Cargando disponibilidad...</p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex gap-4 mb-2 items-center">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                  <span className="text-sm">Disponible</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-sm">Ocupado</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                  <span className="text-sm">Seleccionado</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Haz clic en un horario disponible para seleccionar</p>
            </div>
          
            <MyCalendar
              events={allEvents}
              onSelectDate={setSelectedDate}
              onEventClick={handleEventClick}
            />

            {selectedDate && (
              <>
                <p className="text-gray-700 mt-4">
                  <span className="font-medium">Fecha seleccionada:</span> {format(selectedDate, 'dd/MM/yyyy')}
                </p>
                {selectedTime && (
                  <p className="text-gray-700">
                    <span className="font-medium">Hora seleccionada:</span> {selectedTime}
                  </p>
                )}

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Horarios disponibles:</h3>
                  {availableTimes.length === 0 ? (
                    <div className="text-amber-600">
                      No hay horarios disponibles para este día
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {availableTimes.map((hora) => (
                        <button
                          key={hora}
                          onClick={() => setSelectedTime(hora)}
                          className={`border px-3 py-2 rounded text-sm ${
                            selectedTime === hora
                              ? "bg-blue-500 text-white"
                              : "hover:bg-blue-100"
                          }`}
                        >
                          {hora}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}

        <div className="flex justify-end mt-8">
          <Button 
            variant="primary" 
            onClick={handleNext} 
            disabled={!selectedDate || !selectedTime || !selectedPsicologo}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StepDisponibilidad;
