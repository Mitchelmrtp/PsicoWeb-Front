/**
 * Chat API Service
 * Aplica Single Responsibility Principle
 * Maneja todas las comunicaciones con la API de chat
 */
import BaseApiService from './baseApi';
import { ENDPOINTS } from '../../config/api';

class ChatService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.CHAT || `${ENDPOINTS.BASE_URL}/chat`);
  }

  // ============ MÉTODOS DE CHAT ============

  /**
   * Obtener todos los chats del usuario autenticado
   */
  async getUserChats() {
    console.log('chatService - Fetching user chats');
    const response = await this.get();
    console.log('chatService - Received user chats:', response);
    return response;
  }

  /**
   * Obtener un chat específico por ID
   */
  async getChatById(chatId) {
    console.log('chatService - Fetching chat with ID:', chatId);
    const response = await this.get(`/${chatId}`);
    console.log('chatService - Received chat data:', response);
    return response;
  }

  /**
   * Crear un nuevo chat o obtener uno existente
   */
  async createOrGetChat(psicologoId, pacienteId) {
    if (!psicologoId || !pacienteId) {
      throw new Error('Se requieren IDs de psicólogo y paciente');
    }

    return this.post('', {
      idPsicologo: psicologoId,
      idPaciente: pacienteId
    });
  }

  /**
   * Actualizar estado del chat
   */
  async updateChatStatus(chatId, estado) {
    return this.put(`/${chatId}/status`, { estado });
  }

  // ============ MÉTODOS DE MENSAJES ============

  /**
   * Obtener mensajes de un chat
   */
  async getChatMessages(chatId, options = {}) {
    const { page = 1, limit = 50, order = 'ASC' } = options;
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      order
    });
    
    return this.get(`/${chatId}/messages?${params}`);
  }

  /**
   * Enviar mensaje de texto
   */
  async sendMessage(chatId, contenido) {
    return this.post('/messages', {
      idChat: chatId,
      contenido,
      tipoMensaje: 'texto'
    });
  }

  /**
   * Enviar mensaje con archivo
   */
  async sendFileMessage(chatId, file) {
    console.log('chatService - sendFileMessage ENTRY:', { 
      chatId, 
      fileName: file.name, 
      size: file.size, 
      type: file.type,
      lastModified: file.lastModified 
    });
    
    if (!chatId) {
      throw new Error('chatId is required for file upload');
    }
    
    if (!file) {
      throw new Error('file is required for file upload');
    }
    
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('idChat', chatId);

    console.log('chatService - FormData created with entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
    }
    
    const endpoint = `/${chatId}/messages/file`;
    console.log('chatService - About to call postFormData with endpoint:', endpoint);
    
    try {
      const response = await this.postFormData(endpoint, formData);
      console.log('chatService - File upload successful response:', response);
      return response;
    } catch (error) {
      console.error('chatService - File upload error:', error);
      console.error('chatService - Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        response: error.response,
        stack: error.stack
      });
      throw error;
    }
  }

  /**
   * Eliminar mensaje
   */
  async deleteMessage(messageId) {
    return this.delete(`/messages/${messageId}`);
  }

  /**
   * Buscar contactos disponibles según rol
   * - Psicólogos: sus pacientes y otros psicólogos
   * - Pacientes: su psicólogo asignado
   */
  async getAvailableContacts(userId, userRole) {
    try {
      console.log('=== CHAT: getAvailableContacts called ===');
      console.log('User ID:', userId, 'User Role:', userRole);
      let contacts = [];
      
      if (userRole === 'psicologo') {
        // Para psicólogos: obtener pacientes asignados
        console.log('=== CHAT: Fetching patients for psychologist ===');
        // Correct URL based on the actual backend route 
        const pacientesUrl = `${ENDPOINTS.BASE_URL}/psicologos/${userId}/pacientes`;
        console.log('Patients URL:', pacientesUrl);
        
        try {
          const headers = this.getHeaders();
          console.log('Request headers for patients:', headers);
          
          const pacientesResponse = await fetch(pacientesUrl, {
            method: 'GET',
            headers,
            credentials: 'include' // Add credentials to include cookies
          });
          
          console.log('Patients response status:', pacientesResponse.status);
          console.log('Patients response headers:', Object.fromEntries(pacientesResponse.headers.entries()));
          
          if (!pacientesResponse.ok) {
            const errorText = await pacientesResponse.text();
            console.error('=== CHAT: Failed to fetch patients ===');
            console.error('Status:', pacientesResponse.status);
            console.error('Status Text:', pacientesResponse.statusText);
            console.error('Error response:', errorText);
            console.error('Request URL was:', pacientesUrl);
            console.error('Request headers were:', headers);
            
            // Don't throw error, continue to try other contacts
            console.warn('Continuing without patients due to error...');
          } else {
            const pacientesData = await pacientesResponse.json();
            console.log('=== CHAT: Patients data received ===');
            console.log('Raw patients data:', JSON.stringify(pacientesData, null, 2));
            
            if (pacientesData && pacientesData.data && Array.isArray(pacientesData.data)) {
              const patientContacts = pacientesData.data.map(paciente => {
                console.log('Processing patient:', paciente);
                return {
                  id: paciente.id,
                  nombre: paciente.user ? `${paciente.user.first_name || ''} ${paciente.user.last_name || ''}`.trim() : 'Paciente',
                  email: paciente.user?.email || '',
                  tipo: 'paciente'
                };
              });
              contacts = patientContacts;
              console.log('=== CHAT: Patient contacts added ===');
              console.log('Patient contacts:', patientContacts);
            } else {
              console.warn('=== CHAT: Patients data is missing or has invalid structure ===');
              console.warn('Expected data.data array, got:', typeof pacientesData?.data, pacientesData?.data);
            }
          }
        } catch (err) {
          console.error('=== CHAT: Error fetching patients ===');
          console.error('Error details:', err);
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
          // Continue execution to try to fetch psychologists
        }
        
        // También obtener otros psicólogos
        console.log('=== CHAT: Fetching other psychologists ===');
        // Fix: Use the correct API route for getting all psychologists
        const psicologosUrl = `${ENDPOINTS.BASE_URL}/psicologos`;
        console.log('Psychologists URL:', psicologosUrl);
        
        try {
          const psicologosResponse = await fetch(psicologosUrl, {
            method: 'GET',
            headers: this.getHeaders()
          });
          
          console.log('Psychologists response status:', psicologosResponse.status);
          console.log('Psychologists response headers:', Object.fromEntries(psicologosResponse.headers.entries()));
          
          if (psicologosResponse.ok) {
            const psicologosData = await psicologosResponse.json();
            console.log('=== CHAT: Psychologists data received ===');
            console.log('Raw psychologists data:', JSON.stringify(psicologosData, null, 2));
            
            if (psicologosData && psicologosData.data && Array.isArray(psicologosData.data)) {
              const otrosPsicologos = psicologosData.data
                .filter(p => p.id !== userId)
                .map(psicologo => {
                  console.log('Processing psychologist:', psicologo);
                  return {
                    id: psicologo.id,
                    nombre: psicologo.user ? `${psicologo.user.first_name || ''} ${psicologo.user.last_name || ''}`.trim() : 'Psicólogo',
                    email: psicologo.user?.email || '',
                    tipo: 'psicologo'
                  };
                });
                
              console.log('=== CHAT: Other psychologists processed ===');
              console.log('Other psychologists:', otrosPsicologos);
              contacts = [...contacts, ...otrosPsicologos];
              console.log('=== CHAT: All contacts after adding psychologists ===');
              console.log('Total contacts:', contacts);
            } else {
              console.warn('=== CHAT: Psychologists data is missing or has invalid structure ===');
              console.warn('Expected data.data array, got:', typeof psicologosData?.data, psicologosData?.data);
            }
          } else {
            const errorText = await psicologosResponse.text();
            console.error('=== CHAT: Failed to fetch psychologists ===');
            console.error('Status:', psicologosResponse.status);
            console.error('Status Text:', psicologosResponse.statusText);
            console.error('Error response:', errorText);
          }
        } catch (err) {
          console.error('=== CHAT: Error fetching other psychologists ===');
          console.error('Error details:', err);
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
          // Continue with whatever contacts we have
        }
      } else if (userRole === 'paciente') {
        // Para pacientes: obtener psicólogo asignado
        console.log('=== CHAT: Fetching assigned psychologist for patient ===');
        // Fix: Use the correct API route for getting patient info
        const pacienteUrl = `${ENDPOINTS.BASE_URL}/pacientes/${userId}`;
        console.log('Patient URL:', pacienteUrl);
        
        try {
          const pacienteResponse = await fetch(pacienteUrl, {
            method: 'GET',
            headers: this.getHeaders()
          });
          
          console.log('Patient response status:', pacienteResponse.status);
          console.log('Patient response headers:', Object.fromEntries(pacienteResponse.headers.entries()));
          
          if (!pacienteResponse.ok) {
            const errorText = await pacienteResponse.text();
            console.error('=== CHAT: Failed to fetch patient ===');
            console.error('Status:', pacienteResponse.status);
            console.error('Status Text:', pacienteResponse.statusText);
            console.error('Error response:', errorText);
            console.error('Request URL was:', pacienteUrl);
            
            // Don't throw error, return empty contacts instead
            console.warn('Returning empty contacts due to patient fetch error');
            return [];
          }
          
          const pacienteData = await pacienteResponse.json();
          console.log('=== CHAT: Patient data received ===');
          console.log('Raw patient data:', JSON.stringify(pacienteData, null, 2));
          
          if (pacienteData.data && pacienteData.data.idPsicologo) {
            console.log('=== CHAT: Found psychologist ID for patient ===');
            console.log('Psychologist ID:', pacienteData.data.idPsicologo);
            
            // Fix: Use the correct API route for getting psychologist info
            const psicologoUrl = `${ENDPOINTS.BASE_URL}/psicologos/${pacienteData.data.idPsicologo}`;
            console.log('Psychologist URL:', psicologoUrl);
            
            const psicologoResponse = await fetch(psicologoUrl, {
              method: 'GET',
              headers: this.getHeaders()
            });
          
            console.log('Psychologist response status:', psicologoResponse.status);
            console.log('Psychologist response headers:', Object.fromEntries(psicologoResponse.headers.entries()));
          
            if (psicologoResponse.ok) {
              const psicologoData = await psicologoResponse.json();
              console.log('=== CHAT: Psychologist data received ===');
              console.log('Raw psychologist data:', JSON.stringify(psicologoData, null, 2));
              
              const psychologistContact = {
                id: psicologoData.data.id,
                nombre: psicologoData.data.user ? `${psicologoData.data.user.first_name || ''} ${psicologoData.data.user.last_name || ''}`.trim() : 'Mi Psicólogo',
                email: psicologoData.data.user?.email || '',
                tipo: 'psicologo'
              };
              
              contacts = [psychologistContact];
              console.log('=== CHAT: Added psychologist to contacts ===');
              console.log('Psychologist contact:', psychologistContact);
            } else {
              const errorText = await psicologoResponse.text();
              console.error('=== CHAT: Failed to fetch psychologist ===');
              console.error('Status:', psicologoResponse.status);
              console.error('Status Text:', psicologoResponse.statusText);
              console.error('Error response:', errorText);
            }
          } else {
            console.log('=== CHAT: No psychologist assigned to this patient ===');
            console.log('Patient data structure:', pacienteData.data);
          }
        } catch (err) {
          console.error('=== CHAT: Error fetching patient or psychologist information ===');
          console.error('Error details:', err);
          console.error('Error message:', err.message);
          console.error('Error stack:', err.stack);
        }
      }
      
      console.log('=== CHAT: getAvailableContacts final result ===');
      console.log('Final contacts:', contacts);
      console.log('Contact count:', contacts.length);
      return contacts;
    } catch (error) {
      console.error('=== CHAT: Error getting available contacts ===');
      console.error('Error details:', error);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('User ID was:', userId);
      console.error('User role was:', userRole);
      
      // Return empty array instead of throwing
      return [];
    }
  }

  // ============ MÉTODOS HELPER ============

  /**
   * Formatear URL de archivo
   */
  formatFileUrl(rutaArchivo) {
    if (!rutaArchivo) return null;
    
    // Si ya es una URL completa, devolverla tal como está
    if (rutaArchivo.startsWith('http')) {
      return rutaArchivo;
    }
    
    // Construir URL relativa al servidor
    const baseUrl = ENDPOINTS.BASE_URL.replace('/api', '');
    return `${baseUrl}${rutaArchivo}`;
  }

  /**
   * Validar tipo de archivo
   */
  isValidFileType(file) {
    const allowedTypes = [
      // Imágenes
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      // Documentos
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      // Texto
      'text/plain', 'text/csv',
      // Archivos comprimidos
      'application/zip', 'application/x-rar-compressed'
    ];

    return allowedTypes.includes(file.type);
  }

  /**
   * Validar tamaño de archivo
   */
  isValidFileSize(file, maxSizeMB = 10) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Formatear tamaño de archivo
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Obtener icono por tipo de archivo
   */
  getFileIcon(mimeType) {
    if (!mimeType) return '📄';
    
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📕';
    if (mimeType.includes('word')) return '📝';
    if (mimeType.includes('excel') || mimeType.includes('sheet')) return '📊';
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️';
    if (mimeType.startsWith('text/')) return '📄';
    
    return '📎';
  }

  /**
   * Get request headers with authentication
   */
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('=== CHAT: Using token from localStorage ===');
      console.log('Token exists:', !!token);
      console.log('Token length:', token.length);
      console.log('Token preview:', token.substring(0, 20) + '...');
    } else {
      console.warn('=== CHAT: No authentication token found in localStorage ===');
      console.warn('Available localStorage keys:', Object.keys(localStorage));
    }
    
    console.log('=== CHAT: Request headers prepared ===');
    console.log('Headers:', headers);
    return headers;
  }
}

export default ChatService;
