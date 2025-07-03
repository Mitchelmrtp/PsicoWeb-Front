import PropTypes from 'prop-types';
import { FiArchive, FiX, FiMessageCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente de encabezado del chat
 */
const ChatHeader = ({ 
  chatInfo, 
  onChangeStatus,
  isPsychologist,
  onBack
}) => {
  if (!chatInfo) return null;

  const { 
    estado, 
    psicologo, 
    paciente,
    ultimaActividad 
  } = chatInfo;

  // Determinar la persona con la que se está chateando (desde la perspectiva del usuario)
  // IMPORTANTE: Forzar que se muestre la información del paciente cuando el usuario es psicólogo
  let contactInfo;
  if (isPsychologist) {
    contactInfo = paciente; // Si es psicólogo, mostrar paciente
  } else {
    contactInfo = psicologo; // Si es paciente, mostrar psicólogo
  }
  
  console.log('ChatHeader - Chat info:', chatInfo);
  console.log('ChatHeader - isPsychologist:', isPsychologist);
  console.log('ChatHeader - paciente:', paciente);
  console.log('ChatHeader - psicologo:', psicologo);
  console.log('ChatHeader - contactInfo seleccionado:', contactInfo);
  
  if (!contactInfo) {
    return (
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center">
          {onBack && (
            <button onClick={onBack} className="mr-2 text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          )}
          <div>
            <p className="font-medium">Chat no disponible</p>
            <p className="text-xs text-gray-500">No se encontró el contacto</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Obtener información de usuario
  const userInfo = contactInfo?.user || {};
  console.log('ChatHeader - Contact info:', contactInfo);
  console.log('ChatHeader - User info:', userInfo);
  
  // Formatear nombre del contacto
  let displayName = 'Usuario';
  
  if (userInfo.first_name || userInfo.last_name) {
    displayName = `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim();
  } else if (userInfo.name) {
    displayName = userInfo.name;
  } else if (userInfo.email) {
    displayName = userInfo.email;
  }
  
  console.log('ChatHeader - User info para mostrar:', userInfo);
  console.log('ChatHeader - Display name calculado:', displayName);
  
  // Formatear fecha de última actividad
  const formattedLastActivity = ultimaActividad
    ? format(new Date(ultimaActividad), "'Última actividad:' d 'de' MMMM, HH:mm", { locale: es })
    : '';

  return (
    <div className="bg-white border-b border-gray-200 p-3 shadow-sm">
      <div className="flex justify-between items-center">
        {/* Información del contacto */}
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
            <FiMessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{displayName}</h3>
            <p className="text-xs text-gray-500">{formattedLastActivity}</p>
          </div>
        </div>
        
        {/* Acciones del chat - solo psicólogos pueden cambiar estado */}
        {isPsychologist && (
          <div className="flex items-center gap-2">
            {estado === 'activo' && (
              <button
                onClick={() => onChangeStatus('archivado')}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                title="Archivar chat"
              >
                <FiArchive size={18} />
              </button>
            )}
            
            {estado === 'activo' && (
              <button
                onClick={() => onChangeStatus('bloqueado')}
                className="p-2 rounded-full hover:bg-gray-100 text-red-600"
                title="Bloquear chat"
              >
                <FiX size={18} />
              </button>
            )}
            
            {estado !== 'activo' && (
              <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
                {estado === 'archivado' ? 'Archivado' : 'Bloqueado'}
              </span>
            )}
          </div>
        )}
        
        {/* Para pacientes, solo mostrar estado si no está activo */}
        {!isPsychologist && estado !== 'activo' && (
          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-600">
            {estado === 'archivado' ? 'Archivado' : 'Bloqueado'}
          </span>
        )}
      </div>
    </div>
  );
};

ChatHeader.propTypes = {
  chatInfo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    ultimaActividad: PropTypes.string,
    psicologo: PropTypes.object,
    paciente: PropTypes.object
  }),
  onChangeStatus: PropTypes.func.isRequired,
  isPsychologist: PropTypes.bool.isRequired,
  onBack: PropTypes.func
};

export default ChatHeader;
