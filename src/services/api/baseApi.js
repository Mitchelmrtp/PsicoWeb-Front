/**
 * Servicio base para todas las llamadas API
 * Implementa el principio DRY y manejo centralizado de errores
 */
import { ENDPOINTS, getAuthHeader } from '../../config/api';

class BaseApiService {
  constructor(baseEndpoint) {
    this.baseEndpoint = baseEndpoint;
  }

  async request(url, options = {}) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${url}):`, error);
      throw error;
    }
  }

  async get(endpoint = '', options = {}) {
    const url = `${this.baseEndpoint}${endpoint}`;
    return this.request(url, { ...options, method: 'GET' });
  }

  async post(endpoint = '', data = null, options = {}) {
    const url = `${this.baseEndpoint}${endpoint}`;
    return this.request(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint = '', data = null, options = {}) {
    const url = `${this.baseEndpoint}${endpoint}`;
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint = '', options = {}) {
    const url = `${this.baseEndpoint}${endpoint}`;
    return this.request(url, { ...options, method: 'DELETE' });
  }
  
  // Método para enviar formData (para subida de archivos)
  async postFormData(endpoint = '', formData, options = {}) {
    const url = `${this.baseEndpoint}${endpoint}`;
    
    console.log('BaseApiService - postFormData ENTRY:', { 
      baseEndpoint: this.baseEndpoint,
      endpoint, 
      url,
      hasFormData: !!formData 
    });
    
    if (!formData) {
      throw new Error('FormData is required for postFormData');
    }
    
    // Log FormData contents
    console.log('BaseApiService - FormData contents:');
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes, ${value.type})` : value);
    }
    
    const authHeader = getAuthHeader();
    console.log('BaseApiService - Auth header:', authHeader);

    try {
      // En este caso no usamos this.request porque necesitamos omitir el Content-Type para que el navegador
      // establezca automáticamente el boundary del formData
      console.log('BaseApiService - About to make fetch request to:', url);
      
      const requestConfig = {
        method: 'POST',
        headers: {
          ...authHeader,
          ...options.headers
        },
        body: formData,
        ...options
      };
      
      console.log('BaseApiService - Request config:', {
        method: requestConfig.method,
        headers: requestConfig.headers,
        hasBody: !!requestConfig.body
      });
      
      const response = await fetch(url, requestConfig);
      
      console.log('BaseApiService - Response received:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.text();
        } catch (e) {
          errorData = 'Could not read error response';
        }
        console.error('BaseApiService - Response not ok:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }
      
      let data;
      try {
        data = await response.json();
        console.log('BaseApiService - Parsed JSON response:', data);
      } catch (e) {
        console.error('BaseApiService - Failed to parse JSON response:', e);
        throw new Error('Invalid JSON response from server');
      }
      
      return data;
    } catch (error) {
      console.error(`BaseApiService - API Error (${url}):`, {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause
      });
      throw error;
    }
  }
}

export default BaseApiService;
