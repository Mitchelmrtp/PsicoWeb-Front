import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FiMessageSquare } from 'react-icons/fi';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente para mostrar un chat en una lista
 */
const ChatListItem = ({ 
  chat, 
  currentUserId, 
  isPsychologist,
  isActive = false 
}) => {
  if (!chat) return null;

  // Determinar contacto según el rol del usuario
  // IMPORTANTE: Forzar que se muestre la información del paciente cuando el usuario es psicólogo
  let contactInfo;
  if (isPsychologist) {
    contactInfo = chat.paciente; // Si es psicólogo, mostrar paciente
  } else {
    contactInfo = chat.psicologo; // Si es paciente, mostrar psicólogo
  }
  
  const userInfo = contactInfo?.user || {};
  
  console.log('ChatListItem - Chat completo:', chat);
  console.log('ChatListItem - isPsychologist:', isPsychologist);
  console.log('ChatListItem - currentUserId:', currentUserId);
  console.log('ChatListItem - Contact info seleccionado:', contactInfo);
  console.log('ChatListItem - User info seleccionado:', userInfo);
  
  // Formatear nombre de contacto
  let displayName = 'Usuario';
  
  if (userInfo.first_name || userInfo.last_name) {
    displayName = `${userInfo.first_name || ''} ${userInfo.last_name || ''}`.trim();
  } else if (userInfo.name) {
    displayName = userInfo.name;
  } else if (userInfo.email) {
    displayName = userInfo.email;
  }
  
  console.log('ChatListItem - User info para mostrar:', userInfo);
  console.log('ChatListItem - Display name calculado:', displayName);
  
  // Información del último mensaje
  const lastMessage = chat.ultimoMensaje;
  
  // Formatear fecha del último mensaje
  const formattedDate = lastMessage?.createdAt 
    ? format(new Date(lastMessage.createdAt), 'd MMM', { locale: es })
    : format(new Date(chat.ultimaActividad), 'd MMM', { locale: es });
  
  // Determinar si el último mensaje es propio
  const isOwnMessage = lastMessage?.idEmisor === currentUserId;
  
  // Generar vista previa del mensaje
  const getMessagePreview = () => {
    if (!lastMessage) return 'Sin mensajes';
    
    if (lastMessage.tipoMensaje === 'texto') {
      return lastMessage.contenido?.substring(0, 40) || 'Mensaje de texto';
    }
    
    if (lastMessage.tipoMensaje === 'imagen') {
      return '🖼️ Imagen';
    }
    
    if (lastMessage.tipoMensaje === 'pdf') {
      return '📕 Documento PDF';
    }
    
    if (lastMessage.tipoMensaje === 'documento') {
      return '📄 Documento';
    }
    
    return '📎 Archivo adjunto';
  };

  return (
    <Link
      to={`/chat/${chat.id}`}
      className={`block hover:bg-blue-50 ${isActive ? 'bg-blue-50' : ''}`}
    >
      <div className="p-3 border-b border-gray-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
              <FiMessageSquare size={24} />
            </div>
            
            {/* Información */}
            <div>
              <div className="font-medium text-gray-900">{displayName}</div>
              <div className="text-sm text-gray-500 flex items-center">
                {isOwnMessage && <span className="mr-1 text-xs text-blue-500">Tú:</span>}
                {getMessagePreview()}
              </div>
            </div>
          </div>
          
          {/* Fecha y notificaciones */}
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-500">{formattedDate}</div>
            {chat.mensajesNoLeidos > 0 && (
              <div className="mt-1 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full">
                {chat.mensajesNoLeidos}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

ChatListItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    estado: PropTypes.string.isRequired,
    ultimaActividad: PropTypes.string,
    mensajesNoLeidos: PropTypes.number,
    psicologo: PropTypes.object,
    paciente: PropTypes.object,
    ultimoMensaje: PropTypes.object
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  isPsychologist: PropTypes.bool.isRequired,
  isActive: PropTypes.bool
};

export default ChatListItem;
