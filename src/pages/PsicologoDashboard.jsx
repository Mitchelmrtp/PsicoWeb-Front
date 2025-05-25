import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import SidebarManager from '../components/dashboard/SidebarManager';
import { ENDPOINTS, getAuthHeader } from '../config/api';

const PsicologoDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('próximas');
  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const mockAppointments = [
          {
            id: '1',
            date: new Date('2025-05-15T09:00:00'),
            patient: 'Stephine Claire',
            status: 'scheduled',
            progressLink: '/progreso/1',
            documentsLink: '/documentos/1',
          },
          {
            id: '2',
            date: new Date('2025-05-16T09:00:00'),
            patient: 'Stephine Claire',
            status: 'scheduled',
            progressLink: '/progreso/2',
            documentsLink: '/documentos/2',
          },
          {
            id: '3',
            date: new Date('2025-05-19T09:00:00'),
            patient: 'Stephine Claire',
            status: 'pending',
            progressLink: null,
            documentsLink: null,
          },
          {
            id: '4',
            date: new Date('2025-06-02T09:00:00'),
            patient: 'Stephine Claire',
            status: 'scheduled',
            progressLink: '/progreso/4',
            documentsLink: '/documentos/4',
          },
          {
            id: '5',
            date: new Date('2025-06-03T09:00:00'),
            patient: 'Stephine Claire',
            status: 'scheduled',
            progressLink: '/progreso/5',
            documentsLink: '/documentos/5',
          },
          {
            id: '6',
            date: new Date('2025-06-04T09:00:00'),
            patient: 'Stephine Claire',
            status: 'pending',
            progressLink: null,
            documentsLink: null,
          },
        ];
        
        setAppointments(mockAppointments);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, []);
  
  const formatDate = (date) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options).replace('.', '');
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };
  
  const groupAppointmentsByMonth = (appointments) => {
    return appointments.reduce((groups, appointment) => {
      const monthYear = appointment.date.toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      
      groups[monthYear].push(appointment);
      return groups;
    }, {});
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
                  defaultValue="May 23"
                >
                  <option>May 23</option>
                  <option>Jun 23</option>
                  <option>Jul 23</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                  </svg>
                </div>
              </div>
              
              <button className="ml-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                + Nueva Cita
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                                <span className="text-gray-600">{formatTime(appointment.date)} - {formatTime(new Date(appointment.date.getTime() + 30 * 60000))}</span>
                              </div>
                              
                              <div className="mt-1 flex items-center space-x-2">
                                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span className="text-gray-600">{appointment.patient}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
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
                                Ver Documentos
                              </a>
                            )}
                            
                            <button className="p-2 text-gray-400 hover:text-gray-600 focus:outline-none">
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PsicologoDashboard;