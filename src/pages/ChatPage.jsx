import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useChat } from '../hooks/useChat';
import NavigationSidebar from '../components/layout/NavigationSidebar';
import ChatHeader from '../components/chat/ChatHeader';
import ChatInput from '../components/chat/ChatInput';
import ChatMessageList from '../components/chat/ChatMessageList';
import ChatList from '../components/chat/ChatList';
import ContactList from '../components/chat/ContactList';
import WelcomeMessage from '../components/chat/WelcomeMessage';
import ChatDebugger from '../components/debug/ChatDebugger';
import { ROUTE_PATHS } from '../routes/routePaths';
import ChatService from '../services/api/chatService';
import { FiMessageCircle, FiUsers, FiMessageSquare, FiAlertTriangle, FiFile, FiImage } from 'react-icons/fi';
import { toast } from 'react-toastify';

/**
 * Página principal de chat
 * Muestra una lista de chats y el detalle del chat seleccionado
 */
const ChatPage = () => {
  const { id } = useParams(); // ID del chat en la URL
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedChatId, setSelectedChatId] = useState(id ? id : null);
  const [viewMode, setViewMode] = useState('chats'); // 'chats', 'contacts', 'conversation'
  const [creatingChat, setCreatingChat] = useState(false);
  const [showDebugger, setShowDebugger] = useState(false); // Estado para mostrar/ocultar depurador
  const [hasNoChats, setHasNoChats] = useState(false); // Estado para controlar si hay chats disponibles
  const chatService = new ChatService();
  
  // Determinar si el usuario es psicólogo
  const isPsychologist = user?.rol === 'psicologo' || user?.role === 'psicologo';
  
  console.log('ChatPage - User:', user);
  console.log('ChatPage - isPsychologist:', isPsychologist);
  
  // Usar el hook personalizado de chat
  const { 
    loading, 
    error, 
    chatInfo, 
    messages,
    loadMessages, 
    sendMessage, 
    sendFile,
    createOrGetChat
  } = useChat(selectedChatId);
  
  // Efecto para actualizar el chat seleccionado cuando cambia la URL
  useEffect(() => {
    if (id) {
      setSelectedChatId(id);
      setViewMode('conversation');
    } else {
      setViewMode('chats');
    }
  }, [id]);
  
  // Manejar selección de chat
  const handleSelectChat = (chatId) => {
    navigate(`${ROUTE_PATHS.CHAT}/${chatId}`);
    setSelectedChatId(chatId);
    setViewMode('conversation');
  };
  
  // Manejar selección de contacto para crear un nuevo chat
  const handleSelectContact = async (contact) => {
    try {
      setCreatingChat(true);
      let idPsicologo, idPaciente;
      
      if (isPsychologist) {
        // Si el usuario es psicólogo
        idPsicologo = user.id;
        idPaciente = contact.tipo === 'paciente' ? contact.id : null;
        
        // Si es otro psicólogo, no se puede crear chat (implementación futura)
        if (contact.tipo === 'psicologo') {
          toast.info('La funcionalidad de chat entre psicólogos está en desarrollo');
          setCreatingChat(false);
          return;
        }
      } else {
        // Si el usuario es paciente
        idPaciente = user.id;
        idPsicologo = contact.id;
      }
      
      // Crear o recuperar chat existente
      const chat = await createOrGetChat(idPsicologo, idPaciente);
      
      if (chat && chat.id) {
        // Navegar al nuevo chat
        navigate(`${ROUTE_PATHS.CHAT}/${chat.id}`);
        setSelectedChatId(chat.id);
        setViewMode('conversation');
        toast.success('Conversación iniciada');
      } else {
        toast.error('No se pudo iniciar la conversación');
      }
    } catch (err) {
      console.error('Error creating chat:', err);
      toast.error('Error al iniciar la conversación');
    } finally {
      setCreatingChat(false);
    }
  };
  
  // Cambiar entre vista de chats y contactos
  const handleToggleView = (mode) => {
    setViewMode(mode);
    if (mode === 'chats' || mode === 'contacts') {
      setSelectedChatId(null);
      navigate(ROUTE_PATHS.CHAT);
    }
  };
  
  // Volver a la lista desde la conversación (en móvil)
  const handleBackToList = () => {
    setSelectedChatId(null);
    setViewMode('chats');
    navigate(ROUTE_PATHS.CHAT);
  };
  
  // Manejar envío de mensaje
  const handleSendMessage = async (text) => {
    if (selectedChatId) {
      await sendMessage(text);
      // Recargar mensajes después de enviar
      loadMessages();
    }
  };
  
  // Manejar envío de archivo
  const handleSendFile = async (file) => {
    if (selectedChatId) {
      await sendFile(file);
      // Recargar mensajes después de enviar
      loadMessages();
    }
  };

  // Utility function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Utility function to get file icon based on file type
  const getFileIcon = (mimeType) => {
    if (!mimeType) return FiFile;
    
    if (mimeType.startsWith('image/')) {
      return FiImage;
    }
    
    // Add more file type mappings as needed
    return FiFile;
  };

  // Handle message deletion
  const handleDeleteMessage = async (messageId) => {
    try {
      // This would typically call a service method to delete the message
      // For now, just show a confirmation
      if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
        // Implement delete logic here
        toast.info('Funcionalidad de eliminación en desarrollo');
      }
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Error al eliminar el mensaje');
    }
  };

  // Handle chat status change (only for psychologists)
  const handleChangeStatus = async (newStatus) => {
    try {
      if (!selectedChatId) return;
      
      await chatService.updateChatStatus(selectedChatId, newStatus);
      toast.success(`Chat ${newStatus === 'archivado' ? 'archivado' : 'activado'} correctamente`);
      
      // Reload chat info to reflect the change
      // This would typically be handled by the useChat hook
    } catch (error) {
      console.error('Error changing chat status:', error);
      toast.error('Error al cambiar el estado del chat');
    }
  };

  // Handle welcome message contact click
  const handleWelcomeContactClick = () => {
    setViewMode('contacts');
  };

  // Effect to check if user has chats
  useEffect(() => {
    const checkUserChats = async () => {
      try {
        if (user?.id) {
          const chatsResponse = await chatService.getUserChats();
          const userChats = chatsResponse.data || chatsResponse || [];
          setHasNoChats(userChats.length === 0);
        }
      } catch (error) {
        console.error('Error checking user chats:', error);
        setHasNoChats(true);
      }
    };

    if (user?.id) {
      checkUserChats();
    }
  }, [user?.id]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <NavigationSidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Encabezado principal */}
        <header className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">
              Mensajes
            </h1>
          </div>
        </header>
        
        {/* Pestañas para cambiar entre chats y contactos */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex" role="tablist">
            <button
              id="chats-tab-button"
              role="tab"
              aria-controls="chats-tab"
              aria-selected={viewMode === 'chats'}
              onClick={() => handleToggleView('chats')}
              className={`flex-1 py-3 text-center font-medium ${
                viewMode === 'chats'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <FiMessageSquare className="mr-2" />
                <span>Chats</span>
              </div>
            </button>
            <button
              id="contacts-tab-button"
              role="tab"
              aria-controls="contacts-tab"
              aria-selected={viewMode === 'contacts'}
              onClick={() => handleToggleView('contacts')}
              className={`flex-1 py-3 text-center font-medium ${
                viewMode === 'contacts'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center justify-center">
                <FiUsers className="mr-2" />
                <span>Contactos</span>
              </div>
            </button>
            <button
              title="Herramienta de diagnóstico"
              onClick={() => setShowDebugger(!showDebugger)}
              className={`px-3 py-3 text-center ${
                showDebugger
                  ? 'text-orange-600'
                  : 'text-gray-400 hover:text-gray-500'
              }`}
            >
              <FiAlertTriangle size={18} />
            </button>
          </div>
        </div>
        
        {/* Depurador de API de chat - visible solo cuando está activado */}
        {showDebugger && (
          <ChatDebugger />
        )}
        
        {/* Contenedor principal con layout responsive */}
        <div className="flex flex-1 overflow-hidden">
          {/* Panel izquierdo (Listas) - Visible en escritorio o cuando está seleccionado en móvil */}
          {(viewMode === 'chats' || viewMode === 'contacts') && (
            <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
              {viewMode === 'chats' ? (
                <div id="chats-tab" role="tabpanel" aria-labelledby="chats-tab-button" className="h-full flex flex-col">
                  {hasNoChats ? (
                    <WelcomeMessage 
                      isPsychologist={isPsychologist}
                      onContactsClick={handleWelcomeContactClick}
                    />
                  ) : (
                    <>
                      <div className="p-4 bg-white border-b border-gray-200">
                        <div className="flex justify-between items-center">
                          <h2 className="text-lg font-semibold text-gray-800">Mis conversaciones</h2>
                          <button 
                            onClick={() => handleToggleView('contacts')}
                            className="text-blue-600 text-sm flex items-center font-medium hover:text-blue-700"
                          >
                            <FiUsers className="mr-1" /> Iniciar nueva conversación
                          </button>
                        </div>
                      </div>
                      <ChatList 
                        onSelectChat={handleSelectChat}
                        activeChatId={selectedChatId}
                      />
                    </>
                  )}
                </div>
              ) : (
                <div id="contacts-tab" role="tabpanel" aria-labelledby="contacts-tab-button" className="h-full">
                  <ContactList 
                    onSelectContact={handleSelectContact}
                    loading={creatingChat}
                  />
                </div>
              )}
            </div>
          )}
          
          {/* Panel derecho (Conversación) - Visible cuando hay un chat seleccionado */}
          {(viewMode === 'conversation' && selectedChatId) && (
            <div className="w-full md:w-2/3 flex flex-col">
              <ChatHeader 
                chatInfo={chatInfo}
                isPsychologist={isPsychologist}
                onBack={handleBackToList}
                onChangeStatus={handleChangeStatus}
                showBackButton={true}
              />
              
              <div className="flex-1 overflow-y-auto bg-white">
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : error ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <FiMessageCircle size={24} className="mb-2" />
                    <p>{error}</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 p-4">
                    <FiMessageCircle size={32} className="mb-2" />
                    <p className="text-center">No hay mensajes en esta conversación</p>
                    <p className="text-sm text-center mt-1">Envía un mensaje para comenzar a chatear</p>
                  </div>
                ) : (
                  <ChatMessageList 
                    messages={messages}
                    currentUserId={user?.id}
                    onDeleteMessage={handleDeleteMessage}
                    formatFileSize={formatFileSize}
                    getFileIcon={getFileIcon}
                    isLoading={loading}
                  />
                )}
              </div>
              
              <div className="border-t border-gray-200 p-2">
                <ChatInput 
                  onSendMessage={handleSendMessage}
                  onSendFile={handleSendFile}
                  disabled={!chatInfo || chatInfo.estado !== 'activo'}
                />
              </div>
            </div>
          )}
          
          {/* Estado vacío (cuando no hay chat seleccionado y es pantalla grande) */}
          {viewMode === 'conversation' && !selectedChatId && (
            <div className="hidden md:flex flex-1 items-center justify-center">
              <div className="text-center p-8">
                <FiMessageCircle size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Selecciona un chat</h3>
                <p className="text-gray-500">
                  Elige una conversación de la lista para ver los mensajes
                </p>
                <button 
                  onClick={() => handleToggleView('contacts')}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <span className="flex items-center justify-center">
                    <FiUsers className="mr-2" />
                    Iniciar nueva conversación
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
