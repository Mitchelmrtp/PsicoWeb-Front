import { toast } from 'react-toastify';

/**
 * Handle API errors consistently across the application
 * @param {Response} response - The fetch response object
 * @param {string} defaultMessage - Default error message
 * @param {function} onUnauthorized - Callback for 401 errors
 * @returns {Promise<any>} The response data or throws an error
 */
export const handleApiResponse = async (response, defaultMessage = 'Error en la operación', onUnauthorized = null) => {
  if (response.status === 401) {
    console.error('Authentication failed - token may be expired');
    toast.error('Sesión expirada. Por favor, inicie sesión nuevamente.');
    
    // Clear authentication state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (onUnauthorized) {
      onUnauthorized();
    }
    
    throw new Error('Authentication failed');
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.message || `${defaultMessage}: ${response.status} ${response.statusText}`;
    throw new Error(errorMessage);
  }
  
  return response.json();
};

/**
 * Make an authenticated API request
 * @param {string} url - The API endpoint URL
 * @param {object} options - Fetch options
 * @param {function} onUnauthorized - Callback for 401 errors
 * @returns {Promise<any>} The response data
 */
export const authenticatedFetch = async (url, options = {}, onUnauthorized = null) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('No authentication token found');
    if (onUnauthorized) {
      onUnauthorized();
    }
    throw new Error('No authentication token');
  }
  
  // Check if token is expired
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    if (payload.exp && payload.exp < currentTime) {
      console.warn('Token has expired');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (onUnauthorized) {
        onUnauthorized();
      }
      throw new Error('Token expired');
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onUnauthorized) {
      onUnauthorized();
    }
    throw new Error('Invalid token');
  }
  
  const fetchOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, fetchOptions);
  return handleApiResponse(response, 'Error en la operación', onUnauthorized);
};

export default {
  handleApiResponse,
  authenticatedFetch,
};
