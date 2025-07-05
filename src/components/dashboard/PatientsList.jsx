import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS, createRegistrarEmocionesRoute } from '../../routes/routePaths';

const PatientsList = ({ patients, loading, error }) => {
  const navigate = useNavigate();

  const handleViewObjectives = (e, patientId) => {
    e.stopPropagation(); // Prevent patient detail navigation
    navigate(`/objetivos-paciente/${patientId}`);
  };

  const handleManageEmotions = (e, patientId) => {
    e.stopPropagation(); // Prevent patient detail navigation
    navigate(createRegistrarEmocionesRoute(patientId));
  };
  
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
    <div className="space-y-4">
      {patients.map(patient => (
        <div 
          key={patient.id} 
          className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden"
        >
          <div className="p-6">
            {/* Header con información básica */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  {patient.first_name ? patient.first_name[0].toUpperCase() : '?'}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {patient.first_name} {patient.last_name}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    {patient.email}
                  </div>
                </div>
              </div>
              
              {/* Estado del paciente */}
              <div className="flex flex-col items-end">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Activo
                </span>
                {patient.telefono && (
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {patient.telefono}
                  </div>
                )}
              </div>
            </div>
            
            {/* Información adicional */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Última Cita
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {patient.lastAppointment ? (
                    format(new Date(patient.lastAppointment), 'dd/MM/yyyy', { locale: es })
                  ) : (
                    'Sin citas previas'
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Fecha de Registro
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {patient.createdAt ? (
                    format(new Date(patient.createdAt), 'dd/MM/yyyy', { locale: es })
                  ) : (
                    'No disponible'
                  )}
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                  Total de Citas
                </div>
                <div className="text-sm font-semibold text-gray-900">
                  {patient.totalAppointments || 0}
                </div>
              </div>
            </div>
            
            {/* Diagnóstico si existe */}
            {patient.diagnostico && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-blue-800">
                      Diagnóstico
                    </h4>
                    <p className="text-sm text-blue-700 mt-1">
                      {patient.diagnostico}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Notas adicionales si existen */}
            {patient.notas && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-yellow-800">
                      Notas
                    </h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      {patient.notas}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Botones de acción */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => navigate(`/pacientes/${patient.id}`)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Ver Detalles
              </button>
              
              <div className="flex space-x-2">
                <button
                  onClick={(e) => handleViewObjectives(e, patient.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                  title="Ver objetivos del paciente"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  Objetivos
                </button>
                
                <button
                  onClick={(e) => handleManageEmotions(e, patient.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
                  title="Gestionar emociones del paciente"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Emociones
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PatientsList;