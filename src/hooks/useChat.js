import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import ChatService from '../services/api/chatService';
import { useAuth } from './useAuth';

/**
 * Hook personalizado para la gestión del chat
 * Siguiendo principios SOLID y DRY
 */
export const useChat = (chatId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatInfo, setChatInfo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const { user } = useAuth();
  
  // Instancia del servicio
  const chatService = new ChatService();
  
  // Cargar información del chat
  const loadChatInfo = useCallback(async () => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await chatService.getChatById(chatId);
      const data = response.data || response;
      
      console.log('useChat - Chat info recibida:', data);
      console.log('useChat - User actual:', user);
      console.log('useChat - Es psicólogo:', user?.rol === 'psicologo' || user?.role === 'psicologo');
      
      setChatInfo(data);
    } catch (err) {
      console.error('Error loading chat info:', err);
      setError('No se pudo cargar la información del chat');
      toast.error('Error al cargar la información del chat');
    } finally {
      setLoading(false);
    }
  }, [chatId, user]);
  
  // Cargar mensajes del chat
  const loadMessages = useCallback(async (options = {}) => {
    if (!chatId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await chatService.getChatMessages(chatId, options);
      const data = response.data || response;
      
      // Formatear URLs de archivos
      const formattedMessages = data.map(message => {
        if (message.rutaArchivo) {
          return {
            ...message,
            rutaArchivo: chatService.formatFileUrl(message.rutaArchivo)
          };
        }
        return message;
      });
      
      setMessages(formattedMessages);
    } catch (err) {
      console.error('Error loading messages:', err);
      setError('No se pudieron cargar los mensajes');
      toast.error('Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  }, [chatId]);
  
  // Enviar mensaje de texto
  const sendMessage = async (contenido) => {
    if (!chatId || !contenido.trim()) return null;
    
    try {
      setSendingMessage(true);
      
      const response = await chatService.sendMessage(chatId, contenido);
      const data = response.data || response;
      
      // Actualizar mensajes locales
      setMessages(prevMessages => [...prevMessages, data]);
      
      return data;
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Error al enviar el mensaje');
      return null;
    } finally {
      setSendingMessage(false);
    }
  };
  
  // Enviar archivo
  const sendFile = async (file) => {
    console.log('useChat - sendFile ENTRY:', { 
      chatId, 
      fileExists: !!file,
      fileName: file?.name, 
      fileSize: file?.size, 
      fileType: file?.type 
    });
    
    if (!chatId) {
      console.error('useChat - sendFile: No chatId provided');
      toast.error('ID de chat no válido');
      return null;
    }
    
    if (!file) {
      console.error('useChat - sendFile: No file provided');
      toast.error('No se seleccionó ningún archivo');
      return null;
    }
    
    console.log('useChat - sendFile: Starting validations...');
    
    // Validaciones
    if (!chatService.isValidFileType(file)) {
      console.warn('useChat - File type not allowed:', file.type);
      toast.error('Tipo de archivo no permitido');
      return null;
    }
    console.log('useChat - File type validation passed');
    
    if (!chatService.isValidFileSize(file)) {
      console.warn('useChat - File size too large:', file.size);
      toast.error('El archivo excede el tamaño máximo permitido (10MB)');
      return null;
    }
    console.log('useChat - File size validation passed');

    try {
      setUploadingFile(true);
      console.log('useChat - About to call chatService.sendFileMessage...');
      
      const response = await chatService.sendFileMessage(chatId, file);
      console.log('useChat - chatService.sendFileMessage returned:', response);
      
      const data = response.data || response;
      console.log('useChat - Extracted data:', data);
      
      // Formatear URL del archivo
      const messageWithFormattedUrl = {
        ...data,
        rutaArchivo: chatService.formatFileUrl(data.rutaArchivo)
      };
      console.log('useChat - Message with formatted URL:', messageWithFormattedUrl);
      
      // Actualizar mensajes locales
      setMessages(prevMessages => {
        const newMessages = [...prevMessages, messageWithFormattedUrl];
        console.log('useChat - Updated messages array length:', newMessages.length);
        return newMessages;
      });
      
      toast.success('Archivo enviado exitosamente');
      return messageWithFormattedUrl;
    } catch (err) {
      console.error('useChat - Error sending file:', err);
      console.error('useChat - Error details:', {
        message: err.message,
        status: err.status,
        response: err.response,
        stack: err.stack
      });
      toast.error(`Error al enviar el archivo: ${err.message || 'Error desconocido'}`);
      return null;
    } finally {
      setUploadingFile(false);
      console.log('useChat - sendFile completed, uploadingFile set to false');
    }
  };
  
  // Eliminar mensaje
  const deleteMessage = async (messageId) => {
    if (!messageId) return false;
    
    try {
      await chatService.deleteMessage(messageId);
      
      // Eliminar mensaje del estado local
      setMessages(prevMessages => prevMessages.filter(m => m.id !== messageId));
      
      toast.success('Mensaje eliminado');
      return true;
    } catch (err) {
      console.error('Error deleting message:', err);
      toast.error('Error al eliminar el mensaje');
      return false;
    }
  };
  
  // Cambiar estado del chat
  const updateChatStatus = async (estado) => {
    if (!chatId) return false;
    
    try {
      const response = await chatService.updateChatStatus(chatId, estado);
      const data = response.data || response;
      
      // Actualizar información local
      setChatInfo(data);
      
      toast.success('Estado del chat actualizado');
      return true;
    } catch (err) {
      console.error('Error updating chat status:', err);
      toast.error('Error al actualizar el estado del chat');
      return false;
    }
  };

  // Crear chat o recuperar uno existente
  const createOrGetChat = async (psicologoId, pacienteId) => {
    try {
      setLoading(true);
      setError(null);
      
      // Validar que la relación sea válida
      // Si el usuario es paciente, solo puede chatear con su psicólogo asignado
      // Si el usuario es psicólogo, solo puede chatear con sus pacientes asignados
      if (user?.rol === 'paciente' && user?.id !== pacienteId) {
        setError('No tienes permiso para crear este chat');
        toast.error('Solo puedes chatear con tu psicólogo asignado');
        return null;
      }
      
      if (user?.rol === 'psicologo' && user?.id !== psicologoId) {
        setError('No tienes permiso para crear este chat');
        toast.error('Solo puedes chatear con tus pacientes asignados');
        return null;
      }
      
      const response = await chatService.createOrGetChat(psicologoId, pacienteId);
      const data = response.data || response;
      
      setChatInfo(data);
      return data;
    } catch (err) {
      console.error('Error creating chat:', err);
      setError('No se pudo crear el chat');
      toast.error('Error al crear el chat');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Obtener chats del usuario
  const getUserChats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await chatService.getUserChats();
      const data = response.data || response;
      
      return data;
    } catch (err) {
      console.error('Error getting user chats:', err);
      setError('No se pudieron cargar los chats');
      toast.error('Error al cargar los chats');
      return [];
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar información inicial
  useEffect(() => {
    if (chatId) {
      loadChatInfo();
      loadMessages();
    }
  }, [chatId, loadChatInfo, loadMessages]);
  
  // Helpers formatters
  const formatFileSize = chatService.formatFileSize;
  const getFileIcon = chatService.getFileIcon;
  
  // Devolver información y funciones
  return {
    // Estado
    loading,
    error,
    sendingMessage,
    uploadingFile,
    
    // Datos
    chatInfo,
    messages,
    user,
    
    // Funciones principales
    loadMessages,
    sendMessage,
    sendFile,
    deleteMessage,
    updateChatStatus,
    createOrGetChat,
    getUserChats,
    
    // Helpers
    formatFileSize,
    getFileIcon,
    
    // Verificaciones
    isOwnMessage: (messageId) => {
      const message = messages.find(m => m.id === messageId);
      return message && message.idEmisor === user?.id;
    },
    
    isPsychologist: () => user?.role === 'psicologo',
    isPatient: () => user?.role === 'paciente',
    
    canDeleteMessage: (messageId) => {
      const message = messages.find(m => m.id === messageId);
      return message && message.idEmisor === user?.id;
    },
    
    isActiveChat: () => chatInfo && chatInfo.estado === 'activo'
  };
};

export default useChat;
