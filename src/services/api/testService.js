/**
 * Servicio para manejo de pruebas psicológicas
 * Implementa Single Responsibility Principle
 */
import BaseApiService from './baseApi';
import { ENDPOINTS } from '../../config/api';

class TestService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.PRUEBAS);
  }

  // Obtener todas las pruebas disponibles
  async getAllTests() {
    return this.get();
  }

  // Obtener una prueba específica con sus preguntas
  async getTestById(testId) {
    return this.get(`/${testId}`);
  }

  // Crear una nueva prueba (solo psicólogos)
  async createTest(testData) {
    return this.post('', testData);
  }

  // Actualizar una prueba existente
  async updateTest(testId, testData) {
    return this.put(`/${testId}`, testData);
  }

  // Eliminar una prueba
  async deleteTest(testId) {
    return this.delete(`/${testId}`);
  }

  // Enviar respuestas de una prueba
  async submitTestResults(testId, resultData) {
    return this.post(`/${testId}/resultados`, resultData);
  }

  // Obtener resultados de un paciente
  async getPatientResults(patientId) {
    return this.get(`/resultados?pacienteId=${patientId}`);
  }

  // Obtener detalle de un resultado específico
  async getResultDetail(resultId) {
    return this.get(`/resultados/${resultId}`);
  }

  // Gestión de preguntas
  async createQuestion(testId, questionData) {
    return this.post(`/${testId}/preguntas`, questionData);
  }

  async updateQuestion(testId, questionId, questionData) {
    return this.put(`/${testId}/preguntas/${questionId}`, questionData);
  }

  async deleteQuestion(testId, questionId) {
    return this.delete(`/${testId}/preguntas/${questionId}`);
  }
}

export default TestService;
