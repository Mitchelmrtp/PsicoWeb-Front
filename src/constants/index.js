// Constantes de la aplicación centralizadas

export const APP_CONFIG = {
  NAME: 'PsicoWeb',
  VERSION: '2.0.0',
  DESCRIPTION: 'Plataforma de gestión de consultas psicológicas',
};

export const USER_ROLES = {
  PATIENT: 'paciente',
  PSYCHOLOGIST: 'psicologo',
  ADMIN: 'admin',
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: 'programada',
  COMPLETED: 'completada',
  CANCELLED: 'cancelada',
  IN_PROGRESS: 'en_progreso',
};

export const UI_CONSTANTS = {
  SIDEBAR_WIDTH: 220,
  HEADER_HEIGHT: 64,
  MOBILE_BREAKPOINT: 768,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'token',
  USER_DATA: 'user',
  THEME: 'theme',
};

export const API_ENDPOINTS = {
  // Heredado de config/api.js para compatibilidad
  // En el futuro, migrar toda la configuración aquí
};
