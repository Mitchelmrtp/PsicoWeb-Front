import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import NavigationSidebar from '../components/layout/NavigationSidebar';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { toast } from 'react-toastify';
import { format, parseISO, addDays, addWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

const CitaDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cita, setCita] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showReprogramCostWarning, setShowReprogramCostWarning] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: ''
  });

  useEffect(() => {
    if (id) {
      fetchCitaDetails();
    }
  }, [id]);

  const fetchCitaDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${ENDPOINTS.SESIONES}/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      });

      if (!response.ok) {
        throw new Error('No se pudo cargar la información de la cita');
      }

      const result = await response.json();
      const citaData = result.data || result;
      setCita(citaData);
    } catch (error) {
      console.error('Error fetching cita details:', error);
      setError(error.message);
      toast.error('Error al cargar los detalles de la cita');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'EEEE, d MMMM yyyy', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'HH:mm', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'programada':
        return 'bg-blue-100 text-blue-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'reprogramada':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isPaciente = user?.rol === 'paciente';
  const isPsicologo = user?.rol === 'psicologo';

  const handleCancelCita = async () => {
    // Mostrar advertencia específica para pacientes
    const confirmMessage = isPaciente 
      ? '⚠️ IMPORTANTE: Al cancelar esta cita NO se realizará reembolso del pago. ¿Estás seguro de que deseas cancelar?'
      : '¿Estás seguro de que deseas cancelar esta cita?';
      
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      setActionLoading('cancel');
      const response = await fetch(`${ENDPOINTS.SESIONES}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          estado: 'cancelada'
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo cancelar la cita');
      }

      const result = await response.json();
      if (result.success || result.data) {
        setCita(prev => ({ ...prev, estado: 'cancelada' }));
        toast.success('Cita cancelada exitosamente');
      } else {
        throw new Error(result.message || 'Error al cancelar la cita');
      }
    } catch (error) {
      console.error('Error canceling cita:', error);
      toast.error('Error al cancelar la cita: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmAttendance = async () => {
    // Solo los psicólogos pueden confirmar asistencia
    if (!isPsicologo) {
      toast.error('Solo los psicólogos pueden confirmar la asistencia');
      return;
    }
    
    if (!window.confirm('¿Confirmas que el paciente asistió a esta cita?')) {
      return;
    }

    try {
      setActionLoading('confirm');
      const response = await fetch(`${ENDPOINTS.SESIONES}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          estado: 'completada'
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo confirmar la asistencia');
      }

      const result = await response.json();
      if (result.success || result.data) {
        setCita(prev => ({ ...prev, estado: 'completada' }));
        toast.success('Asistencia confirmada exitosamente');
      } else {
        throw new Error(result.message || 'Error al confirmar asistencia');
      }
    } catch (error) {
      console.error('Error confirming attendance:', error);
      toast.error('Error al confirmar asistencia: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRescheduleCita = async () => {
    if (!rescheduleData.fecha || !rescheduleData.horaInicio || !rescheduleData.horaFin) {
      toast.error('Por favor completa todos los campos para reprogramar');
      return;
    }

    // Verificar si es la segunda reprogramación para pacientes
    const isSecondReschedule = cita.cantidadReprogramaciones >= 1;
    const additionalCost = isSecondReschedule && isPaciente ? (cita.Psicologo?.tarifaPorSesion * 0.1 || 5) : 0;

    if (isSecondReschedule && isPaciente && !showReprogramCostWarning) {
      setShowReprogramCostWarning(true);
      return;
    }

    try {
      setActionLoading('reschedule');
      const response = await fetch(`${ENDPOINTS.SESIONES}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({
          fecha: rescheduleData.fecha,
          horaInicio: rescheduleData.horaInicio,
          horaFin: rescheduleData.horaFin,
          estado: 'reprogramada',
          costoAdicional: additionalCost
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo reprogramar la cita');
      }

      const result = await response.json();
      if (result.success || result.data) {
        setCita(prev => ({
          ...prev,
          fecha: rescheduleData.fecha,
          horaInicio: rescheduleData.horaInicio,
          horaFin: rescheduleData.horaFin,
          estado: 'reprogramada',
          cantidadReprogramaciones: (prev.cantidadReprogramaciones || 0) + 1
        }));
        setShowRescheduleModal(false);
        setShowReprogramCostWarning(false);
        setRescheduleData({ fecha: '', horaInicio: '', horaFin: '' });
        
        if (additionalCost > 0) {
          toast.success(`Cita reprogramada exitosamente. Se aplicó un costo adicional de $${additionalCost.toFixed(2)}`);
        } else {
          toast.success('Cita reprogramada exitosamente');
        }
      } else {
        throw new Error(result.message || 'Error al reprogramar la cita');
      }
    } catch (error) {
      console.error('Error rescheduling cita:', error);
      toast.error('Error al reprogramar la cita: ' + error.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getSuggestedDates = () => {
    const today = new Date();
    const tomorrow = addDays(today, 1);
    const nextWeek = addWeeks(today, 1);
    return [
      { label: 'Mañana', date: format(tomorrow, 'yyyy-MM-dd') },
      { label: 'Próxima semana', date: format(nextWeek, 'yyyy-MM-dd') },
      { label: 'En 2 semanas', date: format(addWeeks(today, 2), 'yyyy-MM-dd') }
    ];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <NavigationSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !cita) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <NavigationSidebar />
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <div className="text-red-600 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No se pudo cargar la cita</h3>
              <p className="text-gray-600 mb-4">{error || 'La cita solicitada no existe o no tienes permisos para verla.'}</p>
              <button
                onClick={() => navigate('/consultas')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Volver a Consultas
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavigationSidebar />
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/consultas')}
              className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver a Consultas
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Detalles de la Cita</h1>
          </div>

          {/* Cita Details */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Información de la Sesión
                </h2>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cita.estado)}`}>
                  {cita.estado?.charAt(0).toUpperCase() + cita.estado?.slice(1) || 'Sin estado'}
                </span>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Fecha y Hora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Fecha</h3>
                  <p className="text-lg text-gray-900">{formatDate(cita.fecha)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Hora</h3>
                  <p className="text-lg text-gray-900">
                    {cita.horaInicio && cita.horaFin 
                      ? `${cita.horaInicio} - ${cita.horaFin}`
                      : 'Hora no disponible'
                    }
                  </p>
                </div>
              </div>

              {/* Profesional */}
              {cita.Psicologo && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Psicólogo</h3>
                  <p className="text-lg text-gray-900">
                    {cita.Psicologo.User?.name || 
                     `${cita.Psicologo.User?.first_name || ''} ${cita.Psicologo.User?.last_name || ''}`.trim() ||
                     'Información no disponible'}
                  </p>
                  {cita.Psicologo.especialidad && (
                    <p className="text-sm text-gray-600">Especialidad: {cita.Psicologo.especialidad}</p>
                  )}
                </div>
              )}

              {/* Paciente */}
              {cita.Paciente && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Paciente</h3>
                  <p className="text-lg text-gray-900">
                    {cita.Paciente.User?.name || 
                     `${cita.Paciente.User?.first_name || ''} ${cita.Paciente.User?.last_name || ''}`.trim() ||
                     'Información no disponible'}
                  </p>
                </div>
              )}

              {/* Tipo de Sesión */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Tipo de Sesión</h3>
                <p className="text-lg text-gray-900">{cita.tipoSesion || 'Consulta General'}</p>
              </div>

              {/* Información de Reprogramaciones */}
              {(cita.cantidadReprogramaciones > 0 || cita.estado === 'reprogramada') && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Historial de Reprogramaciones</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-blue-800">
                          Esta cita ha sido reprogramada {cita.cantidadReprogramaciones || 1} {(cita.cantidadReprogramaciones || 1) === 1 ? 'vez' : 'veces'}
                        </p>
                        {isPaciente && (cita.cantidadReprogramaciones >= 1) && (
                          <p className="text-xs text-blue-600 mt-1">
                            ⚠️ Próximas reprogramaciones tendrán un costo adicional del 10%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Observaciones */}
              {cita.observaciones && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Observaciones</h3>
                  <p className="text-gray-900 whitespace-pre-wrap">{cita.observaciones}</p>
                </div>
              )}

              {/* Información de Pago */}
              {cita.Pago && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Información de Pago</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Monto</p>
                        <p className="text-lg font-semibold text-gray-900">${cita.Pago.montoTotal || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Método de Pago</p>
                        <p className="text-gray-900">{cita.Pago.metodoPago || 'No especificado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Estado del Pago</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          cita.Pago.estado === 'completado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cita.Pago.estado || 'Pendiente'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-wrap justify-end gap-3">
                {cita.estado === 'programada' && (
                  <>
                    {/* Confirmar Asistencia - Solo Psicólogos */}
                    {isPsicologo && (
                      <button
                        onClick={handleConfirmAttendance}
                        disabled={actionLoading === 'confirm'}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {actionLoading === 'confirm' ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Confirmando...
                          </>
                        ) : (
                          'Confirmar Asistencia'
                        )}
                      </button>
                    )}

                    {/* Reprogramar - Ambos roles */}
                    <button
                      onClick={() => setShowRescheduleModal(true)}
                      disabled={actionLoading !== null}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Reprogramar
                      {isPaciente && (cita.cantidadReprogramaciones >= 1) && (
                        <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          Costo adicional
                        </span>
                      )}
                    </button>

                    {/* Cancelar - Ambos roles */}
                    <button
                      onClick={handleCancelCita}
                      disabled={actionLoading === 'cancel'}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === 'cancel' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Cancelando...
                        </>
                      ) : (
                        'Cancelar Cita'
                      )}
                    </button>
                  </>
                )}

                {cita.estado === 'completada' && (
                  <div className="text-green-600 font-medium">
                    ✓ Sesión completada
                  </div>
                )}

                {cita.estado === 'cancelada' && (
                  <div className="text-red-600 font-medium">
                    ✗ Sesión cancelada
                  </div>
                )}

                {cita.estado === 'reprogramada' && (
                  <div className="text-yellow-600 font-medium">
                    ↻ Sesión reprogramada
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal de Reprogramación */}
          {showRescheduleModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Reprogramar Cita
                  </h3>
                  
                  {/* Advertencia de costo adicional */}
                  {isPaciente && (cita.cantidadReprogramaciones >= 1) && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex">
                        <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-yellow-800">Costo adicional aplicable</h4>
                          <p className="text-sm text-yellow-700">
                            Esta es tu segunda reprogramación. Se aplicará un costo adicional de ${((cita.Psicologo?.tarifaPorSesion || 50) * 0.1).toFixed(2)}.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-4">
                    {/* Fecha */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nueva Fecha
                      </label>
                      <input
                        type="date"
                        value={rescheduleData.fecha}
                        onChange={(e) => setRescheduleData(prev => ({ ...prev, fecha: e.target.value }))}
                        min={format(new Date(), 'yyyy-MM-dd')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Sugerencias rápidas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sugerencias rápidas:
                      </label>
                      <div className="flex gap-2">
                        {getSuggestedDates().map((suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => setRescheduleData(prev => ({ ...prev, fecha: suggestion.date }))}
                            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-md"
                          >
                            {suggestion.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Hora de Inicio */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Inicio
                      </label>
                      <input
                        type="time"
                        value={rescheduleData.horaInicio}
                        onChange={(e) => setRescheduleData(prev => ({ ...prev, horaInicio: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Hora de Fin */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora de Fin
                      </label>
                      <input
                        type="time"
                        value={rescheduleData.horaFin}
                        onChange={(e) => setRescheduleData(prev => ({ ...prev, horaFin: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setShowRescheduleModal(false);
                        setShowReprogramCostWarning(false);
                        setRescheduleData({ fecha: '', horaInicio: '', horaFin: '' });
                      }}
                      disabled={actionLoading === 'reschedule'}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleRescheduleCita}
                      disabled={actionLoading === 'reschedule'}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === 'reschedule' ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Reprogramando...
                        </>
                      ) : (
                        isPaciente && (cita.cantidadReprogramaciones >= 1) 
                          ? `Confirmar (${((cita.Psicologo?.tarifaPorSesion || 50) * 0.1).toFixed(2)} adicional)`
                          : 'Confirmar Reprogramación'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitaDetailPage;
