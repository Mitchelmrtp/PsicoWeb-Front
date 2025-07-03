import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import PsychologistDashboard from '../../pages/PsychologistDashboard';
import PatientDashboard from '../../pages/PatientDashboard';
import { LoadingSpinner } from '../ui';

const DashboardContainer = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) {
    return <LoadingSpinner fullScreen />;
  }

  // Render appropriate dashboard based on user role
  switch (user.role) {
    case 'psicologo':
      return <PsychologistDashboard />;
    case 'paciente':
      return <PatientDashboard />;
    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
            <p className="text-gray-600">
              Rol no reconocido: {user.role}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Por favor, contacte al administrador del sistema.
            </p>
          </div>
        </div>
      );
  }
};

export default DashboardContainer;