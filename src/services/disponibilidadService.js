import { ENDPOINTS, getAuthHeader } from '../config/api';

class DisponibilidadService {
  async getDisponibilidades() {
    try {
      const response = await fetch(ENDPOINTS.DISPONIBILIDAD, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al obtener disponibilidades');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo disponibilidades:', error);
      throw error;
    }
  }

  async createDisponibilidad(disponibilidadData) {
    try {
      const response = await fetch(ENDPOINTS.DISPONIBILIDAD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(disponibilidadData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear disponibilidad');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creando disponibilidad:', error);
      throw error;
    }
  }

  async updateDisponibilidad(id, disponibilidadData) {
    try {
      const response = await fetch(`${ENDPOINTS.DISPONIBILIDAD}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(disponibilidadData),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar disponibilidad');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error actualizando disponibilidad:', error);
      throw error;
    }
  }

  async deleteDisponibilidad(id) {
    try {
      const response = await fetch(`${ENDPOINTS.DISPONIBILIDAD}/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al eliminar disponibilidad');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error eliminando disponibilidad:', error);
      throw error;
    }
  }
}

export default new DisponibilidadService();