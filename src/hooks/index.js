/**
 * Punto de entrada para todos los hooks personalizados
 * Facilita las importaciones y mantiene la organización
 */

// Hooks de autenticación
export { useAuth } from './useAuth';

// Hooks de datos asincrónicos
export { default as useAsyncData } from './useAsyncData';
export { default as useForm } from './useForm';

// Hooks específicos del dominio
export { 
  useTests, 
  useTestDetail, 
  useTestResults, 
  useTestResultDetail 
} from './useTests';

export { default as useTestExecution } from './useTestExecution';

// Hooks existentes (mantener compatibilidad)
export { default as usePatientAppointments } from './usePatientAppointments';
export { default as usePsychologistAppointments } from './usePsychologistAppointments';
export { default as usePsychologistPatients } from './usePsychologistPatients';
export { default as usePsychologists } from './usePsychologists';
