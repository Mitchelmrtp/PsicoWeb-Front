import { Suspense } from 'react';
import { useAuth } from '../hooks/useAuth';
import NavigationSidebar from '../components/layout/NavigationSidebar';
import ProgresoEmocionalPaciente from '../components/emociones/ProgresoEmocionalPaciente';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const ProgresoEmocionalPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <NavigationSidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div>
            <h1 className="text-lg font-medium text-gray-600">
              Mi Progreso Emocional
            </h1>
            <h2 className="text-2xl font-bold text-gray-900">
              Seguimiento de Estados Emocionales
            </h2>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          <Suspense fallback={<LoadingSpinner />}>
            <ProgresoEmocionalPaciente />
          </Suspense>
        </main>
      </div>
    </div>
  );
};

export default ProgresoEmocionalPage;
