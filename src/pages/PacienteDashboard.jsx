import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SidebarManager from '../components/dashboard/SidebarManager';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { debugAuth } from '../utils/authDebug';
import { testAPI } from '../utils/apiTest';
import EmptyAppointments from '../components/common/EmptyAppointments';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PacienteDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recommendedPsychologists, setRecommendedPsychologists] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingPsychologists, setLoadingPsychologists] = useState(true);
  const [error, setError] = useState(null);
  
  // Debug authentication on component mount
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      debugAuth.runFullCheck();
      // Make test API available in console
      window.testAPI = testAPI;
      
      // Add debug function for patient dashboard
      window.debugPatientDashboard = async function() {
        console.log('🔍 Debugging Patient Dashboard...');
        
        // Check authentication
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        console.log('🔐 Auth Status:', {
          hasToken: !!token,
          tokenPreview: token ? token.substring(0, 20) + '...' : null,
          user: user
        });
        
        if (!token) {
          console.error('❌ No token found');
          return;
        }
        
        // Test API endpoint directly
        const today = new Date().toISOString().split('T')[0];
        const url = `${ENDPOINTS.SESIONES}?startDate=${today}&estado=programada`;
        
        console.log('📡 Testing API call:', url);
        
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          console.log('📡 Response status:', response.status);
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response:', data);
            console.log(`Found ${data.length} appointments`);
            
            // Process each appointment
            data.forEach((appointment, index) => {
              console.log(`📅 Appointment ${index + 1}:`, {
                id: appointment.id,
                fecha: appointment.fecha,
                horaInicio: appointment.horaInicio,
                horaFin: appointment.horaFin,
                estado: appointment.estado,
                psicologo: appointment.Psicologo ? {
                  id: appointment.Psicologo.id,
                  user: appointment.Psicologo.User
                } : null
              });
            });
          } else {
            const errorData = await response.json();
            console.error('❌ API Error:', errorData);
          }
        } catch (error) {
          console.error('❌ Request failed:', error);
        }
      };
      
      console.log('🛠️ Debug function loaded. Run window.debugPatientDashboard() to test');
    }
  }, []);
  
  // Check if backend is accessible
  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await fetch(`${ENDPOINTS.BASE_URL}/health`, { 
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
          console.warn('Backend health check failed:', response.status);
          toast.warning('La conexión con el servidor no es óptima');
        } else {
          const data = await response.json();
          console.log('Backend health check successful:', data);
        }
      } catch (err) {
        console.error('Backend connection failed:', err);
        toast.error('No se puede conectar con el servidor. Por favor, verifique que el servidor esté en funcionamiento.');
      }
    };
    
    checkBackendConnection();
  }, []);

  // Fetch patient's appointments from the backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoadingAppointments(true);
        setError(null);
        
        // Check if user is authenticated
        if (!user) {
          console.warn('User not authenticated, redirecting to login');
          navigate('/login');
          return;
        }
        
        // Get today's date in YYYY-MM-DD format for filtering
        const today = new Date().toISOString().split('T')[0];
        
        console.log('Fetching appointments for user:', user.id, 'starting from:', today);
        
        // Use direct fetch with getAuthHeader for consistency
        const response = await fetch(`${ENDPOINTS.SESIONES}?startDate=${today}&estado=programada`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            console.warn('Unauthorized, redirecting to login');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            navigate('/login');
            return;
          }
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Appointment data from backend:', data);
        console.log(`📊 Found ${data.length} appointments for patient`);
        
        if (data.length === 0) {
          console.log('ℹ️ No appointments found for this patient');
          setUpcomingAppointments([]);
          setError(null);
          setLoadingAppointments(false);
          return;
        }
        
        // Map backend data to the format expected by our UI
        const formattedAppointments = data.map(appointment => {
          // Check the structure of your data for debugging
          console.log('Processing appointment:', {
            id: appointment.id,
            fecha: appointment.fecha,
            horaInicio: appointment.horaInicio,
            psicologo: appointment.Psicologo
          });
          
          // Extract psychologist name correctly
          let doctorName = 'Psicólogo Asignado';
          
          if (appointment.Psicologo) {
            // Check if User data is nested inside Psicologo
            if (appointment.Psicologo.User) {
              const firstName = appointment.Psicologo.User.first_name || '';
              const lastName = appointment.Psicologo.User.last_name || '';
              if (firstName || lastName) {
                doctorName = `Psic. ${firstName} ${lastName}`.trim();
              }
            } 
            // Direct access if first_name and last_name are directly on Psicologo
            else if (appointment.Psicologo.first_name || appointment.Psicologo.last_name) {
              const firstName = appointment.Psicologo.first_name || '';
              const lastName = appointment.Psicologo.last_name || '';
              doctorName = `Psic. ${firstName} ${lastName}`.trim();
            }
          }
          
          console.log('Extracted doctor name:', doctorName);
          
          return {
            id: appointment.id,
            doctor: doctorName,
            fecha: appointment.fecha,
            date: new Date(`${appointment.fecha}T${appointment.horaInicio}`),
            endTime: new Date(`${appointment.fecha}T${appointment.horaFin || appointment.horaInicio}`),
            estado: appointment.estado,
            psicologoId: appointment.idPsicologo,
            time: appointment.horaInicio,
            endTimeString: appointment.horaFin
          };
        });
        
        // Sort appointments by date and time
        formattedAppointments.sort((a, b) => a.date - b.date);
        
        console.log('Final formatted appointments:', formattedAppointments);
        setUpcomingAppointments(formattedAppointments);
        setError(null);
        
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('No se pudieron cargar las citas programadas');
        toast.error('Error al cargar las citas programadas');
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [user, navigate]);

  // Fetch recommended psychologists
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoadingPsychologists(true);
        const response = await fetch(ENDPOINTS.PSICOLOGOS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar psicólogos recomendados');
        }

        const data = await response.json();
        
        // First, log the raw data structure coming from backend
        console.log('Raw psychologist data from API:', data);

        // Map backend data to the format expected by UI
        const formattedPsychologists = data.slice(0, 3).map(psych => {
          // Extract psychologist name correctly
          let psychName = 'Psicólogo';
          
          console.log('Individual psychologist raw data:', psych);
          
          // Check if User data is nested - most likely case based on your model structure
          if (psych.User) {
            console.log('User data found:', psych.User);
            // First try to use name field which is definitely included in the API response
            if (psych.User.name) {
              psychName = `Psic. ${psych.User.name}`;
            }
            // Fall back to first_name and last_name if available
            else if (psych.User.first_name || psych.User.last_name) {
              const firstName = psych.User.first_name || '';
              const lastName = psych.User.last_name || '';
              psychName = `Psic. ${firstName} ${lastName}`;
            }
          } 
          // If data comes in psicologo.User.name format
          else if (psych.User && psych.User.name) {
            console.log('User.name found:', psych.User.name);
            psychName = `Psic. ${psych.User.name}`;
          }
          // Direct access if first_name and last_name are directly on psych object
          else if (psych.first_name || psych.last_name) {
            console.log('Direct first_name/last_name found');
            const firstName = psych.first_name || '';
            const lastName = psych.last_name || '';
            psychName = `Psic. ${firstName} ${lastName}`;
          }
          // If name comes in a single 'name' field
          else if (psych.name) {
            console.log('Direct name field found:', psych.name);
            psychName = `Psic. ${psych.name}`;
          }
          // Check if data might be in a different structure entirely
          else {
            console.log('No standard name format found, checking additional fields');
            
            // Look for any field that might contain name information
            if (psych.nombre || psych.apellido) {
              const firstName = psych.nombre || '';
              const lastName = psych.apellido || '';
              psychName = `Psic. ${firstName} ${lastName}`;
            }
            
            // Look for deeply nested user info under different paths
            else if (psych.usuario && psych.usuario.nombre) {
              psychName = `Psic. ${psych.usuario.nombre}`;
            }
          }
          
          console.log('Extracted name:', psychName);
          
          return {
            id: psych.id,
            name: psychName.trim(),
            specialty: psych.especialidad || 'Psicología General',
            experience: psych.anosExperiencia ? `${psych.anosExperiencia} años de experiencia` : '5 años de experiencia',
            availability: 'Lun a Vie',
            availabilityHours: '09:00 AM-06:00 PM',
            price: psych.tarifaPorSesion || 35,
            image: psych.profileImage || '/assets/default-avatar.png'
          };
        });
        
        setRecommendedPsychologists(formattedPsychologists);
      } catch (err) {
        console.error('Error fetching psychologists:', err);
        setError('No se pudieron cargar los psicólogos recomendados');
        toast.error('Error al cargar los psicólogos recomendados. Por favor, intente nuevamente.');
        setRecommendedPsychologists([]); // Set empty array instead of hardcoded data
      } finally {
        setLoadingPsychologists(false);
      }
    };
    
    fetchPsychologists();
  }, []);
  
  // Helper function to format date ranges for display
  const formatTimeRange = (startDate, endDate) => {
    if (!startDate || !endDate) return '';
    
    try {
      const startTime = format(new Date(startDate), 'HH:mm', { locale: es });
      const endTime = format(new Date(endDate), 'HH:mm', { locale: es });
      return `${startTime} - ${endTime}`;
    } catch (error) {
      console.error('Error formatting time range:', error);
      return '';
    }
  };

  // Group appointments by month
  const appointmentsByMonth = upcomingAppointments.reduce((acc, appointment) => {
    try {
      const date = new Date(appointment.date);
      const monthYear = format(date, 'MMMM yyyy', { locale: es });
      
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      
      acc[monthYear].push(appointment);
    } catch (error) {
      console.error('Error grouping appointment by month:', error, appointment);
    }
    
    return acc;
  }, {});
  
  // Update the cancelAppointment function to use the correct endpoint

  const cancelAppointment = async (appointmentId) => {
    // First, confirm with the user
    if (!window.confirm("¿Está seguro que desea cancelar esta cita?")) {
      return;
    }
    
    try {
      // Show loading state
      setLoadingAppointments(true);
      
      // Make API call to update the appointment status
      const response = await fetch(`${ENDPOINTS.SESIONES}/${appointmentId}`, {
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
      const fetchAppointments = async () => {
        try {
          // Implementation of fetchAppointments
          // This is a simplified version - copy the full implementation from your useEffect
          const today = new Date().toISOString().split('T')[0];
          const response = await fetch(`${ENDPOINTS.SESIONES}?startDate=${today}&estado=programada`, {
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
          // Process data and update state as in your original code
          // (Simplified for brevity)
          const formattedAppointments = data.map(appointment => {
            // Check the structure of your data for debugging
            console.log('Appointment Psicologo data:', appointment.Psicologo);
            
            // Extract psychologist name correctly
            let doctorName = 'Psicólogo Asignado';
            
            if (appointment.Psicologo) {
              // Check if User data is nested inside Psicologo
              if (appointment.Psicologo.User) {
                const firstName = appointment.Psicologo.User.first_name || '';
                const lastName = appointment.Psicologo.User.last_name || '';
                if (firstName || lastName) {
                  doctorName = `Psic. ${firstName} ${lastName}`;
                }
              } 
              // Direct access if first_name and last_name are directly on Psicologo
              else if (appointment.Psicologo.first_name || appointment.Psicologo.last_name) {
                const firstName = appointment.Psicologo.first_name || '';
                const lastName = appointment.Psicologo.last_name || '';
                doctorName = `Psic. ${firstName} ${lastName}`;
              }
            }
            
            return {
              id: appointment.id,
              doctor: doctorName.trim(),
              fecha: appointment.fecha,
              date: new Date(`${appointment.fecha}T${appointment.horaInicio}`),
              endTime: new Date(`${appointment.fecha}T${appointment.horaFin}`),
              estado: appointment.estado,
              psicologoId: appointment.idPsicologo
            };
          });
          
          // Sort appointments by date and time
          formattedAppointments.sort((a, b) => a.date - b.date);
          
          setUpcomingAppointments(formattedAppointments);
          setError(null);
        } catch (err) {
          console.error('Error fetching appointments:', err);
          setError('No se pudieron cargar las citas programadas');
          toast.error('Error al cargar las citas programadas');
        } finally {
          setLoadingAppointments(false);
        }
      };
      
      // Call the function to refresh appointments
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
            <h2 className="text-2xl font-bold">Bienvenido!</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <form className="relative">
              <input
                type="text"
                placeholder="Buscar Psicólogos"
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 w-56"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
            
            <button className="bg-indigo-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-900 transition-colors">
              Buscar
            </button>
            
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
              <span className="font-medium">{user?.name || `${user?.first_name} ${user?.last_name}`}</span>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <section className="mb-10">
            <div className="bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-200 rounded-3xl p-8 relative overflow-hidden">
              <div className="max-w-lg">
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">No necesitas visitar hospitales</h2>
                <h3 className="text-xl font-medium text-white mb-4 drop-shadow-md">Obtén tu consulta en línea</h3>
                <p className="text-blue-100 mb-6">Audio/texto/video/presencial</p>
                
                <button 
                  onClick={() => navigate('/reserva')}
                  className="bg-white text-indigo-800 px-6 py-3 rounded-lg font-medium hover:bg-gray-100"
                >
                  Reservar cita ahora
                </button>
              </div>
            </div>
          </section>
          
          <section className="mb-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Citas Programadas</h3>
              <a href="/citas" className="text-blue-600 hover:underline flex items-center text-sm">
                Ver Todo
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            {loadingAppointments ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
                {error}. Por favor intente de nuevo más tarde.
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <EmptyAppointments userType={user?.userType || user?.role} />
            ) : (
              <div className="space-y-4">
                {Object.entries(appointmentsByMonth).map(([month, appointments]) => (
                  <div key={month} className="bg-white rounded-lg shadow p-4">
                    <h4 className="text-gray-500 font-medium mb-2 capitalize">{month}</h4>
                    
                    {appointments.map(appointment => (
                      <div 
                        key={appointment.id}
                        className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="flex items-center">
                          <div className="bg-gray-50 rounded-lg h-14 w-14 flex flex-col items-center justify-center mr-4">
                            <span className="text-xs text-gray-500 uppercase">
                              {format(new Date(appointment.date), 'EEE', { locale: es })}
                            </span>
                            <span className="text-xl font-bold">
                              {format(new Date(appointment.date), 'd', { locale: es })}
                            </span>
                          </div>
                          
                          <div>
                            <h5 className="font-medium">{appointment.doctor}</h5>
                            <p className="text-sm text-gray-500">
                              {formatTimeRange(appointment.date, appointment.endTime)}
                            </p>
                            <span className="inline-block mt-1 text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                              {appointment.estado === 'programada' ? 'Programada' : 
                               appointment.estado === 'completada' ? 'Completada' : 'Cancelada'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {appointment.estado === 'programada' && (
                            <button 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                cancelAppointment(appointment.id);
                              }}
                              className="px-4 py-2 rounded-md text-sm text-red-600 hover:bg-red-50"
                            >
                              Cancelar
                            </button>
                          )}
                          <button
                            className="text-indigo-800 p-2"
                            onClick={() => navigate(`/citas/${appointment.id}`)}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </section>
          
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Psicólogos Recomendados</h3>
              <a href="/psicologos" className="text-blue-600 hover:underline flex items-center text-sm">
                Ver Todo
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
            
            {loadingPsychologists ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : recommendedPsychologists.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <h4 className="text-lg font-medium text-gray-700 mb-2">No hay psicólogos disponibles</h4>
                <p className="text-gray-500 mb-4">No pudimos cargar los psicólogos recomendados en este momento.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-indigo-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-900 transition-colors"
                >
                  Reintentar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedPsychologists.map(psych => (
                  <div key={psych.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <img
                          src={psych.image}
                          alt={psych.name}
                          className="w-16 h-16 rounded-full object-cover mr-4"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(psych.name)}&background=random`;
                          }}
                        />
                        <div>
                          <h4 className="font-bold text-lg">{psych.name}</h4>
                          <p className="text-sm text-gray-600">Especialista | {psych.experience}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="bg-blue-50 text-blue-600 rounded-full px-3 py-1 text-xs">
                          {psych.specialty}
                        </span>
                      </div>
                      
                      <div className="border-t border-b border-gray-100 py-4 mb-4 flex justify-between">
                        <div className="flex items-center">
                          <svg className="text-gray-400 w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <p className="text-sm text-gray-600">{psych.availability}</p>
                            <p className="text-xs text-gray-500">{psych.availabilityHours}</p>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-indigo-800">${psych.price}</p>
                          <p className="text-xs text-gray-500">Desde</p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/reserva?psychologist=${psych.id}`)}
                        className="w-full bg-indigo-800 text-white py-3 rounded-md hover:bg-indigo-900 transition-colors"
                      >
                        Reservar una cita
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default PacienteDashboard;