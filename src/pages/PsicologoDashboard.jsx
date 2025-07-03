import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { toast } from 'react-toastify';
import { format, parseISO, addMinutes, addHours } from 'date-fns';
import { es } from 'date-fns/locale';
import SidebarManager from '../components/dashboard/SidebarManager';
import PatientsList from '../components/dashboard/PatientsList';

const PsicologoDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('próximas');
  const [today] = useState(new Date());
  
  // New state for patients
  const [patients, setPatients] = useState([]);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [patientsError, setPatientsError] = useState(null);
  
  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        
        // Get current date in YYYY-MM-DD format for filtering
        const todayFormatted = format(today, 'yyyy-MM-dd');
        
        // API request based on selected tab
        let endpoint = ENDPOINTS.SESIONES;
        if (activeTab === 'próximas') {
          endpoint += `?startDate=${todayFormatted}&estado=programada`;
        } else if (activeTab === 'pasadas') {
          endpoint += `?endDate=${todayFormatted}&estado=completada`;
        } else if (activeTab === 'canceladas') {
          endpoint += `?estado=cancelada`;
        }
        
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
        
        const data = await response.json();
        console.log('Appointment data from backend:', data);
        
        // Handle the new Clean Architecture response structure
        const appointmentsArray = data.data || data; // Extract the actual data array
        
        // Format appointments for UI
        const formattedAppointments = appointmentsArray.map(appointment => {
          const startDate = parseISO(`${appointment.fecha}T${appointment.horaInicio}`);
          const endDate = appointment.horaFin 
            ? parseISO(`${appointment.fecha}T${appointment.horaFin}`)
            : addHours(startDate, 1);
            
          // Get patient name from nested objects
          const patientName = appointment.Paciente && appointment.Paciente.User
            ? `${appointment.Paciente.User.first_name || ''} ${appointment.Paciente.User.last_name || ''}`.trim()
            : appointment.Paciente
              ? `${appointment.Paciente.first_name || ''} ${appointment.Paciente.last_name || ''}`.trim()
              : 'Paciente';
              
          return {
            id: appointment.id,
            patient: patientName,
            date: startDate,
            endTime: endDate,
            status: appointment.estado,
            progressLink: `/pacientes/${appointment.idPaciente}/progreso`,
            documentsLink: `/pacientes/${appointment.idPaciente}/documentos`,
            pacienteId: appointment.idPaciente
          };
        });
        
        // Sort by date
        formattedAppointments.sort((a, b) => {
          if (activeTab === 'próximas') {
            return a.date - b.date;  // ascending for upcoming
          } else {
            return b.date - a.date;  // descending for past/canceled
          }
        });
        
        setAppointments(formattedAppointments);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('No se pudieron cargar las citas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [activeTab, today, user.id]);
  
  // New useEffect to fetch patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoadingPatients(true);
        setPatientsError(null);
        
        const response = await fetch(ENDPOINTS.PSICOLOGO_PACIENTES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar los pacientes');
        }
        
        const data = await response.json();
        console.log('Patient data from backend:', data);
        
        // Handle the new Clean Architecture response structure
        const patientsArray = data.data || data; // Extract the actual data array
        
        // Process patient data
        const processedPatients = patientsArray.map(patient => ({
          id: patient.id,
          first_name: patient.first_name,
          last_name: patient.last_name,
          email: patient.email,
          diagnostico: patient.diagnostico || 'Sin diagnóstico registrado',
          lastAppointment: patient.lastAppointment || null
        }));
        
        setPatients(processedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setPatientsError('No se pudieron cargar los pacientes');
        toast.error('Error al cargar los pacientes');
      } finally {
        setLoadingPatients(false);
      }
    };
    
    fetchPatients();
  }, [user.id]);

  const formatDate = (date) => {
    return format(date, 'EEE d', { locale: es }).replace('.', '');
  };
  
  const formatTime = (date) => {
    return format(date, 'HH:mm', { locale: es });
  };
  
  const groupAppointmentsByMonth = (appointments) => {
    return appointments.reduce((groups, appointment) => {
      const monthYear = format(appointment.date, 'MMMM yyyy', { locale: es });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      
      groups[monthYear].push(appointment);
      return groups;
    }, {});
  };
  
  const startNewAppointment = () => {
    navigate('/nueva-cita');
  };
  
  const handleChangeMonth = (e) => {
    // Este handler se puede implementar para filtrar por mes
    console.log('Mes seleccionado:', e.target.value);
  };

  const handleViewAppointment = (appointment) => {
    navigate(`/citas/${appointment.id}`);
  };

  const handleEditAppointment = (appointment) => {
    navigate(`/citas/${appointment.id}/editar`);
  };
  
  const handleStartConsultation = (appointment) => {
    navigate(`/consultas-online/${appointment.id}`);
  };
  
  const groupedAppointments = groupAppointmentsByMonth(appointments);
  
  return (
    <div className="flex h-screen">
      <SidebarManager />
      
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">Hola, {user?.name || user?.first_name}</h1>
            <h2 className="text-2xl font-bold">Reservaciones</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <div className="flex items-center space-x-2">
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
              <span className="font-medium">{user?.name || user?.first_name}</span>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 border-b">
              <button 
                className={`pb-2 px-1 ${activeTab === 'próximas' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('próximas')}
              >
                Próximas
              </button>
              <button 
                className={`pb-2 px-1 ${activeTab === 'pasadas' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('pasadas')}
              >
                Pasadas
              </button>
              <button 
                className={`pb-2 px-1 ${activeTab === 'canceladas' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('canceladas')}
              >
                Canceladas
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  defaultValue={format(today, 'MMM yy', { locale: es })}
                  onChange={handleChangeMonth}
                >
                  {[...Array(12)].map((_, i) => {
                    const date = new Date(today.getFullYear(), today.getMonth() - 3 + i, 1);
                    return (
                      <option key={i} value={format(date, 'yyyy-MM')}>
                        {format(date, 'MMM yy', { locale: es })}
                      </option>
                    );
                  })}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              
              <button 
                onClick={startNewAppointment}
                className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                + Nueva Cita
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay citas {activeTab}</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'próximas' 
                  ? 'No tienes citas programadas próximamente'
                  : activeTab === 'pasadas'
                    ? 'No tienes citas pasadas'
                    : 'No tienes citas canceladas'}
              </p>
              {activeTab === 'próximas' && (
                <button
                  onClick={startNewAppointment}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Programar nueva cita
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedAppointments).map(([monthYear, appointments]) => (
                <div key={monthYear}>
                  <h3 className="text-lg font-medium mb-4 capitalize">{monthYear}</h3>
                  
                  <div className="space-y-4">
                    {appointments.map(appointment => (
                      <div 
                        key={appointment.id}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-50 rounded-lg">
                              <span className="text-xs text-gray-500 uppercase">
                                {formatDate(appointment.date).split(' ')[0]}
                              </span>
                              <span className="text-xl font-bold">
                                {appointment.date.getDate()}
                              </span>
                            </div>
                            
                            <div className="ml-4">
                              <div className="flex items-center space-x-2">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-gray-600">
                                  {formatTime(appointment.date)} - {formatTime(appointment.endTime)}
                                </span>
                              </div>
                              
                              <div className="mt-1 flex items-center space-x-2">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-gray-600">{appointment.patient}</span>
                                <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                  appointment.status === 'programada' 
                                    ? 'bg-green-50 text-green-700' 
                                    : appointment.status === 'completada'
                                      ? 'bg-blue-50 text-blue-700'
                                      : 'bg-red-50 text-red-700'
                                }`}>
                                  {appointment.status === 'programada' 
                                    ? 'Programada' 
                                    : appointment.status === 'completada'
                                      ? 'Completada'
                                      : 'Cancelada'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            {appointment.status === 'programada' && (
                              <button
                                onClick={() => handleStartConsultation(appointment)}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-md text-sm hover:bg-green-200 transition-colors"
                              >
                                Iniciar Consulta
                              </button>
                            )}
                            
                            {appointment.progressLink && (
                              <a 
                                href={appointment.progressLink}
                                className="text-blue-500 hover:underline text-sm"
                              >
                                Ver Progreso
                              </a>
                            )}
                            
                            {appointment.documentsLink && (
                              <a 
                                href={appointment.documentsLink}
                                className="text-blue-500 hover:underline text-sm"
                              >
                                Documentos
                              </a>
                            )}
                            
                            <button 
                              onClick={() => handleViewAppointment(appointment)}
                              className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                              title="Ver detalles"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            
                            {appointment.status === 'programada' && (
                              <button 
                                onClick={() => handleEditAppointment(appointment)}
                                className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                title="Editar cita"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* New Patients section */}
          <section className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Mis Pacientes</h3>
              <button 
                onClick={() => navigate('/pacientes')}
                className="text-blue-600 hover:underline flex items-center text-sm"
              >
                Ver Todos
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <PatientsList 
              patients={patients}
              loading={loadingPatients}
              error={patientsError}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default PsicologoDashboard;