import { useState, useEffect } from 'react';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { toast } from 'react-toastify';

// Hook para gestionar pacientes de un psicólogo
export const usePsychologistPatients = (psychologistId) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = async () => {
    if (!psychologistId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(ENDPOINTS.PSICOLOGO_PACIENTES, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar los pacientes');
      }

      const data = await response.json();
      const patientsArray = data.data || data;

      const formattedPatients = patientsArray.map(patient => ({
        id: patient.id,
        name: patient.User 
          ? `${patient.User.first_name || ''} ${patient.User.last_name || ''}`.trim()
          : `${patient.first_name || ''} ${patient.last_name || ''}`.trim() || 'Paciente',
        email: patient.User?.email || patient.email || '',
        lastSession: patient.lastSession || null,
        status: patient.status || 'activo',
        phone: patient.User?.telephone || patient.telephone || '',
        avatar: patient.avatar || null,
      }));

      setPatients(formattedPatients);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError(err.message);
      toast.error('No se pudieron cargar los pacientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [psychologistId]);

  return {
    patients,
    loading,
    error,
    refetch: fetchPatients,
  };
};
