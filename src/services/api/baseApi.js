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
}

export default BaseApiService;
