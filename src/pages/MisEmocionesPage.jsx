import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
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

const MisEmocionesPage = () => {
  const { user } = useAuth();
  const [emociones, setEmociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({ desde: '', hasta: '' });

  useEffect(() => {
    if (user?.role === 'paciente') {
      cargarMisEmociones();
    }
  }, [user]);

  const cargarMisEmociones = async () => {
    setLoading(true);
    try {
      const params = { pacienteId: user.id };
      if (dateFilter.desde) params.fechaDesde = dateFilter.desde;
      if (dateFilter.hasta) params.fechaHasta = dateFilter.hasta;
      
      console.log('🚀 Frontend Paciente - Cargando emociones:');
      console.log('  - pacienteId:', user.id);
      console.log('  - params:', params);
      
      const response = await registroEmocionService.getRegistros(params);
      console.log('📨 Frontend Paciente - Respuesta recibida:', response);
      
      // La respuesta tiene la estructura: { success: true, data: { registros: [...], total: X } }
      const registrosData = response?.data?.registros || response?.registros || [];
      console.log('📊 Frontend Paciente - Registros extraídos:', registrosData);
      
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
      
      console.log('🔄 Frontend Paciente - Registros procesados:', registrosProcesados);
      setEmociones(registrosProcesados);
    } catch (err) {
      console.error('Error al cargar mis emociones:', err);
      setEmociones([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = () => {
    cargarMisEmociones();
  };

  if (!user || user.role !== 'paciente') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceso Denegado</h2>
          <p className="text-gray-600">Solo los pacientes pueden acceder a esta página.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <NavigationSidebar />
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Emociones</h1>
            <p className="text-gray-600">Visualiza tu progreso emocional a lo largo del tiempo</p>
          </div>

          {/* Filtros de fecha */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="h-5 w-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
              </svg>
              Filtrar por Fechas
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
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Filtrar
                </button>
              </div>
            </div>
          </div>

          {/* Estadísticas resumidas */}
          {Array.isArray(emociones) && emociones.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">{emociones.length}</p>
                    <p className="text-sm text-gray-600">Total Registros</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {emociones.length > 0 ? (emociones.reduce((sum, r) => sum + (Number(r.intensidadPromedio) || 0), 0) / emociones.length).toFixed(1) : '0.0'}
                    </p>
                    <p className="text-sm text-gray-600">Promedio General</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {emociones.length > 0 ? Math.max(...emociones.map(r => Number(r.intensidadPromedio) || 0)).toFixed(1) : '0.0'}
                    </p>
                    <p className="text-sm text-gray-600">Mejor Registro</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100">
                    <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900">
                      {emociones.length > 0 ? Math.floor((Date.now() - new Date(emociones[0]?.fechaRegistro)) / (1000 * 60 * 60 * 24)) : 0}
                    </p>
                    <p className="text-sm text-gray-600">Días Registrando</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Gráfico de evolución */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <svg className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Mi Evolución Emocional
            </h2>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : !Array.isArray(emociones) || emociones.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay registros emocionales</h3>
                <p className="text-gray-500">Aún no tienes registros de emociones. Tu psicólogo puede ayudarte a registrar tus estados emocionales.</p>
              </div>
            ) : (
              <div className="h-96">
                <Line
                  data={{
                    labels: emociones.map(r => r.fechaRegistro ? new Date(r.fechaRegistro).toLocaleDateString('es-ES', {
                      month: 'short',
                      day: 'numeric'
                    }) : '-'),
                    datasets: [
                      {
                        label: 'Mi Intensidad Emocional',
                        data: emociones.map(r => Number(r.intensidadPromedio) || 0),
                        fill: false,
                        borderColor: '#10b981',
                        backgroundColor: '#10b981',
                        tension: 0.4,
                        pointBackgroundColor: '#059669',
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
                        borderColor: '#10b981',
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
            )}
          </div>

          {/* Tabla de registros */}
          {Array.isArray(emociones) && emociones.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <svg className="h-6 w-6 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Historial de Registros
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado General</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intensidad</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comentarios</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {emociones.map((registro) => (
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
                            registro.estadoGeneral === 'positivo' ? 'bg-green-100 text-green-800' :
                            registro.estadoGeneral === 'negativo' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {registro.estadoGeneral || 'No especificado'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[80px]">
                              <div 
                                className="bg-green-600 h-2 rounded-full" 
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MisEmocionesPage;
