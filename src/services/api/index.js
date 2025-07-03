/**
 * Punto de entrada único para todos los servicios API
 * Implementa el patrón Facade y Dependency Injection
 */
import { AuthService, ProfileService } from './authService';
import TestService from './testService';
import { PatientService, PsychologistService } from './userService';
import { SessionService, CalendarService, AvailabilityService } from './sessionService';

// Instancias singleton de los servicios
const authService = new AuthService();
const profileService = new ProfileService();
const testService = new TestService();
const patientService = new PatientService();
const psychologistService = new PsychologistService();
const sessionService = new SessionService();
const calendarService = new CalendarService();
const availabilityService = new AvailabilityService();

// Factory para crear servicios - permite fácil testing y mocking
export const createApiServices = () => ({
  auth: authService,
  profile: profileService,
  test: testService,
  patient: patientService,
  psychologist: psychologistService,
  session: sessionService,
  calendar: calendarService,
  availability: availabilityService,
});

// Exportación directa para uso inmediato
export const apiServices = createApiServices();

// Exportaciones individuales para casos específicos
export {
  AuthService,
  ProfileService,
  TestService,
  PatientService,
  PsychologistService,
  SessionService,
  CalendarService,
  AvailabilityService,
  authService,
  profileService,
  testService,
  patientService,
  psychologistService,
  sessionService,
  calendarService,
  availabilityService,
};
