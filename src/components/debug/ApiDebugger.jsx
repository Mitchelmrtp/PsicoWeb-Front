import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ENDPOINTS } from '../../config/api';

/**
 * Componente para depurar problemas de API y conexión
 */
const ApiDebugger = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [backendVersion, setBackendVersion] = useState(null);
  const [authState, setAuthState] = useState(null);
  const [userDetailsFromToken, setUserDetailsFromToken] = useState(null);
  const [userDetailsFromBackend, setUserDetailsFromBackend] = useState(null);
  const { user } = useAuth();

  // Obtener información de la API
  useEffect(() => {
    const checkBackendHealth = async () => {
      setLoading(true);
      try {
        // Check basic health endpoint
        const healthResponse = await fetch(`${ENDPOINTS.BASE_URL}/health`, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        const healthData = await healthResponse.json();
        setBackendVersion(healthData);
        
        // Check auth debug endpoint
        const token = localStorage.getItem('token');
        const authDebugResponse = await fetch(`${ENDPOINTS.BASE_URL}/auth/debug`, {
          headers: { 
            'Authorization': token ? `Bearer ${token}` : '',
            'Cache-Control': 'no-cache'
          }
        });
        const authDebugData = await authDebugResponse.json();
        setAuthState(authDebugData);
        
        // Parse JWT token if available
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const decodedToken = JSON.parse(window.atob(base64));
            setUserDetailsFromToken(decodedToken);
          } catch (e) {
            console.error('Error parsing JWT token:', e);
            setUserDetailsFromToken({ error: 'Invalid token format' });
          }
        }
        
        // Get current user details from backend
        if (token) {
          try {
            const userResponse = await fetch(`${ENDPOINTS.BASE_URL}/profile`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
              }
            });
            if (userResponse.ok) {
              const userData = await userResponse.json();
              setUserDetailsFromBackend(userData);
            } else {
              setUserDetailsFromBackend({ error: `HTTP ${userResponse.status}: ${userResponse.statusText}` });
            }
          } catch (e) {
            console.error('Error getting user details:', e);
            setUserDetailsFromBackend({ error: e.message });
          }
        }
      } catch (err) {
        console.error('API Debug Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkBackendHealth();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">API Debugger</h1>
      
      {loading && <p className="text-gray-500">Cargando información de API...</p>}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
          <p className="font-semibold">Error de conexión:</p>
          <pre className="mt-2 text-sm">{error}</pre>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Backend Info */}
        <div className="bg-white p-4 shadow rounded-md">
          <h2 className="font-semibold mb-2 border-b pb-2">Backend Status</h2>
          <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(backendVersion, null, 2)}
          </pre>
        </div>
        
        {/* Auth State */}
        <div className="bg-white p-4 shadow rounded-md">
          <h2 className="font-semibold mb-2 border-b pb-2">Auth Debug Info</h2>
          <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(authState, null, 2)}
          </pre>
        </div>
        
        {/* Client Auth */}
        <div className="bg-white p-4 shadow rounded-md">
          <h2 className="font-semibold mb-2 border-b pb-2">Client Auth State</h2>
          <div className="mb-3">
            <p className="text-sm font-semibold">Token Available: <span className={localStorage.getItem('token') ? 'text-green-600' : 'text-red-600'}>{localStorage.getItem('token') ? 'Yes' : 'No'}</span></p>
            {localStorage.getItem('token') && (
              <p className="text-sm text-gray-500 truncate">
                Token: {localStorage.getItem('token').substring(0, 15)}...
              </p>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-1">Current User from Context:</h3>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
        
        {/* Token Details */}
        <div className="bg-white p-4 shadow rounded-md">
          <h2 className="font-semibold mb-2 border-b pb-2">JWT Token Contents</h2>
          <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(userDetailsFromToken, null, 2)}
          </pre>
        </div>
        
        {/* User Details from Backend */}
        <div className="bg-white p-4 shadow rounded-md">
          <h2 className="font-semibold mb-2 border-b pb-2">User Details from API</h2>
          <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
            {JSON.stringify(userDetailsFromBackend, null, 2)}
          </pre>
        </div>
        
        {/* Test API Call */}
        <div className="bg-white p-4 shadow rounded-md md:col-span-2">
          <h2 className="font-semibold mb-2 border-b pb-2">API Test Buttons</h2>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={async () => {
                try {
                  const response = await fetch(`${ENDPOINTS.BASE_URL}/health`);
                  const data = await response.json();
                  alert('API Health: ' + JSON.stringify(data));
                } catch (err) {
                  alert('Error: ' + err.message);
                }
              }}
            >
              Test Health Endpoint
            </button>
            
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={async () => {
                try {
                  const token = localStorage.getItem('token');
                  if (!token) {
                    alert('No token available');
                    return;
                  }
                  
                  const response = await fetch(`${ENDPOINTS.BASE_URL}/profile`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  if (response.ok) {
                    const data = await response.json();
                    alert('Profile Data: ' + JSON.stringify(data));
                  } else {
                    alert(`HTTP Error ${response.status}: ${response.statusText}`);
                  }
                } catch (err) {
                  alert('Error: ' + err.message);
                }
              }}
            >
              Test Auth Endpoint
            </button>
            
            <button
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              onClick={async () => {
                if (!user || !user.id || !user.rol) {
                  alert('No user information available');
                  return;
                }
                
                try {
                  let url;
                  if (user.rol === 'psicologo') {
                    url = `${ENDPOINTS.BASE_URL}/psicologos/${user.id}/pacientes`;
                  } else {
                    url = `${ENDPOINTS.BASE_URL}/pacientes/${user.id}`;
                  }
                  
                  const token = localStorage.getItem('token');
                  const response = await fetch(url, {
                    headers: {
                      'Authorization': token ? `Bearer ${token}` : ''
                    }
                  });
                  
                  if (response.ok) {
                    const data = await response.json();
                    alert('Data: ' + JSON.stringify(data));
                  } else {
                    const errorText = await response.text();
                    alert(`HTTP Error ${response.status}: ${errorText}`);
                  }
                } catch (err) {
                  alert('Error: ' + err.message);
                }
              }}
            >
              Test Contacts Endpoint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDebugger;
