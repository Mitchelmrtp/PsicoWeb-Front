const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

export const ENDPOINTS = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3005/api',
  LOGIN: `${API_URL}/login`,
  REGISTER: `${API_URL}/register`,
  PROFILE: `${API_URL}/profile`,
  FORGOT_PASSWORD: `${API_URL}/forgot-password`,
  RESET_PASSWORD: `${API_URL}/reset-password`,
  // Endpoints para psicólogos
  PSICOLOGOS: `${API_URL}/psicologos`,
  PSICOLOGO_PROFILE: `${API_URL}/psicologo/profile`,
  PSICOLOGO_PACIENTES: `${API_URL}/psicologos/pacientes`,
  // Endpoints para pacientes
  PACIENTES: `${API_URL}/pacientes`,
  PACIENTE_PROFILE: `${API_URL}/paciente/profile`,
  // Endpoints para sesiones
  SESIONES: `${API_URL}/sesiones`,
  // Endpoints para calendario
  CALENDARIO: `${API_URL}/calendario`,
  EVENTOS: `${API_URL}/calendario/events`,
  // Endpoints para pruebas psicológicas
  PRUEBAS: `${API_URL}/pruebas`,
  RESULTADOS: `${API_URL}/pruebas/resultados`,
  // Endpoint para disponibilidad
  DISPONIBILIDAD: `${API_URL}/disponibilidad`,
  // Endpoint para el chat
  CHAT: `${API_URL}/chat`,
  // Endpoints para objetivos y ejercicios
  OBJETIVOS: `${API_URL}/objetivos`,
  EJERCICIOS: `${API_URL}/ejercicios`,
  // Endpoint para registros de emociones
  EMOCIONES: `${API_URL}/emociones`,
  // Endpoints para informes
  INFORMES: `${API_URL}/informes`,
  // Endpoint para pagos
  PAGOS: `${API_URL}/pagos`,
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        // Only log this during actual authenticated requests, not login
        return {};
    }
    
    // Check if token is expired (basic check)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp && payload.exp < currentTime) {
            console.warn('Token has expired');
            // Clear expired token
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optionally redirect to login or show notification
            return {};
        }
    } catch (error) {
        console.error('Error decoding token:', error);
        return {};
    }
    
    return { 'Authorization': `Bearer ${token}` };
};

export default API_URL;
