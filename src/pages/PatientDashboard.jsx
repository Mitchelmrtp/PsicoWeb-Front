import { useAuth } from '../hooks/useAuth';
import { usePatientAppointments } from '../hooks/usePatientAppointments';
import { usePsychologists } from '../hooks/usePsychologists';
import NavigationSidebar from '../components/layout/NavigationSidebar';
import AppointmentList from '../components/features/AppointmentList';
import PsychologistCard from '../components/features/PsychologistCard';
import { Card, Button } from '../components/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../routes/routePaths';
import { FiMessageCircle } from 'react-icons/fi';

// Dashboard del paciente refactorizado siguiendo principios SOLID
const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { appointments, loading: appointmentsLoading, error } = usePatientAppointments(user?.id);
  
  // Hook para obtener psicólogos del backend
  const { psychologists, loading: psychologistsLoading } = usePsychologists();

  const handleViewAppointmentDetails = (appointment) => {
    // Ver detalles de cita
    // Implementar navegación a detalles de cita
  };

  const handleViewAllAppointments = () => {
    navigate(ROUTE_PATHS.CONSULTAS);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <NavigationSidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-lg font-medium">
              Hola, {user?.name || user?.first_name || 'Usuario'}
            </h1>
            <h2 className="text-2xl font-bold text-gray-900">
              Dashboard
            </h2>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6 space-y-6">
          {/* Sección de bienvenida */}
          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <Card.Content>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    ¡Bienvenido a tu espacio de bienestar mental!
                  </h3>
                  <p className="opacity-90 mb-4">
                    Mantén un seguimiento de tus sesiones y progreso terapéutico
                  </p>
                  <Button 
                    onClick={() => navigate(ROUTE_PATHS.RESERVA)}
                    variant="secondary"
                    className="bg-white text-indigo-800 hover:bg-gray-100"
                  >
                    Reservar cita ahora
                  </Button>
                </div>
                <div className="hidden md:block">
                  <svg className="h-24 w-24 opacity-20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </Card.Content>
          </Card>

          {/* Lista de citas programadas */}
          <AppointmentList
            appointments={appointments}
            loading={appointmentsLoading}
            error={error}
            title="Citas Programadas"
            emptyMessage="No tienes citas programadas. ¡Reserva tu primera sesión!"
            onViewDetails={handleViewAppointmentDetails}
            showViewAll={appointments.length > 3}
            onViewAll={handleViewAllAppointments}
          />

          {/* Psicólogos recomendados */}
          <Card>
            <Card.Header>
              <Card.Title>Psicólogos Recomendados</Card.Title>
            </Card.Header>
            <Card.Content>
              {psychologistsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {psychologists.slice(0, 3).map(psychologist => (
                    <PsychologistCard
                      key={psychologist.id}
                      psychologist={psychologist}
                      showBookButton={true}
                    />
                  ))}
                </div>
              )}
            </Card.Content>
          </Card>

          {/* Sección de chat */}
          <Card>
            <Card.Header>
              <Card.Title>Mensajes</Card.Title>
            </Card.Header>
            <Card.Content>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FiMessageCircle size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Mensajes con tu psicólogo</h4>
                    <p className="text-gray-500 text-sm">Comunícate directamente con tu profesional</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate(ROUTE_PATHS.CHAT)}
                  variant="primary"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Ver mensajes
                </Button>
              </div>
            </Card.Content>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
