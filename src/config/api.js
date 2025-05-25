const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3005/api';

export const ENDPOINTS = {
  LOGIN: `${API_URL}/login`,
  REGISTER: `${API_URL}/register`,
  PROFILE: `${API_URL}/profile`,
  FORGOT_PASSWORD: `${API_URL}/forgot-password`,
  RESET_PASSWORD: `${API_URL}/reset-password`,
  // Endpoints para psicólogos
  PSICOLOGOS: `${API_URL}/psicologos`,
  PSICOLOGO_PROFILE: `${API_URL}/psicologos/profile`,
  PSICOLOGO_PACIENTES: `${API_URL}/psicologos/pacientes`,
  // Endpoints para pacientes
  PACIENTES: `${API_URL}/pacientes`,
  PACIENTE_PROFILE: `${API_URL}/pacientes/profile`,
  // Endpoints para sesiones
  SESIONES: `${API_URL}/sesiones`,
  // Endpoints para calendario
  CALENDARIO: `${API_URL}/calendario`,
  EVENTOS: `${API_URL}/calendario/events`,
  // Endpoints para pruebas psicológicas
  PRUEBAS: `${API_URL}/pruebas`,
  RESULTADOS: `${API_URL}/pruebas/resultados`,
};

export const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export default API_URL;
