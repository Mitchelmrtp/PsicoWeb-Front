/**
 * Componente de estadísticas personales para pacientes
 * Muestra progreso en objetivos, ejercicios, emociones y asistencia
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useRegistroEmociones } from '../../hooks/useRegistroEmociones';
import { objetivosService, sessionService } from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  TrophyIcon,
  ClipboardDocumentListIcon,
  CalendarIcon,
  HeartIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const EstadisticasPersonalesPaciente = () => {
  const { user } = useAuth();
  const { estadisticas, cargarEstadisticas, getColorEmocion, getNombreAmigableEmocion } = useRegistroEmociones();
  
  const [loading, setLoading] = useState(true);
  const [estadisticasGenerales, setEstadisticasGenerales] = useState({
    objetivos: { completados: 0, total: 0, pendientes: 0 },
    ejercicios: { completados: 0, total: 0, pendientes: 0 },
    sesiones: { asistidas: 0, programadas: 0, canceladas: 0 },
    logros: []
  });
  const [filtroMes, setFiltroMes] = useState('');
  const [filtroTerapeuta, setFiltroTerapeuta] = useState('');

  useEffect(() => {
    if (user?.id) {
      cargarTodasLasEstadisticas();
    }
  }, [user, filtroMes, filtroTerapeuta]);

  const cargarTodasLasEstadisticas = async () => {
    setLoading(true);
    try {
      // Cargar estadísticas de emociones
      const filtrosEmociones = {};
      if (filtroMes) {
        const [year, month] = filtroMes.split('-');
        const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
        const endDate = new Date(year, month, 0).toISOString().split('T')[0];
        filtrosEmociones.startDate = startDate;
        filtrosEmociones.endDate = endDate;
      }
      
      await cargarEstadisticas(filtrosEmociones);

      // Cargar estadísticas de objetivos y ejercicios
      await cargarEstadisticasObjetivos();
      
      // Cargar estadísticas de sesiones
      await cargarEstadisticasSesiones();

    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticasObjetivos = async () => {
    try {
      // Simular datos de objetivos (adaptar según tu servicio real)
      const objetivosData = {
        completados: 3,
        total: 5,
        pendientes: 2,
        progresoPorObjetivo: [
          { nombre: 'Manejo de Ansiedad', progreso: 80, completado: false },
          { nombre: 'Autoestima', progreso: 100, completado: true },
          { nombre: 'Relaciones Sociales', progreso: 60, completado: false },
          { nombre: 'Control de Ira', progreso: 100, completado: true },
          { nombre: 'Mindfulness', progreso: 40, completado: false }
        ]
      };

      const ejerciciosData = {
        completados: 14,
        total: 20,
        pendientes: 6
      };

      setEstadisticasGenerales(prev => ({
        ...prev,
        objetivos: objetivosData,
        ejercicios: ejerciciosData
      }));
    } catch (error) {
      console.error('Error al cargar estadísticas de objetivos:', error);
    }
  };

  const cargarEstadisticasSesiones = async () => {
    try {
      // Simular datos de sesiones (adaptar según tu servicio real)
      const sesionesData = {
        asistidas: 10,
        programadas: 12,
        canceladas: 2,
        historialAsistencia: [
          { mes: 'Ene', asistidas: 3, programadas: 4 },
          { mes: 'Feb', asistidas: 4, programadas: 4 },
          { mes: 'Mar', asistidas: 3, programadas: 4 }
        ]
      };

      const logrosData = [
        {
          id: 1,
          tipo: 'objetivo',
          titulo: 'Objetivo "Autoestima" completado',
          fecha: '2024-03-15',
          descripcion: 'Has completado exitosamente el objetivo de mejorar tu autoestima'
        },
        {
          id: 2,
          tipo: 'asistencia',
          titulo: '10 sesiones asistidas',
          fecha: '2024-03-10',
          descripcion: 'Felicitaciones por tu constancia en la terapia'
        },
        {
          id: 3,
          tipo: 'ejercicio',
          titulo: 'Ejercicios de respiración',
          fecha: '2024-03-08',
          descripcion: 'Has completado todos los ejercicios de técnicas de respiración'
        }
      ];

      setEstadisticasGenerales(prev => ({
        ...prev,
        sesiones: sesionesData,
        logros: logrosData
      }));
    } catch (error) {
      console.error('Error al cargar estadísticas de sesiones:', error);
    }
  };

  // Preparar datos para gráficos
  const prepararDatosObjetivos = () => {
    if (!estadisticasGenerales.objetivos.progresoPorObjetivo) return [];
    
    return estadisticasGenerales.objetivos.progresoPorObjetivo.map(obj => ({
      name: obj.nombre,
      progreso: obj.progreso,
      completado: obj.completado
    }));
  };

  const prepararDatosEmocionesPorSesion = () => {
    if (!estadisticas?.graficos?.evolucionEmocional) return [];
    
    return estadisticas.graficos.evolucionEmocional.slice(-10).map((registro, index) => ({
      sesion: `S${index + 1}`,
      fecha: new Date(registro.fecha).toLocaleDateString(),
      intensidad: registro.intensidadPromedio,
      ...registro.emociones
    }));
  };

  const coloresGraficos = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  if (loading) {
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
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Mis Estadísticas de Progreso</h2>
        <p className="text-purple-100">
          Visualiza tu evolución completa en terapia: objetivos, ejercicios, emociones y asistencia
        </p>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <ChartBarIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filtros:</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Mes:</label>
            <input
              type="month"
              value={filtroMes}
              onChange={(e) => setFiltroMes(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>

          <button
            onClick={() => {
              setFiltroMes('');
              setFiltroTerapeuta('');
            }}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Resumen General en Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrophyIcon className="h-10 w-10 text-yellow-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Objetivos Completados</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticasGenerales.objetivos.completados}/{estadisticasGenerales.objetivos.total}
              </p>
              <p className="text-xs text-green-600">
                {Math.round((estadisticasGenerales.objetivos.completados / estadisticasGenerales.objetivos.total) * 100)}% completado
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <ClipboardDocumentListIcon className="h-10 w-10 text-blue-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Ejercicios Completados</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticasGenerales.ejercicios.completados}/{estadisticasGenerales.ejercicios.total}
              </p>
              <p className="text-xs text-blue-600">
                {Math.round((estadisticasGenerales.ejercicios.completados / estadisticasGenerales.ejercicios.total) * 100)}% completado
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CalendarIcon className="h-10 w-10 text-green-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Sesiones Asistidas</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticasGenerales.sesiones.asistidas}
              </p>
              <p className="text-xs text-green-600">
                {Math.round((estadisticasGenerales.sesiones.asistidas / estadisticasGenerales.sesiones.programadas) * 100)}% asistencia
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <HeartIcon className="h-10 w-10 text-red-500 mr-4" />
            <div>
              <p className="text-sm text-gray-600">Estado Emocional</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.resumen?.promedioIntensidad || 'N/A'}/10
              </p>
              <p className="text-xs text-red-600">
                Emoción principal: {getNombreAmigableEmocion(estadisticas?.resumen?.emocionMasFrecuente)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos Principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progreso por Objetivo */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Progreso por Objetivo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prepararDatosObjetivos()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
              />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar 
                dataKey="progreso" 
                fill="#3B82F6"
                name="Progreso (%)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Emociones vs Sesiones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Evolución Emocional por Sesión</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={prepararDatosEmocionesPorSesion()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sesion" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="intensidad" 
                stroke="#8884d8" 
                strokeWidth={3}
                name="Intensidad Promedio"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Línea de Tiempo de Logros */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de Logros</h3>
        
        <div className="relative">
          {estadisticasGenerales.logros.map((logro, index) => (
            <div key={logro.id} className="flex items-start mb-6 last:mb-0">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                {logro.tipo === 'objetivo' && <TrophyIcon className="h-4 w-4 text-white" />}
                {logro.tipo === 'asistencia' && <CalendarIcon className="h-4 w-4 text-white" />}
                {logro.tipo === 'ejercicio' && <ClipboardDocumentListIcon className="h-4 w-4 text-white" />}
              </div>
              
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-semibold text-gray-900">{logro.titulo}</h4>
                  <span className="text-sm text-gray-500">{logro.fecha}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{logro.descripcion}</p>
              </div>
              
              {index < estadisticasGenerales.logros.length - 1 && (
                <div className="absolute left-4 mt-8 w-0.5 h-6 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Distribución de Tiempo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución de Objetivos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Completados', value: estadisticasGenerales.objetivos.completados, color: '#10B981' },
                  { name: 'Pendientes', value: estadisticasGenerales.objetivos.pendientes, color: '#F59E0B' }
                ]}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                <Cell fill="#10B981" />
                <Cell fill="#F59E0B" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen de Actividades</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="text-gray-700">Total de sesiones programadas</span>
              <span className="font-bold text-gray-900">{estadisticasGenerales.sesiones.programadas}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded">
              <span className="text-gray-700">Sesiones completadas</span>
              <span className="font-bold text-green-600">{estadisticasGenerales.sesiones.asistidas}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded">
              <span className="text-gray-700">Sesiones canceladas</span>
              <span className="font-bold text-red-600">{estadisticasGenerales.sesiones.canceladas}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
              <span className="text-gray-700">Ejercicios pendientes</span>
              <span className="font-bold text-blue-600">{estadisticasGenerales.ejercicios.pendientes}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EstadisticasPersonalesPaciente;
