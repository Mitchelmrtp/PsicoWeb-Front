import { useState, useEffect } from 'react';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { toast } from 'react-toastify';

// Hook para gestionar citas del paciente
export const usePatientAppointments = (userId) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`${ENDPOINTS.SESIONES}?startDate=${today}&estado=programada`, {
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
      const appointmentsArray = data.data || data;

      const formattedAppointments = appointmentsArray.map(appointment => {
        let doctorName = 'Psicólogo Asignado';
        
        if (appointment.Psicologo?.User) {
          const { first_name = '', last_name = '' } = appointment.Psicologo.User;
          doctorName = `${first_name} ${last_name}`.trim() || doctorName;
        }

        return {
          id: appointment.id,
          doctor: doctorName,
          date: new Date(`${appointment.fecha}T${appointment.horaInicio}`),
          endTime: new Date(`${appointment.fecha}T${appointment.horaFin || appointment.horaInicio}`),
          estado: appointment.estado,
          psicologoId: appointment.idPsicologo,
          time: appointment.horaInicio,
          endTimeString: appointment.horaFin
        };
      });

      formattedAppointments.sort((a, b) => a.date - b.date);
      setAppointments(formattedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
      toast.error('Error al cargar las citas programadas');
      // No hay datos simulados, solo un array vacío cuando hay error
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [userId]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  };
};
