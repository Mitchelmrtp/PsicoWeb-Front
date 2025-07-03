import { useState, useEffect } from 'react';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { toast } from 'react-toastify';
import { format, parseISO, addHours } from 'date-fns';

// Hook para gestionar citas del psicólogo
export const usePsychologistAppointments = (psychologistId, activeTab = 'próximas') => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAppointments = async () => {
    if (!psychologistId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const today = format(new Date(), 'yyyy-MM-dd');
      
      let endpoint = ENDPOINTS.SESIONES;
      if (activeTab === 'próximas') {
        endpoint += `?startDate=${today}&estado=programada`;
      } else if (activeTab === 'pasadas') {
        endpoint += `?endDate=${today}&estado=completada`;
      } else if (activeTab === 'canceladas') {
        endpoint += `?estado=cancelada`;
      }

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar las citas');
      }

      const data = await response.json();
      const appointmentsArray = data.data || data;

      const formattedAppointments = appointmentsArray.map(appointment => {
        const startDate = parseISO(`${appointment.fecha}T${appointment.horaInicio}`);
        const endDate = appointment.horaFin 
          ? parseISO(`${appointment.fecha}T${appointment.horaFin}`)
          : addHours(startDate, 1);
          
        const patientName = appointment.Paciente?.User
          ? `${appointment.Paciente.User.first_name || ''} ${appointment.Paciente.User.last_name || ''}`.trim()
          : appointment.Paciente
            ? `${appointment.Paciente.first_name || ''} ${appointment.Paciente.last_name || ''}`.trim()
            : 'Paciente';
            
        return {
          id: appointment.id,
          patient: patientName,
          date: startDate,
          endTime: endDate,
          status: appointment.estado,
          patientId: appointment.idPaciente,
          progressLink: `/pacientes/${appointment.idPaciente}/progreso`,
          documentsLink: `/pacientes/${appointment.idPaciente}/documentos`,
          pacienteId: appointment.idPaciente
        };
      });

      // Ordenar por fecha
      formattedAppointments.sort((a, b) => {
        if (activeTab === 'próximas') {
          return a.date - b.date;  // ascendente para próximas
        } else {
          return b.date - a.date;  // descendente para pasadas/canceladas
        }
      });

      setAppointments(formattedAppointments);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError(err.message);
      toast.error('No se pudieron cargar las citas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [psychologistId, activeTab]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  };
};
