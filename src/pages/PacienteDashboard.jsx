import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SidebarManager from '../components/dashboard/SidebarManager';

const PacienteDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recommendedPsychologists, setRecommendedPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, you would fetch this data from your API
        // For now, we'll use mock data that matches your design
        const mockAppointments = [
          {
            id: 1,
            doctor: 'Dr. Ashton Cleve',
            date: new Date('2025-06-14T10:00:00'),
            endTime: new Date('2025-06-14T10:30:00'),
          },
          {
            id: 2,
            doctor: 'Dr. Ashton Cleve',
            date: new Date('2025-06-15T10:00:00'),
            endTime: new Date('2025-06-15T10:30:00'),
          },
          {
            id: 3,
            doctor: 'Dr. Ashton Cleve',
            date: new Date('2025-06-15T09:00:00'),
            endTime: new Date('2025-06-15T10:30:00'),
          },
          {
            id: 4,
            doctor: 'Dr. Ashton Cleve',
            date: new Date('2025-06-15T10:00:00'),
            endTime: new Date('2025-06-15T10:30:00'),
          }
        ];
        
        const mockPsychologists = [
          {
            id: 1,
            name: 'Amanda Clara',
            specialty: 'Psicología Infantil',
            experience: '12 años de experiencia',
            availability: 'Mar y Jue',
            availabilityHours: '10:00 AM-01:00 PM',
            price: 25,
            image: '/assets/psychologist1.jpg'
          },
          {
            id: 2,
            name: 'Jason Shatsky',
            specialty: 'Psicología Clínica',
            experience: '7 años de experiencia',
            availability: 'Mar y Jue',
            availabilityHours: '10:00 AM-01:00 PM',
            price: 35,
            image: '/assets/psychologist2.jpg'
          },
          {
            id: 3,
            name: 'Jessie Dux',
            specialty: 'Psicólogo educativo',
            experience: '5 años de experiencia',
            availability: 'Mar y Jue',
            availabilityHours: '10:00 AM-01:00 PM',
            price: 15,
            image: '/assets/psychologist3.jpg'
          }
        ];
        
        setUpcomingAppointments(mockAppointments);
        setRecommendedPsychologists(mockPsychologists);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatTimeRange = (startDate, endDate) => {
    const startTime = startDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
    
    const endTime = endDate.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    return `${startTime} - ${endTime}`;
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
            
            <div className="relative">
              <input
                type="text"
                placeholder="Location"
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-300 w-40"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            
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
                <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">No need to visit local hospitals</h2>
                <h3 className="text-xl font-medium text-white mb-4 drop-shadow-md">Get your consultation online</h3>
                <p className="text-blue-100 mb-6">Audio/text/video/in-person</p>
                
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    <img src="/assets/avatar1.jpg" alt="Doctor" className="w-9 h-9 rounded-full border-2 border-white" />
                    <img src="/assets/avatar2.jpg" alt="Doctor" className="w-9 h-9 rounded-full border-2 border-white" />
                    <img src="/assets/avatar3.jpg" alt="Doctor" className="w-9 h-9 rounded-full border-2 border-white" />
                  </div>
                  <span className="text-white text-sm font-medium">+180 doctors are online</span>
                </div>
              </div>
              
              {/* Optional: Add an illustration or doctor image on the right side */}
              <div className="absolute right-0 top-0 h-full w-1/3 hidden md:block">
                <img 
                  src="/assets/doctors.png" 
                  alt="Doctors" 
                  className="h-full w-full object-cover" 
                />
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-indigo-800"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                <div className="h-2 w-2 rounded-full bg-gray-300"></div>
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
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-white rounded-lg shadow p-4">
                  <h4 className="text-gray-500 font-medium mb-2">June 2023</h4>
                  
                  {upcomingAppointments.map(appointment => (
                    <div 
                      key={appointment.id}
                      className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="bg-gray-50 rounded-lg h-14 w-14 flex flex-col items-center justify-center mr-4">
                          <span className="text-xs text-gray-500 uppercase">
                            {appointment.date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '')}
                          </span>
                          <span className="text-xl font-bold">
                            {appointment.date.getDate()}
                          </span>
                        </div>
                        
                        <div>
                          <h5 className="font-medium">{appointment.doctor}</h5>
                          <p className="text-sm text-gray-500">{formatTimeRange(appointment.date, appointment.endTime)}</p>
                        </div>
                      </div>
                      
                      <button
                        className="text-indigo-800 p-2"
                        onClick={() => navigate(`/appointment/${appointment.id}`)}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
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
            
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
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
                            e.target.src = `https://ui-avatars.com/api/?name=${psych.name}&background=random`;
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
                          <p className="text-xs text-gray-500">Starting</p>
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