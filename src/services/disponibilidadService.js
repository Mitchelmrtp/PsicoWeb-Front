import { ENDPOINTS, getAuthHeader } from '../config/api';
import { handleApiResponse, getErrorMessage } from '../utils/apiResponseHandler';

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
        throw new Error(getErrorMessage(error) || 'Error al obtener disponibilidades');
      }
      
      const data = await response.json();
      return handleApiResponse(data);
    } catch (error) {
      console.error('Error obteniendo disponibilidades:', error);
      throw error;
    }
  }

  async createDisponibilidad(disponibilidadData) {
    try {
      const authHeader = getAuthHeader();
      
      const response = await fetch(ENDPOINTS.DISPONIBILIDAD, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
        body: JSON.stringify(disponibilidadData),
      });
      

      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Texto completo de error:', errorText);
        
        let errorObj;
        try {
          errorObj = JSON.parse(errorText);
        } catch (e) {
          errorObj = { message: errorText || 'Error desconocido del servidor' };
        }
        
        throw new Error(getErrorMessage(errorObj) || `Error ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      return handleApiResponse(data);
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
        throw new Error(getErrorMessage(error) || 'Error al actualizar disponibilidad');
      }
      
      const data = await response.json();
      return handleApiResponse(data);
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
        throw new Error(getErrorMessage(error) || 'Error al eliminar disponibilidad');
      }
      
      const data = await response.json();
      return handleApiResponse(data);
    } catch (error) {
      console.error('Error eliminando disponibilidad:', error);
      throw error;
    }
  }

  async getPsicologoDisponibilidad(psicologoId) {
    try {
      const response = await fetch(`${ENDPOINTS.DISPONIBILIDAD}/psicologo/${psicologoId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(getErrorMessage(error) || 'Error al obtener disponibilidad del psicólogo');
      }
      
      const data = await response.json();
      const processedData = handleApiResponse(data);
      
      // Ensure we always return an array
      if (Array.isArray(processedData)) {
        return processedData;
      } else if (processedData && Array.isArray(processedData.data)) {
        return processedData.data;
      } else {
        console.warn('Unexpected response format from disponibilidad API:', processedData);
        return [];
      }
    } catch (error) {
      console.error('Error obteniendo disponibilidad del psicólogo:', error);
      throw error;
    }
  }
}

export default new DisponibilidadService();