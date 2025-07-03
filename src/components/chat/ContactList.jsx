import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../hooks/useAuth';
import { FiSearch, FiUser, FiUsers } from 'react-icons/fi';
import { toast } from 'react-toastify';
import ChatService from '../../services/api/chatService';

/**
 * Componente que muestra contactos disponibles para chatear
 * - Psicólogos ven: sus pacientes asignados y otros psicólogos
 * - Pacientes ven: su psicólogo asignado
 */
const ContactList = ({ onSelectContact, loading: externalLoading = false }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const chatService = new ChatService();
  
  const isPsychologist = user?.rol === 'psicologo';

  // Cargar contactos
  useEffect(() => {
    const loadContacts = async () => {
      if (!user?.id) {
        console.warn('No user ID available for loading contacts');
        setError('Necesita iniciar sesión para ver contactos');
        return;
      }
      
      // Validar rol
      const userRole = user?.rol || user?.role;
      if (!userRole) {
        console.warn('User role is missing:', user);
        setError('Información de usuario incompleta');
        return;
      }
      
      console.log('Loading contacts for user:', user);
      setLoading(true);
      setError(null);
      
      try {
        console.log('Calling getAvailableContacts with:', user.id, userRole);
        
        // Mostrar información de depuración
        const storedToken = localStorage.getItem('token');
        console.log('Current token exists:', !!storedToken);
        if (storedToken) {
          // Mostrar solo los primeros 10 caracteres del token para depuración
          const tokenPreview = storedToken.substring(0, 10) + '...';
          console.log('Token preview:', tokenPreview);
          
          // Verificar si el token está expirado
          try {
            const payload = JSON.parse(atob(storedToken.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp < currentTime) {
              console.warn('Token has expired');
              setError('Su sesión ha expirado, por favor inicie sesión nuevamente');
              return;
            } else {
              console.log('Token is valid, expires at:', new Date(payload.exp * 1000).toLocaleString());
            }
          } catch (e) {
            console.error('Error parsing token:', e);
          }
        }
        
        const contactsList = await chatService.getAvailableContacts(user.id, userRole);
        console.log('Contacts loaded:', contactsList);
        
        if (!Array.isArray(contactsList)) {
          console.error('Contacts list is not an array:', contactsList);
          setError('Formato de respuesta inválido');
          return;
        }
        
        setContacts(contactsList);
        
        // Si no hay contactos, mostrar mensaje apropiado
        if (contactsList.length === 0) {
          console.log('No contacts found');
          if (isPsychologist) {
            setError('No tienes pacientes asignados en este momento');
          } else {
            setError('No tienes un psicólogo asignado en este momento');
          }
        }
      } catch (err) {
        console.error('Error loading contacts:', err);
        setError(`Error al cargar los contactos: ${err.message}`);
        toast.error('Error al cargar los contactos');
      } finally {
        setLoading(false);
      }
    };
    
    loadContacts();
  }, [user?.id, user?.rol, isPsychologist]);
  
  // Filtrar contactos según término de búsqueda
  const filteredContacts = contacts.filter(contact => {
    return contact.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
           contact.email.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  // Renderizar estado de carga
  if (loading || externalLoading) {
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
        <FiUsers size={32} className="mb-2" />
        <p>No se pudieron cargar los contactos.</p>
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
  if (contacts.length === 0 && !loading) {
    return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Título con botón de volver */}
        <div className="p-4 border-b bg-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Contactos</h2>
              <p className="text-sm text-gray-500">
                {isPsychologist ? 'Tus pacientes y colegas' : 'Tu psicólogo asignado'}
              </p>
            </div>
            <button 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-800"
            >
              <span className="text-sm">Volver</span>
            </button>
          </div>
        </div>
        
        {/* Estado vacío con diseño mejorado */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-md w-full">
            <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
              <FiUsers size={32} className="text-blue-500" />
            </div>
            {isPsychologist ? (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Sin pacientes asignados</h3>
                <p className="text-center text-gray-600 mb-2">
                  Cuando tengas pacientes asignados, aparecerán en esta lista para que puedas iniciar conversaciones con ellos.
                </p>
                <p className="text-center text-sm text-gray-500 mb-4">
                  También podrás comunicarte con otros psicólogos cuando estén disponibles en el sistema.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">Sin psicólogo asignado</h3>
                <p className="text-center text-gray-600 mb-2">
                  Necesitas tener un psicólogo asignado para poder iniciar una conversación.
                </p>
                <p className="text-center text-sm text-gray-500 mb-4">
                  Por favor, contacta con la administración para que te asignen un profesional.
                </p>
              </>
            )}
            <button 
              onClick={() => window.location.href = isPsychologist ? '/dashboard/psicologo' : '/dashboard/paciente'}
              className="w-full mt-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Ir al Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Título */}
      <div className="p-4 border-b bg-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Contactos</h2>
            <p className="text-sm text-gray-500">
              {isPsychologist ? 'Tus pacientes y colegas' : 'Tu psicólogo asignado'}
            </p>
          </div>
          <button 
            onClick={() => window.history.back()}
            className="text-gray-600 hover:text-gray-800"
          >
            <span className="text-sm">Volver</span>
          </button>
        </div>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="p-4 border-b">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar contacto..."
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Lista de contactos */}
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
            <p>No se encontraron contactos</p>
          </div>
        ) : (
          <div className="p-2">
            {isPsychologist && (
              <div className="mb-2 px-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Tus pacientes
                </h3>
              </div>
            )}
            
            {/* Mostrar pacientes primero para psicólogos */}
            {isPsychologist && filteredContacts
              .filter(contact => contact.tipo === 'paciente')
              .map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => onSelectContact(contact)}
                  className="flex items-center p-3 mb-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-blue-600" size={18} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{contact.nombre || 'Paciente'}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                </div>
              ))}
              
            {isPsychologist && (
              <div className="mt-4 mb-2 px-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Otros profesionales
                </h3>
              </div>
            )}
            
            {/* Mostrar psicólogos para todos */}
            {filteredContacts
              .filter(contact => contact.tipo === 'psicologo')
              .map((contact) => (
                <div 
                  key={contact.id}
                  onClick={() => onSelectContact(contact)}
                  className="flex items-center p-3 mb-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                >
                  <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-indigo-600" size={18} />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{contact.nombre || 'Psicólogo'}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

ContactList.propTypes = {
  onSelectContact: PropTypes.func.isRequired,
  loading: PropTypes.bool
};

export default ContactList;
