import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SidebarManager from '../components/dashboard/SidebarManager';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { format, parseISO, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'react-toastify';

const ConsultasPsicologo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hoy');
  
  // Fetch consultations from backend
  useEffect(() => {
    const fetchConsultas = async () => {
      try {
        setLoading(true);
        
        // Get current date in YYYY-MM-DD format for filtering
        const today = format(new Date(), 'yyyy-MM-dd');
        
        // API request to get all scheduled appointments
        const response = await fetch(`${ENDPOINTS.SESIONES}?estado=programada`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });
        
        if (!response.ok) {
          throw new Error('Error al cargar las consultas');
        }
        
        const data = await response.json();
        
        // Format consultations for UI
        const formattedConsultas = data
          .filter(consulta => consulta.idPsicologo === user.id)
          .map(consulta => {
            // Create date objects
            const startDate = parseISO(`${consulta.fecha}T${consulta.horaInicio}`);
            const endDate = consulta.horaFin 
              ? parseISO(`${consulta.fecha}T${consulta.horaFin}`) 
              : new Date(startDate.getTime() + 60 * 60000); // Add 1 hour
            
            // Extract patient name from nested objects
            const patientName = consulta.Paciente && consulta.Paciente.User 
              ? `${consulta.Paciente.User.first_name || ''} ${consulta.Paciente.User.last_name || ''}`.trim()
              : consulta.Paciente 
                ? `${consulta.Paciente.first_name || ''} ${consulta.Paciente.last_name || ''}`.trim()
                : 'Paciente';
                
            return {
              id: consulta.id,
              date: startDate,
              endTime: endDate,
              patient: patientName,
              patientEmail: consulta.Paciente?.User?.email || consulta.Paciente?.email || '',
              status: consulta.estado,
              isToday: isSameDay(startDate, new Date()),
              pacienteId: consulta.idPaciente,
              fecha: consulta.fecha,
              motivo: consulta.motivo || 'Consulta psicológica'
            };
          });
        
        // Filter based on active tab
        let filteredConsultas = [];
        if (activeTab === 'hoy') {
          filteredConsultas = formattedConsultas.filter(c => c.isToday);
        } else if (activeTab === 'proximas') {
          filteredConsultas = formattedConsultas.filter(c => !c.isToday);
        } else {
          filteredConsultas = formattedConsultas;
        }
        
        // Sort by date/time
        filteredConsultas.sort((a, b) => a.date - b.date);
        
        setConsultas(filteredConsultas);
      } catch (error) {
        console.error('Error fetching consultations:', error);
        toast.error('No se pudieron cargar las consultas');
      } finally {
        setLoading(false);
      }
    };
    
    fetchConsultas();
  }, [activeTab, user.id]);
  
  const handleStartConsultation = (consulta) => {
    navigate(`/consultas-online/${consulta.id}`);
  };
  
  const handleViewPatientProfile = (consulta) => {
    navigate(`/pacientes/${consulta.pacienteId}`);
  };
  
  const formatTime = (date) => {
    return format(date, 'HH:mm', { locale: es });
  };
  
  const formatDay = (date) => {
    return format(date, 'EEEE d MMMM', { locale: es });
  };
  
  // Group consultations by date
  const groupConsultasByDate = (consultas) => {
    return consultas.reduce((groups, consulta) => {
      const dateKey = format(consulta.date, 'yyyy-MM-dd');
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(consulta);
      return groups;
    }, {});
  };
  
  const groupedConsultas = groupConsultasByDate(consultas);
  
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
            <span className="font-medium">{user?.name || user?.first_name}</span>
          </div>
        </header>
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-4 border-b">
              <button 
                className={`pb-2 px-1 ${activeTab === 'hoy' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('hoy')}
              >
                Consultas de Hoy
              </button>
              <button 
                className={`pb-2 px-1 ${activeTab === 'proximas' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('proximas')}
              >
                Próximas
              </button>
              <button 
                className={`pb-2 px-1 ${activeTab === 'todas' ? 'border-b-2 border-blue-500 font-medium text-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('todas')}
              >
                Todas
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : consultas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay consultas programadas</h3>
              <p className="text-gray-500 mb-6">
                {activeTab === 'hoy' 
                  ? 'No tienes consultas programadas para hoy'
                  : activeTab === 'proximas'
                    ? 'No tienes próximas consultas programadas'
                    : 'No tienes consultas programadas'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedConsultas).map(([dateKey, consultasForDate]) => (
                <div key={dateKey} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <h3 className="font-medium text-gray-800 capitalize">
                      {formatDay(consultasForDate[0].date)}
                    </h3>
                  </div>
                  
                  <div>
                    {consultasForDate.map((consulta, index) => (
                      <div 
                        key={consulta.id}
                        className={`px-6 py-4 flex items-center justify-between ${
                          index !== consultasForDate.length - 1 ? 'border-b border-gray-100' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-6">
                          <div className="bg-indigo-100 text-indigo-800 w-16 text-center py-2 rounded-lg">
                            <span className="block font-medium">
                              {formatTime(consulta.date)}
                            </span>
                          </div>
                          
                          <div>
                            <h4 className="font-medium text-gray-800">
                              {consulta.patient}
                            </h4>
                            {consulta.patientEmail && (
                              <p className="text-sm text-gray-500">
                                {consulta.patientEmail}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              {consulta.motivo}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => handleViewPatientProfile(consulta)}
                            className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Ver Perfil
                          </button>
                          
                          <button
                            onClick={() => handleStartConsultation(consulta)}
                            className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                          >
                            Iniciar Consulta
                          </button>
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

export default ConsultasPsicologo;