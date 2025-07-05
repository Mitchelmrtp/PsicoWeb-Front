import { Suspense } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationSidebar from '../components/layout/NavigationSidebar';
import RegistroEmocionForm from '../components/emociones/RegistroEmocionForm';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const RegistrarEmocionesPage = () => {
  const { user } = useAuth();
  const { pacienteId } = useParams();
  const navigate = useNavigate();

  if (!user || user.role !== 'psicologo') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">Esta página está reservada para psicólogos.</p>
        </div>
      </div>
    );
  }

  const handleSuccess = () => {
    // Regresar a la lista de pacientes después de registrar
    navigate('/pacientes');
  };

  const handleCancel = () => {
    // Regresar a la lista de pacientes
    navigate('/pacientes');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <NavigationSidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                  <span>Volver a Pacientes</span>
                </button>
              </div>
              <h1 className="text-lg font-medium text-gray-600 mt-2">
                Registrar Emociones
              </h1>
              <h2 className="text-2xl font-bold text-gray-900">
                Nuevo Registro Emocional
              </h2>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <Suspense fallback={<LoadingSpinner />}>
                  <RegistroEmocionForm
                    pacienteIdPreseleccionado={pacienteId}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                    mostrarBotonesCancelar={true}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RegistrarEmocionesPage;
