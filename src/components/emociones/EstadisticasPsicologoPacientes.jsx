/**
 * Dashboard de estadísticas para psicólogos
 * Permite ver el progreso de todos sus pacientes
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useRegistroEmociones } from '../../hooks/useRegistroEmociones';
import { psychologistService } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  ChartBarIcon,
  CalendarIcon,
  HeartIcon,
  TrophyIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const EstadisticasPsicologoPacientes = () => {
  const { user } = useAuth();
  const { getColorEmocion, getNombreAmigableEmocion } = useRegistroEmociones();
  
  const [loading, setLoading] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [estadisticasPaciente, setEstadisticasPaciente] = useState(null);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    filtroProgreso: '',
    filtroEmocion: '',
    fechaInicio: '',
    fechaFin: ''
  });

  useEffect(() => {
    if (user?.id) {
      cargarPacientes();
    }
  }, [user]);

  const cargarPacientes = async () => {
    setLoading(true);
    try {
      // Simular datos de pacientes (adaptar según tu servicio real)
      const pacientesData = [
        {
          id: 1,
          nombre: 'Ana García',
          email: 'ana.garcia@email.com',
          objetivosCompletados: 3,
          objetivosTotal: 5,
          sesionesAsistidas: 8,
          estadoEmocionalPromedio: 6.5,
          emocionPrincipal: 'ansiedad',
          ultimaSesion: '2024-03-15',
          progresoGeneral: 75
        },
        {
          id: 2,
          nombre: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@email.com',
          objetivosCompletados: 2,
          objetivosTotal: 4,
          sesionesAsistidas: 6,
          estadoEmocionalPromedio: 7.2,
          emocionPrincipal: 'estres',
          ultimaSesion: '2024-03-14',
          progresoGeneral: 60
        },
        {
          id: 3,
          nombre: 'María López',
          email: 'maria.lopez@email.com',
          objetivosCompletados: 4,
          objetivosTotal: 4,
          sesionesAsistidas: 12,
          estadoEmocionalPromedio: 8.1,
          emocionPrincipal: 'alegria',
          ultimaSesion: '2024-03-16',
          progresoGeneral: 95
        },
        {
          id: 4,
          nombre: 'José Martínez',
          email: 'jose.martinez@email.com',
          objetivosCompletados: 1,
          objetivosTotal: 6,
          sesionesAsistidas: 4,
          estadoEmocionalPromedio: 4.8,
          emocionPrincipal: 'tristeza',
          ultimaSesion: '2024-03-10',
          progresoGeneral: 25
        }
      ];

      setPacientes(pacientesData);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      toast.error('Error al cargar datos de pacientes');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticasDetalladas = async (pacienteId) => {
    setLoading(true);
    try {
      // Simular datos detallados del paciente (adaptar según tu servicio real)
      const estadisticasDetalladas = {
        evolucionEmocional: [
          { fecha: '2024-01-15', ansiedad: 8, tristeza: 3, alegria: 4, ira: 2, estres: 7, calma: 3 },
          { fecha: '2024-01-22', ansiedad: 7, tristeza: 2, alegria: 5, ira: 1, estres: 6, calma: 4 },
          { fecha: '2024-01-29', ansiedad: 6, tristeza: 2, alegria: 6, ira: 1, estres: 5, calma: 5 },
          { fecha: '2024-02-05', ansiedad: 5, tristeza: 1, alegria: 7, ira: 1, estres: 4, calma: 6 },
          { fecha: '2024-02-12', ansiedad: 4, tristeza: 1, alegria: 8, ira: 1, estres: 3, calma: 7 },
          { fecha: '2024-02-19', ansiedad: 3, tristeza: 1, alegria: 8, ira: 1, estres: 2, calma: 8 }
        ],
        objetivos: [
          { nombre: 'Manejo de Ansiedad', progreso: 90, completado: false, fechaInicio: '2024-01-10' },
          { nombre: 'Autoestima', progreso: 100, completado: true, fechaInicio: '2024-01-15' },
          { nombre: 'Técnicas de Relajación', progreso: 75, completado: false, fechaInicio: '2024-02-01' },
          { nombre: 'Comunicación Asertiva', progreso: 50, completado: false, fechaInicio: '2024-02-15' }
        ],
        ejercicios: [
          { tipo: 'Respiración', completados: 12, total: 15 },
          { tipo: 'Mindfulness', completados: 8, total: 10 },
          { tipo: 'Escritura', completados: 5, total: 8 },
          { tipo: 'Relajación', completados: 10, total: 12 }
        ],
        asistencia: [
          { mes: 'Enero', programadas: 4, asistidas: 4, canceladas: 0 },
          { mes: 'Febrero', programadas: 4, asistidas: 3, canceladas: 1 },
          { mes: 'Marzo', programadas: 4, asistidas: 4, canceladas: 0 }
        ]
      };

      setEstadisticasPaciente(estadisticasDetalladas);
    } catch (error) {
      console.error('Error al cargar estadísticas detalladas:', error);
      toast.error('Error al cargar estadísticas del paciente');
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionarPaciente = (paciente) => {
    setPacienteSeleccionado(paciente);
    cargarEstadisticasDetalladas(paciente.id);
  };

  const filtrarPacientes = () => {
    return pacientes.filter(paciente => {
      const cumpleBusqueda = paciente.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      const cumpleProgreso = !filtros.filtroProgreso || 
        (filtros.filtroProgreso === 'alto' && paciente.progresoGeneral >= 75) ||
        (filtros.filtroProgreso === 'medio' && paciente.progresoGeneral >= 50 && paciente.progresoGeneral < 75) ||
        (filtros.filtroProgreso === 'bajo' && paciente.progresoGeneral < 50);

      const cumpleEmocion = !filtros.filtroEmocion || 
        paciente.emocionPrincipal === filtros.filtroEmocion;

      return cumpleBusqueda && cumpleProgreso && cumpleEmocion;
    });
  };

  const getProgresoColor = (progreso) => {
    if (progreso >= 75) return 'bg-green-500';
    if (progreso >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getProgresoLabel = (progreso) => {
    if (progreso >= 75) return 'Excelente';
    if (progreso >= 50) return 'Bueno';
    return 'Necesita Atención';
  };

  const prepararDatosEvolucion = () => {
    if (!estadisticasPaciente?.evolucionEmocional) return [];
    
    return estadisticasPaciente.evolucionEmocional.map(registro => ({
      fecha: new Date(registro.fecha).toLocaleDateString(),
      ...registro
    }));
  };

  const prepararDatosAsistencia = () => {
    if (!estadisticasPaciente?.asistencia) return [];
    
    return estadisticasPaciente.asistencia.map(mes => ({
      mes: mes.mes,
      asistencia: Math.round((mes.asistidas / mes.programadas) * 100),
      asistidas: mes.asistidas,
      programadas: mes.programadas,
      canceladas: mes.canceladas
    }));
  };

  if (loading && !pacientes.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Estadísticas de Mis Pacientes</h2>
        <p className="text-indigo-100">
          Monitorea el progreso emocional y terapéutico de todos tus pacientes
        </p>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filtros.filtroProgreso}
            onChange={(e) => setFiltros(prev => ({ ...prev, filtroProgreso: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los progresos</option>
            <option value="alto">Progreso Alto (75%+)</option>
            <option value="medio">Progreso Medio (50-74%)</option>
            <option value="bajo">Necesita Atención (&lt;50%)</option>
          </select>

          <select
            value={filtros.filtroEmocion}
            onChange={(e) => setFiltros(prev => ({ ...prev, filtroEmocion: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las emociones</option>
            <option value="ansiedad">Ansiedad</option>
            <option value="tristeza">Tristeza</option>
            <option value="alegria">Alegría</option>
            <option value="ira">Ira</option>
            <option value="estres">Estrés</option>
            <option value="calma">Calma</option>
          </select>

          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Pacientes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2" />
                Mis Pacientes ({filtrarPacientes().length})
              </h3>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filtrarPacientes().map((paciente) => (
                <div
                  key={paciente.id}
                  onClick={() => handleSeleccionarPaciente(paciente)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    pacienteSeleccionado?.id === paciente.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{paciente.nombre}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full text-white ${getProgresoColor(paciente.progresoGeneral)}`}>
                      {getProgresoLabel(paciente.progresoGeneral)}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Objetivos:</span>
                      <span>{paciente.objetivosCompletados}/{paciente.objetivosTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sesiones:</span>
                      <span>{paciente.sesionesAsistidas}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estado emocional:</span>
                      <span>{paciente.estadoEmocionalPromedio}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Emoción principal:</span>
                      <span className="capitalize">{getNombreAmigableEmocion(paciente.emocionPrincipal)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-500">
                    Última sesión: {paciente.ultimaSesion}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detalle del Paciente Seleccionado */}
        <div className="lg:col-span-2">
          {pacienteSeleccionado ? (
            <div className="space-y-6">
              {/* Header del Paciente */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {pacienteSeleccionado.nombre}
                    </h3>
                    <p className="text-gray-600">{pacienteSeleccionado.email}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${
                      pacienteSeleccionado.progresoGeneral >= 75 ? 'text-green-600' :
                      pacienteSeleccionado.progresoGeneral >= 50 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {pacienteSeleccionado.progresoGeneral}%
                    </div>
                    <div className="text-sm text-gray-500">Progreso General</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <TrophyIcon className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">
                      {pacienteSeleccionado.objetivosCompletados}/{pacienteSeleccionado.objetivosTotal}
                    </div>
                    <div className="text-xs text-gray-600">Objetivos</div>
                  </div>

                  <div className="text-center p-3 bg-green-50 rounded">
                    <CalendarIcon className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">
                      {pacienteSeleccionado.sesionesAsistidas}
                    </div>
                    <div className="text-xs text-gray-600">Sesiones</div>
                  </div>

                  <div className="text-center p-3 bg-purple-50 rounded">
                    <HeartIcon className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                    <div className="text-lg font-bold text-gray-900">
                      {pacienteSeleccionado.estadoEmocionalPromedio}/10
                    </div>
                    <div className="text-xs text-gray-600">Estado Emocional</div>
                  </div>

                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-2xl mb-1">
                      {pacienteSeleccionado.emocionPrincipal === 'ansiedad' && '😰'}
                      {pacienteSeleccionado.emocionPrincipal === 'tristeza' && '😢'}
                      {pacienteSeleccionado.emocionPrincipal === 'alegria' && '😊'}
                      {pacienteSeleccionado.emocionPrincipal === 'estres' && '😫'}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {getNombreAmigableEmocion(pacienteSeleccionado.emocionPrincipal)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Gráficos Detallados */}
              {estadisticasPaciente && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Evolución Emocional */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Evolución Emocional</h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={prepararDatosEvolucion()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis domain={[0, 10]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="ansiedad" stroke={getColorEmocion('ansiedad')} strokeWidth={2} />
                        <Line type="monotone" dataKey="alegria" stroke={getColorEmocion('alegria')} strokeWidth={2} />
                        <Line type="monotone" dataKey="estres" stroke={getColorEmocion('estres')} strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Progreso de Objetivos */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Progreso de Objetivos</h4>
                    <div className="space-y-3">
                      {estadisticasPaciente.objetivos.map((objetivo, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-gray-700">{objetivo.nombre}</span>
                            <span className="text-sm text-gray-500">{objetivo.progreso}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                objetivo.completado ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${objetivo.progreso}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ejercicios Completados */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Ejercicios por Tipo</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={estadisticasPaciente.ejercicios}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="tipo" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completados" fill="#3B82F6" name="Completados" />
                        <Bar dataKey="total" fill="#E5E7EB" name="Total" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Asistencia */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Asistencia por Mes</h4>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={prepararDatosAsistencia()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, 'Asistencia']} />
                        <Bar dataKey="asistencia" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <ChartBarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selecciona un Paciente
              </h3>
              <p className="text-gray-600">
                Haz clic en un paciente de la lista para ver sus estadísticas detalladas
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default EstadisticasPsicologoPacientes;
