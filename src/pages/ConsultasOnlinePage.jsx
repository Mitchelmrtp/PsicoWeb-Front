import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavigationSidebar from '../components/layout/NavigationSidebar';
import { Card, Button } from '../components/ui';
import { FiVideo, FiMic, FiMicOff, FiVideoOff, FiPhoneOff, FiMessageCircle } from 'react-icons/fi';
import { useState } from 'react';

const ConsultasOnlinePage = () => {
  const { id } = useParams(); // ID de la sesión/cita
  const navigate = useNavigate();
  const { user } = useAuth();
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);

  const isPsychologist = user?.role === 'psicologo' || user?.rol === 'psicologo';

  const handleEndCall = () => {
    if (window.confirm('¿Estás seguro de que quieres terminar la consulta?')) {
      navigate('/dashboard');
    }
  };

  const handleGoToChat = () => {
    navigate('/chat');
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <NavigationSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-medium">
              {isPsychologist ? 'Consulta con Paciente' : 'Consulta con tu Psicólogo'}
            </h1>
            {id && (
              <p className="text-gray-300 text-sm">Sesión ID: {id}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              En línea
            </span>
            <span className="text-gray-300">
              {new Date().toLocaleTimeString('es-ES', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </span>
          </div>
        </header>

        {/* Video call area */}
        <main className="flex-1 bg-gray-900 flex items-center justify-center">
          <div className="max-w-4xl w-full mx-auto p-6">
            {/* Placeholder for video call interface */}
            <Card className="bg-gray-800 border-gray-700 text-center">
              <Card.Content className="p-12">
                <div className="mb-8">
                  <FiVideo size={64} className="text-blue-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Consulta Online
                  </h2>
                  <p className="text-gray-300 text-lg">
                    {isPsychologist 
                      ? 'Esperando a que se conecte el paciente...'
                      : 'Esperando a que se conecte tu psicólogo...'
                    }
                  </p>
                </div>

                {/* Simulated video area */}
                <div className="bg-gray-700 rounded-lg p-8 mb-8 border-2 border-dashed border-gray-600">
                  <p className="text-gray-400">
                    📹 Área de videollamada
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    (Funcionalidad en desarrollo)
                  </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4 mb-8">
                  <Button
                    onClick={() => setMicEnabled(!micEnabled)}
                    className={`${
                      micEnabled 
                        ? 'bg-gray-600 hover:bg-gray-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white p-3 rounded-full`}
                    title={micEnabled ? 'Silenciar micrófono' : 'Activar micrófono'}
                  >
                    {micEnabled ? <FiMic size={20} /> : <FiMicOff size={20} />}
                  </Button>

                  <Button
                    onClick={() => setVideoEnabled(!videoEnabled)}
                    className={`${
                      videoEnabled 
                        ? 'bg-gray-600 hover:bg-gray-700' 
                        : 'bg-red-600 hover:bg-red-700'
                    } text-white p-3 rounded-full`}
                    title={videoEnabled ? 'Desactivar cámara' : 'Activar cámara'}
                  >
                    {videoEnabled ? <FiVideo size={20} /> : <FiVideoOff size={20} />}
                  </Button>

                  <Button
                    onClick={handleGoToChat}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full"
                    title="Abrir chat"
                  >
                    <FiMessageCircle size={20} />
                  </Button>

                  <Button
                    onClick={handleEndCall}
                    className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full"
                    title="Terminar consulta"
                  >
                    <FiPhoneOff size={20} />
                  </Button>
                </div>

                {/* Information */}
                <div className="bg-blue-900 bg-opacity-50 rounded-lg p-4 text-left">
                  <h3 className="text-blue-300 font-medium mb-2">
                    💡 Información importante:
                  </h3>
                  <ul className="text-blue-200 text-sm space-y-1">
                    <li>• Esta es una versión preliminar de la funcionalidad de consultas online</li>
                    <li>• Puedes usar el chat para comunicarte mientras tanto</li>
                    <li>• La integración completa de videollamadas estará disponible próximamente</li>
                    {isPsychologist && (
                      <li>• Como psicólogo, puedes marcar la sesión como completada desde los detalles de la cita</li>
                    )}
                  </ul>
                </div>
              </Card.Content>
            </Card>
          </div>
        </main>

        {/* Footer with session info */}
        <footer className="bg-gray-800 text-gray-300 px-6 py-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Duración: 00:45:30
              </span>
              <span className="text-sm">
                Calidad: HD
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => navigate(`/citas/${id}`)}
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                Ver detalles de la cita
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ConsultasOnlinePage;
