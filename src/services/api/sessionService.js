/**
 * Servicio para manejo de sesiones y calendario
 * Implementa Single Responsibility Principle
 */
import BaseApiService from "./baseApi";
import { ENDPOINTS } from "../../config/api";

class SessionService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.SESIONES);
  }

  // Obtener todas las sesiones
  async getAllSessions() {
    return this.get();
  }

  // Obtener sesiones de un paciente
  async getPatientSessions(patientId) {
    return this.get(`/paciente/${patientId}`);
  }

  // Obtener sesiones de un psicólogo
  async getPsychologistSessions(psychologistId) {
    return this.get(`/psicologo/${psychologistId}`);
  }

  // Crear nueva sesión
  async createSession(sessionData) {
    return this.post("", sessionData);
  }

  // Actualizar sesión
  async updateSession(sessionId, sessionData) {
    return this.put(`/${sessionId}`, sessionData);
  }

  // Cancelar sesión
  async cancelSession(sessionId) {
    return this.delete(`/${sessionId}`);
  }

  // Reservar cita
  async bookAppointment(appointmentData) {
    return this.post("/reservar", appointmentData);
  }
}

class CalendarService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.CALENDARIO);
  }

  // Obtener calendario del usuario
  async getCalendar() {
    return this.get();
  }

  // Obtener eventos del calendario
  async getEvents() {
    return this.get("/events");
  }

  // Crear evento
  async createEvent(eventData) {
    return this.post("/events", eventData);
  }

  // Actualizar evento
  async updateEvent(eventId, eventData) {
    return this.put(`/events/${eventId}`, eventData);
  }

  // Eliminar evento
  async deleteEvent(eventId) {
    return this.delete(`/events/${eventId}`);
  }
}

class AvailabilityService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.DISPONIBILIDAD);
  }

  // Obtener disponibilidad de un psicólogo
  async getPsychologistAvailability(psychologistId) {
    return this.get(`/psicologo/${psychologistId}`);
  }

  // Obtener mi disponibilidad (psicólogo logueado)
  async getMyAvailability() {
    return this.get();
  }

  // Crear disponibilidad
  async createAvailability(availabilityData) {
    return this.post("", availabilityData);
  }

  // Actualizar disponibilidad
  async updateAvailability(availabilityId, availabilityData) {
    return this.put(`/${availabilityId}`, availabilityData);
  }

  // Registrar asistencia de una sesión (solo psicólogos)
  async registerAttendance(sessionId, attendanceData) {
    return this.post(`/${sessionId}/asistencia`, attendanceData);
  }

  // Eliminar disponibilidad
  async deleteAvailability(availabilityId) {
    return this.delete(`/${availabilityId}`);
  }
}

export { SessionService, CalendarService, AvailabilityService };
