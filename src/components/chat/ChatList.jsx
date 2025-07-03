import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ChatListItem from './ChatListItem';
import { useAuth } from '../../hooks/useAuth';
import ChatService from '../../services/api/chatService';
import { FiSearch, FiMessageSquare } from 'react-icons/fi';

/**
 * Componente que muestra una lista de chats
 */
const ChatList = ({ onSelectChat, activeChatId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const chatService = new ChatService();
  
  const isPsychologist = user?.rol === 'psicologo' || user?.role === 'psicologo';
  
  console.log('ChatList - User:', user);
  console.log('ChatList - isPsychologist:', isPsychologist);

  // Cargar chats
  useEffect(() => {
    const loadChats = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await chatService.getUserChats();
        const data = response.data || response;
        console.log('ChatList - Chats recibidos:', data);
        
        // Añadir log específico para cada chat para verificar estructura
        data.forEach((chat, index) => {
          console.log(`ChatList - Chat ${index}:`, chat);
          console.log(`ChatList - Chat ${index} - Paciente:`, chat.paciente);
          console.log(`ChatList - Chat ${index} - Psicólogo:`, chat.psicologo);
        });
        
        setChats(data);
      } catch (err) {
        console.error('Error loading chats:', err);
        setError('No se pudieron cargar los chats');
      } finally {
        setLoading(false);
      }
    };
    
    loadChats();
  }, [user?.id]);
  
  // Filtrar chats según término de búsqueda
  const filteredChats = chats.filter(chat => {
    // IMPORTANTE: Forzar que se busque en pacientes cuando el usuario es psicólogo
    const contactInfo = isPsychologist ? chat.paciente?.user : chat.psicologo?.user;
    
    // Construir nombre para búsqueda
    let contactName = '';
    if (contactInfo?.first_name || contactInfo?.last_name) {
      contactName = `${contactInfo?.first_name || ''} ${contactInfo?.last_name || ''}`.toLowerCase();
    } else if (contactInfo?.name) {
      contactName = contactInfo.name.toLowerCase();
    } else if (contactInfo?.email) {
      contactName = contactInfo.email.toLowerCase();
    }
    
    console.log(`ChatList - Filtrando chat ${chat.id} - contactInfo:`, contactInfo);
    console.log(`ChatList - Filtrando chat ${chat.id} - contactName:`, contactName);
    
    return contactName.includes(searchTerm.toLowerCase());
  });
  
  // Renderizar estado de carga
  if (loading) {
    return (
      <div className="flex flex-col h-full p-4 bg-gray-50">
        <div className="animate-pulse flex space-x-4 mb-4">
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        {[1, 2, 3].map((item) => (
          <div key={item} className="animate-pulse flex p-3 mb-2 rounded-lg">
            <div className="rounded-full bg-gray-200 h-12 w-12"></div>
            <div className="flex-1 ml-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  // Renderizar estado de error
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50 text-gray-500">
        <FiMessageSquare size={32} className="mb-2" />
        <p>No se pudieron cargar los chats.</p>
        <button 
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    );
  }
  
  // Renderizar lista vacía
  if (chats.length === 0) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Barra de búsqueda desactivada */}
        <div className="p-4 border-b bg-white opacity-50">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              disabled
              placeholder="Buscar conversación..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
        
        {/* Mensaje de sin conversaciones */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
          <FiMessageSquare size={48} className="mb-4 text-gray-400" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            {isPsychologist 
              ? "Sin conversaciones activas" 
              : "Sin conversación con tu psicólogo"}
          </h3>
          <p className="text-center mb-6">
            {isPsychologist 
              ? "No tienes conversaciones activas con tus pacientes. Puedes iniciar una desde la pestaña de contactos." 
              : "No tienes una conversación activa con tu psicólogo. Puedes iniciar una desde la pestaña de contactos."
            }
          </p>
          <button
            className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            onClick={() => {
              // Find the contacts tab button and click it
              const contactsTabButton = document.getElementById('contacts-tab-button');
              if (contactsTabButton) {
                contactsTabButton.click();
              }
            }}
          >
            <FiMessageSquare className="mr-2" />
            Iniciar nueva conversación
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Barra de búsqueda */}
      <div className="p-4 border-b">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar conversación..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Lista de chats */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
            <p>No se encontraron resultados</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            console.log(`ChatList - Renderizando chat ${chat.id}:`, chat);
            console.log(`ChatList - isPsychologist para chat ${chat.id}:`, isPsychologist);
            
            return (
              <div 
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="cursor-pointer"
              >
                <ChatListItem 
                  chat={chat} 
                  currentUserId={user?.id}
                  isPsychologist={isPsychologist}
                  isActive={chat.id === activeChatId}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

ChatList.propTypes = {
  onSelectChat: PropTypes.func.isRequired,
  activeChatId: PropTypes.number
};

export default ChatList;
