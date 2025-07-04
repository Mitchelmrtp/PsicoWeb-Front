/**
 * Servicio para la gestión de objetivos del paciente y ejercicios
 * Implementa el patrón Repository y sigue principios de separación de responsabilidades
 */

import BaseApiService from './baseApi';
import { ENDPOINTS } from '../../config/api';

/**
 * Servicio para gestión de objetivos
 */
export class ObjetivosService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.OBJETIVOS);
  }

  /**
   * Obtiene todos los objetivos de un paciente específico
   * @param {string} pacienteId - ID del paciente
   * @returns {Promise<Array>} Lista de objetivos del paciente
   */
  async getObjetivosByPaciente(pacienteId) {
    return this.get(`/paciente/${pacienteId}`);
  }

  /**
   * Obtiene todos los objetivos del usuario actual (filtrados automáticamente por rol en backend)
   * @returns {Promise<Array>} Lista de objetivos del usuario actual
   */
  async getObjetivos() {
    return this.get('/');
  }

  /**
   * Obtiene un objetivo específico por ID
   * @param {string} objetivoId - ID del objetivo
   * @returns {Promise<Object>} Datos del objetivo
   */
  async getObjetivoById(objetivoId) {
    return this.get(`/${objetivoId}`);
  }

  /**
   * Crea un nuevo objetivo
   * @param {Object} objetivoData - Datos del objetivo
   * @returns {Promise<Object>} Objetivo creado
   */
  async createObjetivo(objetivoData) {
    return this.post('', objetivoData);
  }

  /**
   * Actualiza un objetivo existente
   * @param {string} objetivoId - ID del objetivo
   * @param {Object} objetivoData - Datos actualizados
   * @returns {Promise<Object>} Objetivo actualizado
   */
  async updateObjetivo(objetivoId, objetivoData) {
    return this.put(`/${objetivoId}`, objetivoData);
  }

  /**
   * Elimina un objetivo
   * @param {string} objetivoId - ID del objetivo
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteObjetivo(objetivoId) {
    return this.delete(`/${objetivoId}`);
  }

  /**
   * Actualiza el progreso de un objetivo
   * @param {string} objetivoId - ID del objetivo
   * @param {number} progreso - Progreso actualizado (0-100)
   * @returns {Promise<Object>} Objetivo con progreso actualizado
   */
  async updateProgreso(objetivoId, progreso) {
    return this.put(`/${objetivoId}/progreso`, { progreso });
  }
}

/**
 * Servicio para gestión de ejercicios
 */
export class EjerciciosService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.EJERCICIOS);
  }

  /**
   * Obtiene todos los ejercicios de un objetivo específico
   * @param {string} objetivoId - ID del objetivo
   * @returns {Promise<Array>} Lista de ejercicios del objetivo
   */
  async getEjerciciosByObjetivo(objetivoId) {
    return this.get(`/objetivo/${objetivoId}`);
  }

  /**
   * Obtiene todos los ejercicios asignados a un paciente
   * @param {string} pacienteId - ID del paciente
   * @returns {Promise<Array>} Lista de ejercicios del paciente
   */
  async getEjerciciosByPaciente(pacienteId) {
    return this.get(`/paciente/${pacienteId}`);
  }

  /**
   * Obtiene todos los ejercicios del usuario actual (filtrados automáticamente por rol en backend)
   * @returns {Promise<Array>} Lista de ejercicios del usuario actual
   */
  async getEjercicios() {
    return this.get('/');
  }

  /**
   * Obtiene un ejercicio específico por ID
   * @param {string} ejercicioId - ID del ejercicio
   * @returns {Promise<Object>} Datos del ejercicio
   */
  async getEjercicioById(ejercicioId) {
    return this.get(`/${ejercicioId}`);
  }

  /**
   * Crea un nuevo ejercicio
   * @param {Object} ejercicioData - Datos del ejercicio
   * @returns {Promise<Object>} Ejercicio creado
   */
  async crearEjercicio(ejercicioData) {
    return this.post('', ejercicioData);
  }

  /**
   * Asigna un ejercicio (crea nuevo ejercicio asignado a un objetivo)
   * @param {Object} ejercicioData - Datos del nuevo ejercicio
   * @returns {Promise<Object>} Ejercicio creado y asignado
   */
  async asignarEjercicio(ejercicioData) {
    return this.post('', ejercicioData);
  }

  /**
   * Asigna un ejercicio existente a un objetivo
   * @param {Object} asignacionData - Datos de la asignación {ejercicioId, objetivoId}
   * @returns {Promise<Object>} Ejercicio asignado
   */
  async asignarEjercicioExistente(asignacionData) {
    const { ejercicioId, objetivoId } = asignacionData;
    return this.post(`/${ejercicioId}/asignar/${objetivoId}`, {});
  }

  /**
   * Actualiza un ejercicio existente
   * @param {string} ejercicioId - ID del ejercicio
   * @param {Object} ejercicioData - Datos actualizados
   * @returns {Promise<Object>} Ejercicio actualizado
   */
  async updateEjercicio(ejercicioId, ejercicioData) {
    return this.put(`/${ejercicioId}`, ejercicioData);
  }

  /**
   * Elimina un ejercicio
   * @param {string} ejercicioId - ID del ejercicio
   * @returns {Promise<Object>} Resultado de la eliminación
   */
  async deleteEjercicio(ejercicioId) {
    return this.delete(`/${ejercicioId}`);
  }

  /**
   * Marca un ejercicio como completado
   * @param {string} ejercicioId - ID del ejercicio
   * @param {Object} completionData - Datos de completación
   * @returns {Promise<Object>} Ejercicio con estado actualizado
   */
  async marcarCompletado(ejercicioId, completionData = {}) {
    return this.patch(`/${ejercicioId}/completar`, {
      fechaCompletado: new Date().toISOString(),
      ...completionData
    });
  }

  /**
   * Marca un ejercicio como no completado
   * @param {string} ejercicioId - ID del ejercicio
   * @returns {Promise<Object>} Ejercicio con estado actualizado
   */
  async marcarNoCompletado(ejercicioId) {
    return this.patch(`/${ejercicioId}/descompletar`, {
      fechaCompletado: null
    });
  }

  /**
   * Obtiene el progreso general de ejercicios de un paciente
   * @param {string} pacienteId - ID del paciente
   * @returns {Promise<Object>} Estadísticas de progreso
   */
  async getProgresoEjercicios(pacienteId) {
    return this.get(`/paciente/${pacienteId}/progreso`);
  }
}

// Instancias singleton
export const objetivosService = new ObjetivosService();
export const ejerciciosService = new EjerciciosService();

export default {
  objetivos: objetivosService,
  ejercicios: ejerciciosService
};
