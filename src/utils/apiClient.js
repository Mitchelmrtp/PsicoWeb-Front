import { handleApiResponse, getErrorMessage } from './apiResponseHandler';
import { getAuthHeader } from '../config/api';

/**
 * Helper function to make API requests with consistent response handling
 */
export const apiRequest = async (url, options = {}) => {
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
        const data = await response.json();

        if (!response.ok) {
            throw new Error(getErrorMessage(data) || `HTTP ${response.status}: ${response.statusText}`);
        }

        return handleApiResponse(data);
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
};

/**
 * Specific API methods
 */
export const apiGet = (url, options = {}) => apiRequest(url, { method: 'GET', ...options });
export const apiPost = (url, data, options = {}) => apiRequest(url, { method: 'POST', body: JSON.stringify(data), ...options });
export const apiPut = (url, data, options = {}) => apiRequest(url, { method: 'PUT', body: JSON.stringify(data), ...options });
export const apiDelete = (url, options = {}) => apiRequest(url, { method: 'DELETE', ...options });
export const apiPatch = (url, data, options = {}) => apiRequest(url, { method: 'PATCH', body: JSON.stringify(data), ...options });
