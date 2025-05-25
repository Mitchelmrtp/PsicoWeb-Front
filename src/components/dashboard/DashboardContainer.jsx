import { useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import PsicologoDashboard from '../../pages/PsicologoDashboard';
import PacienteDashboard from '../../pages/PacienteDashboard';

const DashboardContainer = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  // Render appropriate dashboard based on user role
  return (
    <div className="min-h-screen bg-gray-50">
      {user.role === 'psicologo' ? (
        <PsicologoDashboard />
      ) : user.role === 'paciente' ? (
        <PacienteDashboard />
      ) : (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-4">Rol no reconocido: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardContainer;