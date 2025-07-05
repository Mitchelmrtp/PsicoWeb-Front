/**
 * Servicio para manejo de registros de emociones
 */
import BaseApiService from './baseApi';
import { ENDPOINTS } from '../../config/api';

class RegistroEmocionService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.EMOCIONES);
  }

  async getRegistros(params = {}) {
    const queryParams = new URLSearchParams();
    
    if (params.startDate) queryParams.append('startDate', params.startDate);
    if (params.endDate) queryParams.append('endDate', params.endDate);
    if (params.pacienteId) queryParams.append('pacienteId', params.pacienteId);

    const endpoint = queryParams.toString() ? `?${queryParams.toString()}` : '';
    return await this.get(endpoint);
  }

  async createRegistro(registroData) {
    return await this.post('', registroData);
  }

  async updateRegistro(id, updateData) {
    return await this.put(`/${id}`, updateData);
  }

  async deleteRegistro(id) {
    return await this.delete(`/${id}`);
  }

  async getRegistroById(id) {
    return await this.get(`/${id}`);
  }

  validateRegistroData(registroData) {
    const errors = [];

    if (!registroData.emociones || Object.keys(registroData.emociones).length === 0) {
      errors.push('Debe registrar al menos una emoción');
    }

    if (registroData.emociones) {
      Object.entries(registroData.emociones).forEach(([emocion, intensidad]) => {
        if (typeof intensidad !== 'number' || intensidad < 1 || intensidad > 10) {
          errors.push(`La intensidad de ${emocion} debe estar entre 1 y 10`);
        }
      });
    }

    if (!registroData.idPaciente) {
      errors.push('Debe especificar el ID del paciente');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Utilidades para el manejo de emociones
  getEmocionesList() {
    return [
      'ansiedad',
      'tristeza', 
      'alegria',
      'ira',
      'estres',
      'calma',
      'miedo',
      'esperanza'
    ];
  }

  getNombreAmigableEmocion(emocion) {
    const nombres = {
      ansiedad: 'Ansiedad',
      tristeza: 'Tristeza',
      alegria: 'Alegría',
      ira: 'Ira',
      estres: 'Estrés',
      calma: 'Calma',
      miedo: 'Miedo',
      esperanza: 'Esperanza'
    };
    
    return nombres[emocion] || emocion;
  }

  getColorEmocion(emocion) {
    const colores = {
      ansiedad: '#FF6B6B',
      tristeza: '#4ECDC4',
      alegria: '#FFE66D',
      ira: '#FF8B94',
      estres: '#95E1D3',
      calma: '#A8E6CF',
      miedo: '#DDA0DD',
      esperanza: '#98D8E8'
    };
    
    return colores[emocion] || '#666666';
  }
}

export const registroEmocionService = new RegistroEmocionService();
