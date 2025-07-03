import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatMessage from './ChatMessage';

/**
 * Componente de la lista de mensajes del chat
 */
const ChatMessageList = ({ 
  messages, 
  currentUserId, 
  onDeleteMessage,
  isLoading,
  formatFileSize,
  getFileIcon
}) => {
  const messagesEndRef = useRef(null);

  // Desplazar al último mensaje cuando se añaden nuevos mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Si no hay mensajes
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 p-4 flex items-center justify-center text-gray-500 text-center">
        <div>
          <p className="mb-2">No hay mensajes aún.</p>
          <p className="text-sm">Escribe tu primer mensaje para iniciar la conversación.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="mt-2 h-6 bg-gray-200 rounded w-40"></div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isOwnMessage={message.idEmisor === currentUserId}
              canDelete={message.idEmisor === currentUserId}
              onDelete={onDeleteMessage}
              formatFileSize={formatFileSize}
              getFileIcon={getFileIcon}
            />
          ))}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

ChatMessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  formatFileSize: PropTypes.func.isRequired,
  getFileIcon: PropTypes.func.isRequired
};

export default ChatMessageList;
