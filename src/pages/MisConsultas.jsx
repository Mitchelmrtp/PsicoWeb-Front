import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SidebarManager from '../components/dashboard/SidebarManager';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { toast } from 'react-toastify';
import { format, parseISO, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameDay, isSameMonth, addMonths, subMonths } from 'date-fns';
import { es } from 'date-fns/locale';

const MisConsultas = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('programadas');
  
  // Estado para el calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('month'); // 'month' o 'week'
  
  // Fetch patient's appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);
        
        // Determinar el endpoint según la tab activa
        let endpoint = ENDPOINTS.SESIONES;
        if (activeTab === 'programadas') {
          const today = new Date().toISOString().split('T')[0];
          endpoint = `${ENDPOINTS.SESIONES}?startDate=${today}&estado=programada`;
        } else if (activeTab === 'completadas') {
          endpoint = `${ENDPOINTS.SESIONES}?estado=completada`;
        } else if (activeTab === 'canceladas') {
          endpoint = `${ENDPOINTS.SESIONES}?estado=cancelada`;
        }
        
        // Fetch appointments
        const response = await fetch(endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar las citas');
        }

        const responseData = await response.json();
        console.log('Appointment data from backend:', responseData);
        
        // Handle both array and { data: Array } response formats
        const appointments = Array.isArray(responseData) ? responseData : (responseData.data || []);
        
        // Map backend data to the format expected by our UI
        const formattedAppointments = appointments
          .filter(appointment => {
            // Filtrar según rol del usuario
            if (user.role === 'psicologo') {
              return appointment.idPsicologo === user.id;
            } else {
              return appointment.idPaciente === user.id;
            }
          })
          .map(appointment => {
            // Get psychologist name from nested objects
            let doctorName = 'Psicólogo Asignado';

            if (appointment.Psicologo) {
              if (appointment.Psicologo.User) {
                const firstName = appointment.Psicologo.User.first_name || '';
                const lastName = appointment.Psicologo.User.last_name || '';
                if (firstName || lastName) {
                  doctorName = `Psic. ${firstName} ${lastName}`;
                } else if (appointment.Psicologo.User.name) {
                  doctorName = `Psic. ${appointment.Psicologo.User.name}`;
                }
              } else if (appointment.Psicologo.first_name || appointment.Psicologo.last_name) {
                const firstName = appointment.Psicologo.first_name || '';
                const lastName = appointment.Psicologo.last_name || '';
                doctorName = `Psic. ${firstName} ${lastName}`;
              }
            }
            
            // Get patient name from nested objects
            const patientName = appointment.Paciente && appointment.Paciente.User
              ? `${appointment.Paciente.User.first_name || ''} ${appointment.Paciente.User.last_name || ''}`.trim()
              : appointment.Paciente
                ? `${appointment.Paciente.first_name || ''} ${appointment.Paciente.last_name || ''}`.trim()
                : 'Paciente';
                
            return {
              id: appointment.id,
              title: user.role === 'psicologo' ? patientName : doctorName,
              fecha: appointment.fecha,
              date: new Date(`${appointment.fecha}T${appointment.horaInicio}`),
              endTime: new Date(`${appointment.fecha}T${appointment.horaFin}`),
              estado: appointment.estado,
              psicologoId: appointment.idPsicologo,
              pacienteId: appointment.idPaciente
            };
          });
        
        setAppointments(formattedAppointments);
        setError(null);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('No se pudieron cargar las citas');
        toast.error('Error al cargar las citas');
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [activeTab, user.id, user.role]);

  // Helper para formatear la hora
  const formatTime = (date) => {
    return format(date, 'HH:mm', { locale: es });
  };
  
  // Helpers para el calendario
  const renderHeader = () => {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="flex items-center justify-between py-2">
        <h2 className="text-lg font-bold text-gray-900">
          {format(currentDate, dateFormat, { locale: es })}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="p-1 rounded-full hover:bg-gray-200"
            title="Mes anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 bg-gray-200 rounded-md hover:bg-gray-300"
            title="Hoy"
          >
            Hoy
          </button>
          <button
            onClick={nextMonth}
            className="p-1 rounded-full hover:bg-gray-200"
            title="Mes siguiente"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  };
  
  const renderDays = () => {
    const dateFormat = "EEE";
    const days = [];
    let startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="w-full p-1 text-center text-sm font-semibold text-gray-600" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: es })}
        </div>
      );
    }
    return <div className="grid grid-cols-7 mb-1">{days}</div>;
  };
  
  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
    
    const rows = [];
    let days = [];
    let day = startDate;
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        const formattedDate = format(cloneDay, 'yyyy-MM-dd');
        const dayAppointments = appointments.filter(a => 
          format(a.date, 'yyyy-MM-dd') === formattedDate
        );
        
        days.push(
          <div
            className={`relative min-h-[120px] p-1 border border-gray-200 ${
              !isSameMonth(day, monthStart) ? "bg-gray-100 text-gray-400" : 
              isSameDay(day, new Date()) ? "bg-blue-50" : "bg-white"
            }`}
            key={formattedDate}
          >
            <span className={`text-sm font-medium ${
              isSameDay(day, new Date()) ? "bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center" : ""
            }`}>
              {format(cloneDay, 'd')}
            </span>
            
            <div className="mt-1 max-h-[100px] overflow-y-auto">
              {dayAppointments.map(appointment => (
                <div 
                  key={appointment.id}
                  className={`mt-1 p-1 text-xs rounded ${
                    appointment.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                    appointment.estado === 'completada' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  } cursor-pointer`}
                  onClick={() => navigate(`/citas/${appointment.id}`)}
                >
                  <div className="font-semibold">{formatTime(appointment.date)}</div>
                  <div className="truncate">{appointment.title}</div>
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={format(day, 'yyyy-MM-dd')}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="mb-4">{rows}</div>;
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };
  
  // This function should be reused in any component that needs cancellation
  const cancelAppointment = async (appointmentId) => {
    // First, confirm with the user
    if (!window.confirm("¿Está seguro que desea cancelar esta cita?")) {
      return;
    }
    
    try {
      // Show loading state
      setLoadingAppointments(true);
      
      // Make API call to cancel the appointment
      const response = await fetch(`${ENDPOINTS.SESIONES}/${appointmentId}/cancelar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ 
          estado: 'cancelada'
        })
      });

      if (!response.ok) {
        throw new Error('Error al cancelar la cita');
      }

      // Successfully cancelled
      toast.success('La cita ha sido cancelada correctamente');
      
      // Refresh the appointments list
      fetchAppointments();
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      toast.error('No se pudo cancelar la cita. Por favor, intente nuevamente.');
    } finally {
      setLoadingAppointments(false);
    }
  };

  return (
    <div className="flex h-screen">
      <SidebarManager />
      
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">Hola, {user?.name || user?.first_name}</h1>
            <h2 className="text-2xl font-bold">Mis Consultas</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src="/assets/avatar.jpg" 
                alt="Profile" 
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${user?.name || user?.first_name}&background=random`;
                }}
              />
            </div>
            <span className="font-medium">{user?.name || `${user?.first_name} ${user?.last_name}`}</span>
          </div>
        </header>
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 border-b">
              <button 
                className={`pb-2 px-1 ${activeTab === 'programadas' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('programadas')}
              >
                Consultas Programadas
              </button>
              <button 
                className={`pb-2 px-1 ${activeTab === 'completadas' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('completadas')}
              >
                Completadas
              </button>
              <button 
                className={`pb-2 px-1 ${activeTab === 'canceladas' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('canceladas')}
              >
                Canceladas
              </button>
            </div>
            
            <button 
              onClick={() => navigate('/reserva')}
              className="bg-indigo-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-900 transition-colors"
            >
              Nueva Consulta
            </button>
          </div>
          
          {loadingAppointments ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
              {error}. Por favor intente de nuevo más tarde.
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h4 className="text-lg font-medium text-gray-700 mb-2">
                {activeTab === 'programadas' 
                  ? 'No tienes consultas programadas' 
                  : activeTab === 'completadas'
                    ? 'No tienes consultas completadas'
                    : 'No tienes consultas canceladas'
                }
              </h4>
              {activeTab === 'programadas' && (
                <>
                  <p className="text-gray-500 mb-4">Reserva una cita con uno de nuestros psicólogos profesionales</p>
                  <button 
                    onClick={() => navigate('/reserva')}
                    className="bg-indigo-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-900 transition-colors"
                  >
                    Reservar Consulta
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-4">
              {renderHeader()}
              {renderDays()}
              {renderCells()}
              
              <div className="mt-4 flex justify-center space-x-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-100 mr-1"></div>
                  <span className="text-xs">Programadas</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-100 mr-1"></div>
                  <span className="text-xs">Completadas</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-100 mr-1"></div>
                  <span className="text-xs">Canceladas</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Vista de agenda diaria (podría expandirse en futuras implementaciones) */}
          {appointments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Agenda Detallada</h3>
              <div className="bg-white rounded-lg shadow p-4">
                {format(currentDate, 'EEEE, d MMMM', { locale: es })}
                
                {appointments
                  .filter(app => isSameDay(app.date, currentDate))
                  .sort((a, b) => a.date - b.date)
                  .map(app => (
                    <div key={app.id} className="mt-2 p-3 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                      <div className="flex justify-between">
                        <span className="font-semibold">{formatTime(app.date)} - {formatTime(app.endTime)}</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          app.estado === 'programada' ? 'bg-blue-100 text-blue-800' :
                          app.estado === 'completada' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.estado}
                        </span>
                      </div>
                      <p className="mt-1">{app.title}</p>
                      
                      <div className="mt-2 flex space-x-2">
                        <button
                          onClick={() => navigate(`/citas/${app.id}`)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Ver detalle
                        </button>
                        
                        {app.estado === 'programada' && (
                          <>
                            <button
                              onClick={() => navigate(`/consultas-online/${app.id}`)}
                              className="text-sm text-green-600 hover:underline"
                            >
                              Unirse
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault(); // Prevent any parent click handlers
                                e.stopPropagation(); // Prevent any parent click handlers
                                cancelAppointment(app.id);
                              }}
                              className="text-sm text-red-600 hover:underline"
                            >
                              Cancelar
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                
                {appointments.filter(app => isSameDay(app.date, currentDate)).length === 0 && (
                  <p className="py-4 text-center text-gray-500">No hay consultas programadas para este día</p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MisConsultas;