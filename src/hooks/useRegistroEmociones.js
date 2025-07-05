import { useState } from 'react';
import { registroEmocionService } from '../services/api/registroEmocionService';

export const useRegistroEmociones = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createRegistro = async (registroData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await registroEmocionService.createRegistro(registroData);
      return response;
    } catch (err) {
      setError(err.message || 'Error al crear el registro');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    createRegistro
  };
};
