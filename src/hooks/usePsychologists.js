import { useState, useEffect } from 'react';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { toast } from 'react-toastify';

/**
 * Hook para obtener la lista de psicólogos disponibles
 * @returns {Object} Estado de los psicólogos
 */
export const usePsychologists = () => {
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPsychologists = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(ENDPOINTS.PSICOLOGOS, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('No autorizado');
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const psychologistsArray = data.data || data;

      // Formatear datos para usar en la UI
      const formattedPsychologists = psychologistsArray.map(psicologo => {
        let name = 'Psicólogo';
        if (psicologo.User) {
          const { first_name = '', last_name = '' } = psicologo.User;
          name = `${first_name} ${last_name}`.trim() || name;
        }

        return {
          id: psicologo.id,
          name: name,
          specialty: psicologo.especialidad || 'Psicología General',
          experience: psicologo.experiencia || 'Experiencia profesional',
          availability: {
            days: [], // Se puede obtener de la disponibilidad si está disponible
            hours: 'Consultar disponibilidad'
          },
          price: psicologo.tarifaPorSesion ? `$${psicologo.tarifaPorSesion}` : 'Consultar precio',
          imageUrl: psicologo.User?.profileImage || '/assets/default-psychologist.jpg',
          email: psicologo.User?.email,
          telefono: psicologo.telefono,
          licencia: psicologo.numeroDeLicencia,
          fechaRegistro: psicologo.fechaRegistro
        };
      });

      setPsychologists(formattedPsychologists);
    } catch (err) {
      console.error('Error fetching psychologists:', err);
      setError(err.message);
      toast.error('Error al cargar la lista de psicólogos');
      // No hay datos simulados, solo un array vacío cuando hay error
      setPsychologists([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPsychologists();
  }, []);

  return {
    psychologists,
    loading,
    error,
    refetch: fetchPsychologists,
  };
};
