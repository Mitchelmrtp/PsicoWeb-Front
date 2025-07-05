import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { psychologistService } from '../services/api';
import { registroEmocionService } from '../services/api/registroEmocionService';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import NavigationSidebar from '../components/layout/NavigationSidebar';

// Registrar los componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GestionEmocionesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ desde: '', hasta: '' });
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [emociones, setEmociones] = useState([]);
  const [loadingEmociones, setLoadingEmociones] = useState(false);

  useEffect(() => {
    if (user?.role === 'psicologo') {
      cargarPacientes();
    }
  }, [user]);

  const cargarPacientes = async () => {
    try {
      setLoading(true);
      const response = await psychologistService.getMyPatients();
      const pacientesData = response.data || response;
      setPacientes(Array.isArray(pacientesData) ? pacientesData : []);
    } catch (error) {
      console.error('❌ Error al cargar pacientes:', error);
      setPacientes([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePacienteClick = async (paciente) => {
    setSelectedPaciente(paciente);
    await cargarEmocionesPaciente(paciente.id);
  };

  const cargarEmocionesPaciente = async (pacienteId) => {
    setLoadingEmociones(true);
    try {
      const params = { pacienteId };
      if (dateFilter.desde) params.startDate = dateFilter.desde;
      if (dateFilter.hasta) params.endDate = dateFilter.hasta;
      
      const response = await registroEmocionService.getRegistros(params);
      
      // La respuesta tiene la estructura: { success: true, data: { registros: [...], total: X } }
      const registrosData = response?.data?.registros || response?.registros || [];
      
      // Procesar los registros para calcular campos necesarios
      const registrosProcesados = Array.isArray(registrosData) ? registrosData.map(registro => {
        // Calcular intensidad promedio desde el objeto emociones
        let intensidadPromedio = 0;
        let estadoGeneral = 'regular';
        
        if (registro.emociones && typeof registro.emociones === 'object') {
          const valores = Object.values(registro.emociones);
          if (valores.length > 0) {
            intensidadPromedio = valores.reduce((sum, val) => sum + (Number(val) || 0), 0) / valores.length;
            
            // Determinar estado general basado en el promedio
            if (intensidadPromedio >= 8) {
              estadoGeneral = 'muy_bueno';
            } else if (intensidadPromedio >= 6) {
              estadoGeneral = 'bueno';
            } else if (intensidadPromedio >= 4) {
              estadoGeneral = 'regular';
            } else if (intensidadPromedio >= 2) {
              estadoGeneral = 'malo';
            } else {
              estadoGeneral = 'muy_malo';
            }
          }
        }
        
        return {
          ...registro,
          intensidadPromedio: Number(intensidadPromedio) || 0,
          estadoGeneral: registro.estadoGeneral || estadoGeneral,
          comentarios: registro.comentarios || 'Sin comentarios'
        };
      }) : [];
      
      setEmociones(registrosProcesados);
    } catch (err) {
      console.error('❌ Error al cargar emociones:', err);
      setEmociones([]);
    } finally {
      setLoadingEmociones(false);
    }
  };

  const getNombrePaciente = (paciente) => {
    if (!paciente) return 'Sin seleccionar';
    
    // Primero intentar con datos del usuario relacionado
    if (paciente.user) {
      const { user } = paciente;
      if (user.name) return user.name;
      if (user.first_name || user.last_name) {
        return `${user.first_name || ''} ${user.last_name || ''}`.trim();
      }
    }
    
    // Fallback a campos directos del paciente
    return paciente.name || 
           paciente.nombre || 
           paciente.firstName || 
           paciente.first_name || 
           `${paciente.firstName || paciente.first_name || ''} ${paciente.lastName || paciente.last_name || ''}`.trim() ||
           paciente.username ||
           'Sin nombre';
  };

  const getEmailPaciente = (paciente) => {
    if (!paciente) return '';
    
    // Primero intentar con datos del usuario relacionado
    if (paciente.user && paciente.user.email) {
      return paciente.user.email;
    }
    
    // Fallback a campos directos del paciente
    return paciente.email || paciente.correo || paciente.username || '';
  };

  const handleRegistrarEmociones = (pacienteId) => {
    navigate(`/registrar-emociones/${pacienteId}`);
  };

  const handleDateFilterChange = async () => {
    if (selectedPaciente) {
      await cargarEmocionesPaciente(selectedPaciente.id);
    }
  };

  const pacientesFiltrados = pacientes.filter(paciente => {
    // Buscar en datos del usuario relacionado
    let nombre = '';
    let email = '';
    
    if (paciente.user) {
      nombre = paciente.user.name || 
               `${paciente.user.first_name || ''} ${paciente.user.last_name || ''}`.trim() ||
               '';
      email = paciente.user.email || '';
    }
    
    // Fallback a campos directos del paciente
    if (!nombre) {
      nombre = paciente.name || paciente.nombre || paciente.firstName || '';
    }
    if (!email) {
      email = paciente.email || paciente.correo || '';
    }
    
    return nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (!user || user.role !== 'psicologo') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">Solo los psicólogos pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NavigationSidebar />
      <main className="flex-1 p-6 flex gap-6">
        {/* Panel izquierdo: lista de pacientes */}
        <div className="w-full max-w-sm">
          <div className="mb-6">
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
            <div className="p-4 bg-gray-50 rounded-t-lg">
              <h3 className="text-sm font-medium text-gray-900">Mis Pacientes ({pacientesFiltrados.length})</h3>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : pacientesFiltrados.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="mt-2">No hay pacientes</p>
              </div>
            ) : (
              pacientesFiltrados.map((paciente) => (
                <div
                  key={paciente.id}
                  className={`p-4 cursor-pointer hover:bg-blue-50 transition-colors ${selectedPaciente?.id === paciente.id ? 'bg-blue-100 border-r-4 border-blue-500' : ''}`}
                  onClick={() => handlePacienteClick(paciente)}
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                      {getNombrePaciente(paciente)?.charAt(0)?.toUpperCase() || 'P'}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {getNombrePaciente(paciente)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {getEmailPaciente(paciente) || 'Sin email'}
                      </div>
                    </div>
                    {selectedPaciente?.id === paciente.id && (
                      <div className="text-blue-500">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel derecho: detalles de emociones */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Emociones</h1>
              {selectedPaciente && (
                <div className="text-gray-600">
                  Paciente: <span className="font-semibold text-blue-600">
                    {selectedPaciente.name || selectedPaciente.nombre || selectedPaciente.firstName || 'Sin nombre'}
                  </span>
                </div>
              )}
            </div>
            {selectedPaciente && (
              <button
                onClick={() => handleRegistrarEmociones(selectedPaciente.id)}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Registrar Emociones
              </button>
            )}
          </div>

          {!selectedPaciente ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona un paciente</h3>
              <p className="text-gray-500">Elige un paciente de la lista para ver sus registros emocionales</p>
            </div>
          ) : (
            <>
              {/* Filtros de fecha */}
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                  </svg>
                  Filtros de Fecha
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                    <input
                      type="date"
                      value={dateFilter.desde}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, desde: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                    <input
                      type="date"
                      value={dateFilter.hasta}
                      onChange={(e) => setDateFilter(prev => ({ ...prev, hasta: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleDateFilterChange}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Filtrar
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabla de registros de emociones */}
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Registros de Emociones
                </h2>
                {loadingEmociones ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : !Array.isArray(emociones) || emociones.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">No hay registros de emociones para este paciente.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Registro</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado General</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intensidad Promedio</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentarios</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.isArray(emociones) && emociones.map((registro) => (
                          <tr key={registro.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {registro.fechaRegistro ? new Date(registro.fechaRegistro).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                registro.estadoGeneral === 'muy_bueno' ? 'bg-green-100 text-green-800' :
                                registro.estadoGeneral === 'bueno' ? 'bg-green-100 text-green-800' :
                                registro.estadoGeneral === 'regular' ? 'bg-yellow-100 text-yellow-800' :
                                registro.estadoGeneral === 'malo' ? 'bg-red-100 text-red-800' :
                                registro.estadoGeneral === 'muy_malo' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {registro.estadoGeneral || 'No especificado'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <div className="flex items-center">
                                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${Math.min(100, Math.max(0, (Number(registro.intensidadPromedio) || 0) / 10 * 100))}%` }}
                                  ></div>
                                </div>
                                <span className="font-medium">{Number(registro.intensidadPromedio || 0).toFixed(1)}/10</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {registro.comentarios || 'Sin comentarios'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Gráfico de evolución */}
              {Array.isArray(emociones) && emociones.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <svg className="h-6 w-6 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Evolución Emocional - Progreso Estadístico
                  </h2>
                  <div className="h-96">
                    <Line
                      data={{
                        labels: emociones.map(r => r.fechaRegistro ? new Date(r.fechaRegistro).toLocaleDateString('es-ES', {
                          month: 'short',
                          day: 'numeric'
                        }) : '-'),
                        datasets: [
                          {
                            label: 'Intensidad Promedio',
                            data: emociones.map(r => Number(r.intensidadPromedio) || 0),
                            fill: false,
                            borderColor: '#3b82f6',
                            backgroundColor: '#3b82f6',
                            tension: 0.4,
                            pointBackgroundColor: '#1d4ed8',
                            pointBorderColor: '#ffffff',
                            pointBorderWidth: 2,
                            pointRadius: 6,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: { 
                            display: true,
                            position: 'top',
                          },
                          tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleColor: 'white',
                            bodyColor: 'white',
                            borderColor: '#3b82f6',
                            borderWidth: 1,
                          }
                        },
                        scales: {
                          y: { 
                            beginAtZero: true, 
                            max: 10,
                            title: {
                              display: true,
                              text: 'Intensidad Emocional (0-10)'
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)',
                            }
                          },
                          x: {
                            title: {
                              display: true,
                              text: 'Fecha de Registro'
                            },
                            grid: {
                              color: 'rgba(0, 0, 0, 0.1)',
                            }
                          }
                        },
                      }}
                    />
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {emociones.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Registros</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {emociones.length > 0 ? (emociones.reduce((sum, r) => sum + (Number(r.intensidadPromedio) || 0), 0) / emociones.length).toFixed(1) : '0.0'}
                      </div>
                      <div className="text-sm text-gray-600">Promedio General</div>
                    </div>
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {emociones.length > 0 ? Math.max(...emociones.map(r => Number(r.intensidadPromedio) || 0)).toFixed(1) : '0.0'}
                      </div>
                      <div className="text-sm text-gray-600">Mejor Registro</div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default GestionEmocionesPage;
