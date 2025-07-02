import { Calendar, Users, Clock } from 'lucide-react';

const EmptyAppointments = ({ userType = 'paciente' }) => {
  const isPaciente = userType === 'paciente';

  return (
    <div className="text-center py-12">
      <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No hay citas programadas
      </h3>
      <p className="text-gray-500 mb-6 max-w-md mx-auto">
        {isPaciente 
          ? "No tienes citas programadas para los próximos días. ¡Reserva una consulta para comenzar tu proceso terapéutico!"
          : "No tienes citas programadas con pacientes. Los pacientes pueden reservar citas contigo a través de la plataforma."
        }
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Clock className="h-5 w-5 text-blue-600" />
          <span className="text-blue-800 font-medium">¿Qué puedes hacer?</span>
        </div>
        
        {isPaciente ? (
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Buscar psicólogos disponibles</li>
            <li>• Revisar sus horarios</li>
            <li>• Reservar una cita</li>
            <li>• Completar pruebas psicológicas</li>
          </ul>
        ) : (
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Configurar tu disponibilidad</li>
            <li>• Revisar solicitudes de citas</li>
            <li>• Actualizar tu perfil profesional</li>
            <li>• Gestionar pruebas psicológicas</li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default EmptyAppointments;
