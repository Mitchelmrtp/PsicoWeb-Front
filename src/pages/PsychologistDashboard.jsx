import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { usePsychologistAppointments } from '../hooks/usePsychologistAppointments';
import { usePsychologistPatients } from '../hooks/usePsychologistPatients';
import NavigationSidebar from '../components/layout/NavigationSidebar';
import AppointmentList from '../components/features/AppointmentList';
import { Card, Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../routes/routePaths';

// Dashboard del psicólogo refactorizado
const PsychologistDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('próximas');
  
  const { appointments, loading: appointmentsLoading, error } = usePsychologistAppointments(user?.id, activeTab);
  const { patients, loading: patientsLoading, error: patientsError } = usePsychologistPatients(user?.id);

  const handleViewAppointment = (appointment) => {
    navigate(`/citas/${appointment.id}`);
  };

  const handleEditAppointment = (appointment) => {
    navigate(`/citas/${appointment.id}/editar`);
  };

  const handleStartConsultation = (appointment) => {
    navigate(`/consultas-online/${appointment.id}`);
  };

  const tabs = [
    { id: 'próximas', label: 'Próximas', count: appointments.length },
    { id: 'pasadas', label: 'Pasadas', count: 0 },
    { id: 'canceladas', label: 'Canceladas', count: 0 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <NavigationSidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">
              Hola, {user?.name || user?.first_name || 'Doctor'}
            </h1>
            <h2 className="text-2xl font-bold">Reservaciones</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <select 
              className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              defaultValue={new Date().getMonth()}
              onChange={(e) => {/* Month selector */}}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleDateString('es-ES', { month: 'long' })}
                </option>
              ))}
            </select>
            
            <Button
              onClick={() => navigate(ROUTE_PATHS.DISPONIBILIDAD)}
              variant="outline"
            >
              Gestionar disponibilidad
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 space-y-6">
          {/* Pestañas de citas */}
          <Card>
            <Card.Header>
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-4 py-2 rounded-md text-sm font-medium transition-colors
                      ${activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    {tab.label}
                    {tab.count > 0 && (
                      <span className="ml-2 bg-gray-200 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </Card.Header>
            
            <Card.Content>
              <AppointmentList
                appointments={appointments}
                loading={appointmentsLoading}
                error={error}
                title=""
                emptyMessage="No hay citas en esta categoría"
                onViewDetails={handleViewAppointment}
                showViewAll={false}
              />
            </Card.Content>
          </Card>

          {/* Lista de pacientes */}
          <Card>
            <Card.Header>
              <div className="flex justify-between items-center">
                <Card.Title>Mis Pacientes</Card.Title>
                <Button 
                  onClick={() => navigate(ROUTE_PATHS.PACIENTES)}
                  variant="ghost"
                  size="sm"
                >
                  Ver Todos
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </div>
            </Card.Header>
            
            <Card.Content>
              {patientsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : patientsError ? (
                <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
                  {patientsError}
                </div>
              ) : patients.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">No tienes pacientes asignados aún</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.slice(0, 6).map(patient => (
                    <div key={patient.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center mb-2">
                        <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-800 font-semibold text-sm">
                            {patient.name.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">{patient.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3">
                        <span className={`
                          px-2 py-1 text-xs rounded-full
                          ${patient.status === 'activo' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {patient.status}
                        </span>
                        
                        <Button
                          onClick={() => navigate(`/pacientes/${patient.id}`)}
                          variant="ghost"
                          size="sm"
                        >
                          Ver perfil
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PsychologistDashboard;
