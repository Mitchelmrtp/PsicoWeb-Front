import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const PatientsList = ({ patients, loading, error }) => {
  const navigate = useNavigate();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        {error}
      </div>
    );
  }
  
  if (patients.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes pacientes asignados</h3>
        <p className="text-gray-500">
          Los pacientes aparecerán aquí cuando reserven una cita contigo.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200">
        {patients.map(patient => (
          <div 
            key={patient.id} 
            className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
            onClick={() => navigate(`/pacientes/${patient.id}`)}  // Ruta actualizada
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {patient.first_name ? patient.first_name[0] : '?'}
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium">{patient.first_name} {patient.last_name}</h3>
                  <p className="text-xs text-gray-500">
                    {patient.email}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-xs text-gray-500">
                  Última cita
                </div>
                <div className="text-sm">
                  {patient.lastAppointment ? (
                    format(new Date(patient.lastAppointment), 'dd/MM/yyyy', { locale: es })
                  ) : (
                    'Sin citas previas'
                  )}
                </div>
              </div>
            </div>
            
            {patient.diagnostico && (
              <div className="mt-2 text-sm">
                <span className="font-medium">Diagnóstico:</span> {patient.diagnostico}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientsList;