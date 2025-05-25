import React, { useState, useEffect } from 'react'
import { format, parseISO, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import MyCalendar from './Calendar2'
import disponibilidadService from '../../services/disponibilidadService'
import { toast } from 'react-toastify'
import PsicologoSidebar from '../dashboard/PsicologoSidebar'

// Componente personalizado para eventos en el calendario
const CustomEvent = ({ event }) => {
  return (
    <div className="bg-indigo-800 text-white rounded p-1 text-xs text-center overflow-hidden">
      {event.title}
    </div>
  )
}

// Días de la semana en español para UI
const DIAS_SEMANA = [
  { id: 'LUNES', label: 'Lunes' },
  { id: 'MARTES', label: 'Martes' },
  { id: 'MIERCOLES', label: 'Miércoles' },
  { id: 'JUEVES', label: 'Jueves' },
  { id: 'VIERNES', label: 'Viernes' },
  { id: 'SABADO', label: 'Sábado' },
  { id: 'DOMINGO', label: 'Domingo' }
]

const Disponibilidad = () => {
  const [disponibilidades, setDisponibilidades] = useState([])
  const [eventos, setEventos] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  
  // Estado para el formulario de nueva disponibilidad
  const [nuevaDisponibilidad, setNuevaDisponibilidad] = useState({
    diaSemana: 'LUNES',
    horaInicio: '08:00',
    horaFin: '09:00',
    activo: true
  })
  
  // Estado para edición
  const [editingId, setEditingId] = useState(null)
  
  // Cargar disponibilidades al iniciar
  useEffect(() => {
    fetchDisponibilidades()
  }, [])
  
  // Transformar disponibilidades a eventos de calendario
  useEffect(() => {
    if (disponibilidades.length > 0) {
      const today = new Date()
      const events = []
      
      // Generar eventos para las próximas 4 semanas
      for (let i = 0; i < 28; i++) {
        const currentDate = addDays(today, i)
        const diaSemanaActual = format(currentDate, 'EEEE', { locale: es }).toUpperCase()
        
        // Encontrar disponibilidades para este día
        const dispsDelDia = disponibilidades.filter(disp => {
          // Convertir nombres de día al formato español en mayúsculas
          let diaSemanaDisp = disp.diaSemana
          if (diaSemanaDisp === 'LUNES') return diaSemanaActual === 'LUNES'
          if (diaSemanaDisp === 'MARTES') return diaSemanaActual === 'MARTES'
          if (diaSemanaDisp === 'MIERCOLES') return diaSemanaActual === 'MIÉRCOLES'
          if (diaSemanaDisp === 'JUEVES') return diaSemanaActual === 'JUEVES'
          if (diaSemanaDisp === 'VIERNES') return diaSemanaActual === 'VIERNES'
          if (diaSemanaDisp === 'SABADO') return diaSemanaActual === 'SÁBADO'
          if (diaSemanaDisp === 'DOMINGO') return diaSemanaActual === 'DOMINGO'
          return false
        })
        
        // Crear evento para cada disponibilidad encontrada
        dispsDelDia.forEach(disp => {
          if (disp.activo) {
            const [horaInicio, minInicio] = disp.horaInicio.split(':')
            const [horaFin, minFin] = disp.horaFin.split(':')
            
            const start = new Date(currentDate)
            start.setHours(parseInt(horaInicio), parseInt(minInicio), 0)
            
            const end = new Date(currentDate)
            end.setHours(parseInt(horaFin), parseInt(minFin), 0)
            
            events.push({
              id: `${disp.id}-${i}`,
              title: `Disponible: ${disp.horaInicio.substring(0, 5)} - ${disp.horaFin.substring(0, 5)}`,
              start,
              end,
              disponibilidadId: disp.id
            })
          }
        })
      }
      
      setEventos(events)
    }
  }, [disponibilidades])
  
  // Obtener disponibilidades desde el backend
  const fetchDisponibilidades = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await disponibilidadService.getDisponibilidades()
      setDisponibilidades(data)
    } catch (err) {
      console.error('Error al obtener disponibilidades:', err)
      setError('Error al cargar las disponibilidades. Intente nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setNuevaDisponibilidad(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }
  
  // Enviar formulario de nueva disponibilidad
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (editingId) {
        await disponibilidadService.updateDisponibilidad(editingId, nuevaDisponibilidad)
        toast.success('Disponibilidad actualizada correctamente')
      } else {
        await disponibilidadService.createDisponibilidad(nuevaDisponibilidad)
        toast.success('Disponibilidad creada correctamente')
      }
      
      // Resetear formulario y recargar datos
      setNuevaDisponibilidad({
        diaSemana: 'LUNES',
        horaInicio: '08:00',
        horaFin: '09:00',
        activo: true
      })
      setEditingId(null)
      fetchDisponibilidades()
    } catch (err) {
      toast.error(err.message || 'Error al guardar la disponibilidad')
    }
  }
  
  // Editar disponibilidad existente
  const handleEdit = (disp) => {
    setNuevaDisponibilidad({
      diaSemana: disp.diaSemana,
      horaInicio: disp.horaInicio.substring(0, 5),
      horaFin: disp.horaFin.substring(0, 5),
      activo: disp.activo
    })
    setEditingId(disp.id)
  }
  
  // Eliminar disponibilidad
  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta disponibilidad?')) return
    
    try {
      await disponibilidadService.deleteDisponibilidad(id)
      toast.success('Disponibilidad eliminada correctamente')
      fetchDisponibilidades()
    } catch (err) {
      toast.error(err.message || 'Error al eliminar la disponibilidad')
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <PsicologoSidebar />
      
      {/* Main content */}
      <div className="flex-1">
        <div className="flex gap-4 p-4 min-h-[600px]">
          {/* Contenido principal */}
          <div className="flex-1 flex flex-col gap-6">
            <header className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
              <h1 className="text-3xl font-bold text-gray-800">Mi Disponibilidad</h1>
            </header>
            
            {/* Formulario para agregar/editar disponibilidad */}
            <div className="bg-white shadow-md rounded-lg p-6 mx-8">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? 'Editar Disponibilidad' : 'Agregar Nueva Disponibilidad'}
              </h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Selección de día */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Día de la semana
                  </label>
                  <select
                    name="diaSemana"
                    value={nuevaDisponibilidad.diaSemana}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  >
                    {DIAS_SEMANA.map(dia => (
                      <option key={dia.id} value={dia.id}>
                        {dia.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Hora de inicio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de inicio
                  </label>
                  <input
                    type="time"
                    name="horaInicio"
                    value={nuevaDisponibilidad.horaInicio}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                {/* Hora de fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hora de fin
                  </label>
                  <input
                    type="time"
                    name="horaFin"
                    value={nuevaDisponibilidad.horaFin}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                
                {/* Activo/Inactivo */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="activo"
                    checked={nuevaDisponibilidad.activo}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2"
                  />
                  <label className="text-sm text-gray-700">
                    Disponible
                  </label>
                  
                  {/* Botón de guardar */}
                  <button
                    type="submit"
                    className="ml-auto bg-indigo-800 text-white py-2 px-4 rounded hover:bg-indigo-900 transition"
                  >
                    {editingId ? 'Actualizar' : 'Guardar'}
                  </button>
                  
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null)
                        setNuevaDisponibilidad({
                          diaSemana: 'LUNES',
                          horaInicio: '08:00',
                          horaFin: '09:00',
                          activo: true
                        })
                      }}
                      className="ml-2 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Lista de disponibilidades */}
            <div className="bg-white shadow-md rounded-lg p-6 mx-8">
              <h2 className="text-xl font-semibold mb-4">Mis Disponibilidades</h2>
              
              {isLoading ? (
                <p className="text-center py-4">Cargando disponibilidades...</p>
              ) : error ? (
                <p className="text-center text-red-500 py-4">{error}</p>
              ) : disponibilidades.length === 0 ? (
                <p className="text-center py-4">No hay disponibilidades registradas</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Día
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hora Inicio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hora Fin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {disponibilidades.map(disp => {
                        // Encontrar etiqueta para el día de la semana
                        const diaObj = DIAS_SEMANA.find(d => d.id === disp.diaSemana)
                        const diaLabel = diaObj ? diaObj.label : disp.diaSemana
                        
                        return (
                          <tr key={disp.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {diaLabel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {disp.horaInicio && disp.horaInicio.substring(0, 5)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {disp.horaFin && disp.horaFin.substring(0, 5)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                disp.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {disp.activo ? 'Disponible' : 'No disponible'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                              <button
                                onClick={() => handleEdit(disp)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Editar
                              </button>
                              <button
                                onClick={() => handleDelete(disp.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Eliminar
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            
            {/* Calendario */}
            <div className="bg-white shadow-md rounded-lg p-6 mx-8 mb-8">
              <h2 className="text-xl font-semibold mb-4">Vista del Calendario</h2>
              <div className="h-[500px]">
                <MyCalendar
                  events={eventos}
                  components={{ event: CustomEvent }}
                />
              </div>
            </div>
          </div>

          {/* Panel lateral de próximos eventos */}
          <div className="event-summary p-4 border-l border-gray-200 w-80 bg-white shadow-md rounded-lg">
            <h2 className="text-xl font-bold mb-4">Próximas Disponibilidades</h2>
            
            {isLoading ? (
              <p>Cargando...</p>
            ) : eventos.length === 0 ? (
              <p>No hay disponibilidades próximas</p>
            ) : (
              <div className="overflow-y-auto max-h-[550px]">
                {eventos.slice(0, 10).map((ev, idx) => (
                  <div key={idx} className="bg-gray-100 p-3 rounded mb-3 shadow">
                    <p className="text-sm font-semibold">
                      {format(ev.start, 'EEEE d', { locale: es })}
                    </p>
                    <p className="text-sm">
                      {format(ev.start, 'HH:mm')} - {format(ev.end, 'HH:mm')}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Disponibilidad