/**
 * Componente para mostrar el progreso emocional del paciente
 * Solo lectura - el paciente puede ver su evolución
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRegistroEmociones } from '../../hooks/useRegistroEmociones';
import { useAuth } from '../../hooks/useAuth';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts';
import { CalendarIcon, TrendingUpIcon, HeartIcon } from '@heroicons/react/24/outline';

const ProgresoEmocionalPaciente = () => {
  const { user } = useAuth();
  const { 
    registros, 
    estadisticas, 
    cargarRegistros, 
    cargarEstadisticas, 
    loading,
    getColorEmocion,
    getNombreAmigableEmocion
  } = useRegistroEmociones();

  const [rangoFecha, setRangoFecha] = useState('mes');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');

  // Cargar datos inicialmente
  useEffect(() => {
    if (user?.id) {
      cargarDatos();
    }
  }, [user, rangoFecha]);

  const cargarDatos = async () => {
    const filtros = getFiltrosFecha();
    await Promise.all([
      cargarRegistros(filtros),
      cargarEstadisticas(filtros)
    ]);
  };

  const getFiltrosFecha = () => {
    const hoy = new Date();
    let inicio, fin;

    switch (rangoFecha) {
      case 'semana':
        inicio = new Date(hoy.setDate(hoy.getDate() - 7));
        fin = new Date();
        break;
      case 'mes':
        inicio = new Date(hoy.setMonth(hoy.getMonth() - 1));
        fin = new Date();
        break;
      case 'trimestre':
        inicio = new Date(hoy.setMonth(hoy.getMonth() - 3));
        fin = new Date();
        break;
      case 'personalizado':
        if (fechaInicio && fechaFin) {
          inicio = new Date(fechaInicio);
          fin = new Date(fechaFin);
        }
        break;
      default:
        return {};
    }

    return inicio && fin ? {
      startDate: inicio.toISOString().split('T')[0],
      endDate: fin.toISOString().split('T')[0]
    } : {};
  };

  // Preparar datos para el gráfico de líneas
  const prepararDatosLinea = () => {
    if (!registros || registros.length === 0) return [];

    return registros.map(registro => ({
      fecha: new Date(registro.fechaRegistro).toLocaleDateString(),
      fechaCompleta: registro.fechaRegistro,
      ...registro.emociones,
      intensidadPromedio: registro.intensidadPromedio
    })).sort((a, b) => new Date(a.fechaCompleta) - new Date(b.fechaCompleta));
  };

  // Preparar datos para el gráfico radar (última sesión)
  const prepararDatosRadar = () => {
    if (!registros || registros.length === 0) return [];

    const ultimoRegistro = registros[0]; // Ya están ordenados por fecha DESC
    if (!ultimoRegistro?.emociones) return [];

    return Object.entries(ultimoRegistro.emociones).map(([emocion, intensidad]) => ({
      emocion: getNombreAmigableEmocion(emocion),
      intensidad: intensidad,
      fullMark: 10
    }));
  };

  // Calcular indicadores rápidos
  const calcularIndicadores = () => {
    if (!estadisticas) return null;

    const mejorDia = registros.reduce((mejor, registro) => {
      return registro.intensidadPromedio > (mejor?.intensidadPromedio || 0) ? registro : mejor;
    }, null);

    const peorDia = registros.reduce((peor, registro) => {
      return registro.intensidadPromedio < (peor?.intensidadPromedio || 10) ? registro : peor;
    }, null);

    return {
      promedioSemanal: estadisticas.resumen?.promedioIntensidad || 0,
      emocionFrecuente: estadisticas.resumen?.emocionMasFrecuente || 'N/A',
      mejorDia: mejorDia ? {
        fecha: new Date(mejorDia.fechaRegistro).toLocaleDateString(),
        intensidad: mejorDia.intensidadPromedio
      } : null,
      peorDia: peorDia ? {
        fecha: new Date(peorDia.fechaRegistro).toLocaleDateString(),
        intensidad: peorDia.intensidadPromedio
      } : null
    };
  };

  const indicadores = calcularIndicadores();
  const datosLinea = prepararDatosLinea();
  const datosRadar = prepararDatosRadar();

  const emociones = ['ansiedad', 'tristeza', 'alegria', 'ira', 'estres', 'calma'];

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
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Mi Progreso Emocional</h2>
        <p className="text-blue-100">
          Visualiza cómo ha evolucionado tu estado emocional según el registro de tu psicólogo
        </p>
      </div>

      {/* Selector de Rango de Fechas */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Período:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'semana', label: 'Última semana' },
              { value: 'mes', label: 'Último mes' },
              { value: 'trimestre', label: 'Último trimestre' },
              { value: 'personalizado', label: 'Personalizado' }
            ].map((opcion) => (
              <button
                key={opcion.value}
                onClick={() => setRangoFecha(opcion.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  rangoFecha === opcion.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {opcion.label}
              </button>
            ))}
          </div>

          {rangoFecha === 'personalizado' && (
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button
                onClick={cargarDatos}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Aplicar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Indicadores Rápidos */}
      {indicadores && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <TrendingUpIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Promedio General</p>
                <p className="text-xl font-bold text-gray-900">
                  {indicadores.promedioSemanal}/10
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Emoción Más Frecuente</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {getNombreAmigableEmocion(indicadores.emocionFrecuente)}
                </p>
              </div>
            </div>
          </div>

          {indicadores.mejorDia && (
            <div className="bg-white rounded-lg shadow p-4">
              <div>
                <p className="text-sm text-gray-600">Mejor Día</p>
                <p className="text-lg font-bold text-green-600">
                  {indicadores.mejorDia.fecha}
                </p>
                <p className="text-sm text-gray-500">
                  Intensidad: {indicadores.mejorDia.intensidad}/10
                </p>
              </div>
            </div>
          )}

          {indicadores.peorDia && (
            <div className="bg-white rounded-lg shadow p-4">
              <div>
                <p className="text-sm text-gray-600">Día Más Difícil</p>
                <p className="text-lg font-bold text-red-600">
                  {indicadores.peorDia.fecha}
                </p>
                <p className="text-sm text-gray-500">
                  Intensidad: {indicadores.peorDia.intensidad}/10
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Líneas - Evolución Temporal */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Evolución Emocional</h3>
          
          {datosLinea.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosLinea}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Legend />
                {emociones.map((emocion) => (
                  <Line
                    key={emocion}
                    type="monotone"
                    dataKey={emocion}
                    stroke={getColorEmocion(emocion)}
                    strokeWidth={2}
                    name={getNombreAmigableEmocion(emocion)}
                    connectNulls={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No hay datos para mostrar en este período
            </div>
          )}
        </div>

        {/* Gráfico Radar - Estado Actual */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Estado Emocional Actual</h3>
          
          {datosRadar.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={datosRadar}>
                <PolarGrid />
                <PolarAngleAxis dataKey="emocion" />
                <PolarRadiusAxis domain={[0, 10]} />
                <Radar
                  name="Intensidad"
                  dataKey="intensidad"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No hay registros recientes
            </div>
          )}
        </div>
      </div>

      {/* Comentarios del Psicólogo */}
      {registros && registros.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Comentarios Recientes del Psicólogo
          </h3>
          
          <div className="space-y-4">
            {registros.slice(0, 3).map((registro) => (
              registro.comentarios && (
                <div key={registro.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm text-gray-600">
                      {new Date(registro.fechaRegistro).toLocaleDateString()}
                    </p>
                    <span className="text-xs text-gray-500">
                      {registro.psicologo?.name}
                    </span>
                  </div>
                  <p className="text-gray-800">{registro.comentarios}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProgresoEmocionalPaciente;
