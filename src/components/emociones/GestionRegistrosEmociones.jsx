/**
 * Container principal para la gestión de registros de emociones por psicólogos
 * Incluye listado, creación y edición de registros
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { useRegistroEmociones } from '../../hooks/useRegistroEmociones';
import { psychologistService } from '../../services/api';
import RegistroEmocionForm from './RegistroEmocionForm';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CalendarIcon,
  UserIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const GestionRegistrosEmociones = ({ pacienteIdPreseleccionado }) => {
  const { user } = useAuth();
  const { 
    registros, 
    cargarRegistros, 
    eliminarRegistro, 
    loading,
    getNombreAmigableEmocion,
    getColorEmocion
  } = useRegistroEmociones();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [registroEditando, setRegistroEditando] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [filtros, setFiltros] = useState({
    busqueda: '',
    pacienteId: pacienteIdPreseleccionado || '',
    fechaInicio: '',
    fechaFin: '',
    estadoGeneral: ''
  });
  const [vista, setVista] = useState('lista'); // 'lista' | 'cards'

  useEffect(() => {
    if (user?.id) {
      cargarDatos();
    }
  }, [user]);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros]);

  // Manejar paciente preseleccionado
  useEffect(() => {
    if (pacienteIdPreseleccionado && pacienteIdPreseleccionado !== filtros.pacienteId) {
      setFiltros(prev => ({
        ...prev,
        pacienteId: pacienteIdPreseleccionado
      }));
      
      // Mostrar el formulario automáticamente cuando viene desde la lista de pacientes
      setMostrarFormulario(true);
    }
  }, [pacienteIdPreseleccionado]);

  const cargarDatos = async () => {
    try {
      await Promise.all([
        cargarRegistros(),
        cargarPacientes()
      ]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const cargarPacientes = async () => {
    try {
      const response = await psychologistService.getMyPatients();
      const pacientesData = response.data || response;
      setPacientes(pacientesData);
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      toast.error('Error al cargar la lista de pacientes');
    }
  };

  const aplicarFiltros = async () => {
    const filtrosApi = {};
    
    if (filtros.pacienteId) filtrosApi.pacienteId = filtros.pacienteId;
    if (filtros.fechaInicio) filtrosApi.startDate = filtros.fechaInicio;
    if (filtros.fechaFin) filtrosApi.endDate = filtros.fechaFin;

    await cargarRegistros(filtrosApi);
  };

  const registrosFiltrados = registros.filter(registro => {
    const cumpleBusqueda = !filtros.busqueda || 
      registro.paciente?.name?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      registro.comentarios?.toLowerCase().includes(filtros.busqueda.toLowerCase());

    const cumpleEstado = !filtros.estadoGeneral || 
      registro.estadoGeneral === filtros.estadoGeneral;

    return cumpleBusqueda && cumpleEstado;
  });

  const handleNuevoRegistro = () => {
    setRegistroEditando(null);
    setMostrarFormulario(true);
  };

  const handleEditarRegistro = (registro) => {
    setRegistroEditando(registro);
    setMostrarFormulario(true);
  };

  const handleEliminarRegistro = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro?')) {
      try {
        await eliminarRegistro(id);
      } catch (error) {
        // Error ya manejado en el hook
      }
    }
  };

  const handleFormularioExito = () => {
    setMostrarFormulario(false);
    setRegistroEditando(null);
    toast.success('Registro guardado exitosamente');
  };

  const handleFormularioCancelar = () => {
    setMostrarFormulario(false);
    setRegistroEditando(null);
  };

  const getEstadoColor = (estado) => {
    const colores = {
      muy_malo: 'bg-red-100 text-red-800',
      malo: 'bg-red-50 text-red-600',
      regular: 'bg-yellow-100 text-yellow-800',
      bueno: 'bg-green-50 text-green-600',
      muy_bueno: 'bg-green-100 text-green-800'
    };
    return colores[estado] || 'bg-gray-100 text-gray-800';
  };

  const getEstadoLabel = (estado) => {
    const labels = {
      muy_malo: 'Muy Malo',
      malo: 'Malo',
      regular: 'Regular',
      bueno: 'Bueno',
      muy_bueno: 'Muy Bueno'
    };
    return labels[estado] || estado;
  };

  const getEmocionPrincipal = (emociones) => {
    if (!emociones) return null;
    return Object.entries(emociones).reduce((max, [emocion, intensidad]) => 
      intensidad > (max.intensidad || 0) ? { emocion, intensidad } : max
    , {});
  };

  if (mostrarFormulario) {
    return (
      <RegistroEmocionForm
        pacienteId={filtros.pacienteId || null}
        registroExistente={registroEditando}
        onSuccess={handleFormularioExito}
        onCancel={handleFormularioCancelar}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-2">Gestión de Registros Emocionales</h2>
            <p className="text-green-100">
              Registra y gestiona el estado emocional de tus pacientes
            </p>
          </div>
          <button
            onClick={handleNuevoRegistro}
            className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Registro
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <select
            value={filtros.pacienteId}
            onChange={(e) => setFiltros(prev => ({ ...prev, pacienteId: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los pacientes</option>
            {pacientes.map(paciente => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nombre}
              </option>
            ))}
          </select>

          <select
            value={filtros.estadoGeneral}
            onChange={(e) => setFiltros(prev => ({ ...prev, estadoGeneral: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Todos los estados</option>
            <option value="muy_malo">Muy Malo</option>
            <option value="malo">Malo</option>
            <option value="regular">Regular</option>
            <option value="bueno">Bueno</option>
            <option value="muy_bueno">Muy Bueno</option>
          </select>

          <input
            type="date"
            value={filtros.fechaInicio}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaInicio: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="date"
            value={filtros.fechaFin}
            onChange={(e) => setFiltros(prev => ({ ...prev, fechaFin: e.target.value }))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="flex space-x-2">
            <button
              onClick={() => setVista('lista')}
              className={`p-2 rounded ${vista === 'lista' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Lista
            </button>
            <button
              onClick={() => setVista('cards')}
              className={`p-2 rounded ${vista === 'cards' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <>
          {vista === 'lista' ? (
            // Vista de Lista
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paciente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado General
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Emoción Principal
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Intensidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrosFiltrados.map((registro) => {
                      const emocionPrincipal = getEmocionPrincipal(registro.emociones);
                      return (
                        <tr key={registro.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {registro.paciente?.name || 'N/A'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  ID: {registro.idPaciente}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(registro.fechaRegistro).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(registro.estadoGeneral)}`}>
                              {getEstadoLabel(registro.estadoGeneral)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {emocionPrincipal && (
                              <div className="flex items-center">
                                <div 
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: getColorEmocion(emocionPrincipal.emocion) }}
                                ></div>
                                {getNombreAmigableEmocion(emocionPrincipal.emocion)}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {registro.intensidadPromedio}/10
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditarRegistro(registro)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleEliminarRegistro(registro.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            // Vista de Cards
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {registrosFiltrados.map((registro) => {
                const emocionPrincipal = getEmocionPrincipal(registro.emociones);
                return (
                  <motion.div
                    key={registro.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center">
                        <UserIcon className="h-8 w-8 text-gray-400 mr-3" />
                        <div>
                          <h3 className="text-sm font-medium text-gray-900">
                            {registro.paciente?.name || 'N/A'}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {new Date(registro.fechaRegistro).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEstadoColor(registro.estadoGeneral)}`}>
                        {getEstadoLabel(registro.estadoGeneral)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Intensidad Promedio:</span>
                        <span className="text-lg font-bold text-gray-900">{registro.intensidadPromedio}/10</span>
                      </div>

                      {emocionPrincipal && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Emoción Principal:</span>
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: getColorEmocion(emocionPrincipal.emocion) }}
                            ></div>
                            <span className="text-sm font-medium">
                              {getNombreAmigableEmocion(emocionPrincipal.emocion)}
                            </span>
                          </div>
                        </div>
                      )}

                      {registro.comentarios && (
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Comentarios:</p>
                          <p className="text-sm text-gray-800 bg-gray-50 p-2 rounded">
                            {registro.comentarios.length > 100 
                              ? `${registro.comentarios.substring(0, 100)}...`
                              : registro.comentarios
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleEditarRegistro(registro)}
                        className="text-indigo-600 hover:text-indigo-900 p-1"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEliminarRegistro(registro.id)}
                        className="text-red-600 hover:text-red-900 p-1"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {registrosFiltrados.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay registros emocionales
              </h3>
              <p className="text-gray-600 mb-4">
                {filtros.busqueda || filtros.pacienteId || filtros.estadoGeneral
                  ? 'No se encontraron registros con los filtros aplicados'
                  : 'Aún no has creado ningún registro emocional para tus pacientes'
                }
              </p>
              <button
                onClick={handleNuevoRegistro}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Crear Primer Registro
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default GestionRegistrosEmociones;
