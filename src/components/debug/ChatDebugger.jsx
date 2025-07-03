import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ENDPOINTS } from '../../config/api';
import ChatService from '../../services/api/chatService';

/**
 * Componente para depurar problemas específicos con la API de chat
 */
const ChatDebugger = () => {
  const [apiStatus, setApiStatus] = useState(null);
  const [contacts, setContacts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const { user } = useAuth();
  const chatService = new ChatService();

  useEffect(() => {
    const checkChatApiStatus = async () => {
      try {
        setIsLoading(true);
        
        // Step 1: Verificar si hay un usuario y tiene rol
        if (!user || !user.id) {
          setErrorMsg('No hay usuario autenticado o falta ID');
          return;
        }
        
        // Step 2: Verificar rutas de API relevantes para chat según el rol
        const endpointsToCheck = [];
        let contactsResult = [];
        
        // Añadir endpoints específicos según el rol
        if (user.rol === 'psicologo') {
          endpointsToCheck.push({
            name: 'Lista de Pacientes',
            url: `${ENDPOINTS.BASE_URL}/psicologos/${user.id}/pacientes`
          });
          endpointsToCheck.push({
            name: 'Lista de Psicólogos',
            url: `${ENDPOINTS.BASE_URL}/psicologos`
          });
        } else if (user.rol === 'paciente') {
          endpointsToCheck.push({
            name: 'Información del Paciente',
            url: `${ENDPOINTS.BASE_URL}/pacientes/${user.id}`
          });
        }
        
        // Comprobar cada endpoint
        const results = await Promise.all(endpointsToCheck.map(async (endpoint) => {
          try {
            const headers = {};
            const token = localStorage.getItem('token');
            if (token) {
              headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(endpoint.url, {
              method: 'GET',
              headers,
              credentials: 'include'
            });
            
            const responseData = await response.json();
            
            return {
              name: endpoint.name,
              url: endpoint.url,
              status: response.status,
              ok: response.ok,
              data: responseData
            };
          } catch (err) {
            return {
              name: endpoint.name,
              url: endpoint.url,
              error: err.message,
              ok: false
            };
          }
        }));
        
        setApiStatus(results);
        
        // Step 3: Intentar obtener contactos
        try {
          contactsResult = await chatService.getAvailableContacts(user.id, user.rol);
          setContacts(contactsResult || []);
        } catch (contactsError) {
          console.error('Error getting contacts in debugger:', contactsError);
          setContacts([]);
        }
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (user) {
      checkChatApiStatus();
    } else {
      setIsLoading(false);
      setErrorMsg('No hay usuario autenticado');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
        <h2 className="text-lg font-semibold text-blue-800 mb-2">Verificando API de chat...</h2>
        <div className="animate-pulse bg-blue-100 h-8 rounded w-3/4"></div>
      </div>
    );
  }

  if (errorMsg && !apiStatus) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg mb-4">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-600">{errorMsg}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">Diagnóstico de API Chat</h2>
      
      {/* User Info */}
      <div className="mb-4 p-3 bg-blue-50 rounded">
        <h3 className="text-md font-medium mb-2">Información de Usuario</h3>
        <p><strong>ID:</strong> {user?.id || 'No disponible'}</p>
        <p><strong>Rol:</strong> {user?.rol || 'No disponible'}</p>
        <p><strong>Email:</strong> {user?.email || 'No disponible'}</p>
      </div>
      
      {/* API Endpoints Status */}
      {apiStatus && apiStatus.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Estado de Endpoints</h3>
          
          <div className="space-y-2">
            {apiStatus.map((endpoint, index) => (
              <div 
                key={index} 
                className={`p-3 rounded ${endpoint.ok ? 'bg-green-50 border border-green-100' : 'bg-red-50 border border-red-100'}`}
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">{endpoint.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${endpoint.ok ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {endpoint.status || (endpoint.error ? 'Error' : 'N/A')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 mt-1">{endpoint.url}</p>
                
                {endpoint.error && (
                  <p className="text-sm text-red-600 mt-1">{endpoint.error}</p>
                )}
                
                {endpoint.data && (
                  <details className="mt-2">
                    <summary className="text-sm text-blue-600 cursor-pointer">Ver datos (JSON)</summary>
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                      {JSON.stringify(endpoint.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Contacts */}
      <div className="mb-4">
        <h3 className="text-md font-medium mb-2">Contactos Disponibles</h3>
        
        {contacts === null ? (
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded">
            <p className="text-yellow-700">Cargando contactos...</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="p-3 bg-yellow-50 border border-yellow-100 rounded">
            <p className="text-yellow-700">No se encontraron contactos</p>
          </div>
        ) : (
          <div className="border border-gray-200 rounded">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contacts.map((contact, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-3 text-sm text-gray-900">{contact.id || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{contact.nombre || 'Sin nombre'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{contact.email || 'Sin email'}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        contact.tipo === 'psicologo' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {contact.tipo || 'desconocido'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Debug Actions */}
      <div className="pt-2 border-t border-gray-200 mt-3 flex space-x-2">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refrescar
        </button>
        <button
          onClick={() => {
            // Reiniciar localStorage y forzar recarga completa
            localStorage.removeItem('lastAuthCheck');
            window.location.reload();
          }}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Forzar recarga de autenticación
        </button>
      </div>
    </div>
  );
};

export default ChatDebugger;
