const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

export const ENDPOINTS = {
    LOGIN: `${API_URL}/login`,
    REGISTER: `${API_URL}/register`,
    FORGOT_PASSWORD: `${API_URL}/forgot-password`,
    PROFILE: `${API_URL}/profile`
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};