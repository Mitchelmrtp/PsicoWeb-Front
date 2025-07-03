/**
 * Servicio para manejo de pacientes y psicólogos
 * Implementa Single Responsibility Principle
 */
import BaseApiService from './baseApi';
import { ENDPOINTS } from '../../config/api';

class PatientService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.PACIENTES);
  }

  // Obtener todos los pacientes (para psicólogos)
  async getAllPatients() {
    return this.get();
  }

  // Obtener un paciente específico
  async getPatientById(patientId) {
    return this.get(`/${patientId}`);
  }

  // Obtener pacientes de un psicólogo específico
  async getPsychologistPatients(psychologistId) {
    return this.get(`/psicologo/${psychologistId}`);
  }

  // Crear nuevo paciente
  async createPatient(patientData) {
    return this.post('', patientData);
  }

  // Actualizar paciente
  async updatePatient(patientId, patientData) {
    return this.put(`/${patientId}`, patientData);
  }

  // Eliminar paciente
  async deletePatient(patientId) {
    return this.delete(`/${patientId}`);
  }
}

class PsychologistService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.PSICOLOGOS);
  }

  // Obtener todos los psicólogos
  async getAllPsychologists() {
    return this.get();
  }

  // Obtener un psicólogo específico
  async getPsychologistById(psychologistId) {
    return this.get(`/${psychologistId}`);
  }

  // Obtener pacientes del psicólogo
  async getMyPatients() {
    return this.get('/pacientes');
  }

  // Crear nuevo psicólogo
  async createPsychologist(psychologistData) {
    return this.post('', psychologistData);
  }

  // Actualizar psicólogo
  async updatePsychologist(psychologistId, psychologistData) {
    return this.put(`/${psychologistId}`, psychologistData);
  }

  // Eliminar psicólogo
  async deletePsychologist(psychologistId) {
    return this.delete(`/${psychologistId}`);
  }
}

export { PatientService, PsychologistService };
