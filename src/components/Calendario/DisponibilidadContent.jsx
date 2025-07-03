import React, { useState, useEffect } from 'react'
import { format, parseISO, addDays } from 'date-fns'
import { es } from 'date-fns/locale'
import MyCalendar from './Calendar2'
import disponibilidadService from '../../services/disponibilidadService'
import { toast } from 'react-toastify'

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
      const eventosCalendario = []
      
      // Generar eventos para los próximos 30 días
      for (let i = 0; i < 30; i++) {
        const fecha = addDays(new Date(), i)
        const diaSemana = format(fecha, 'eeee', { locale: es }).toUpperCase()
        const normalizedDia = diaSemana === 'MIÉRCOLES' ? 'MIERCOLES' : 
                             diaSemana === 'SÁBADO' ? 'SABADO' : diaSemana
        
        // Encontrar disponibilidades para este día
        const dispsDelDia = disponibilidades.filter(disp => {
          const dispDia = disp.diaSemana === 'MIERCOLES' ? 'MIÉRCOLES' : 
                          disp.diaSemana === 'SABADO' ? 'SÁBADO' : disp.diaSemana
          return dispDia === diaSemana && disp.activo
        })
        
        // Crear evento para cada disponibilidad encontrada
        dispsDelDia.forEach(disp => {
          const [horaInicio, minutoInicio] = disp.horaInicio.split(':').map(Number)
          const [horaFin, minutoFin] = disp.horaFin.split(':').map(Number)
          
          const eventoInicio = new Date(fecha)
          eventoInicio.setHours(horaInicio, minutoInicio, 0)
          
          const eventoFin = new Date(fecha)
          eventoFin.setHours(horaFin, minutoFin, 0)
          
          eventosCalendario.push({
            title: `Disponible`,
            start: eventoInicio,
            end: eventoFin,
            resource: {
              diaSemana: disp.diaSemana,
              disponibilidadId: disp.id
            }
          })
        })
      }
      
      setEventos(eventosCalendario)
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
      console.log('Enviando datos de disponibilidad:', nuevaDisponibilidad);
      
      if (editingId) {
        await disponibilidadService.updateDisponibilidad(editingId, nuevaDisponibilidad)
        toast.success('Disponibilidad actualizada correctamente')
      } else {
        const resultado = await disponibilidadService.createDisponibilidad(nuevaDisponibilidad)
        console.log('Respuesta del servidor:', resultado);
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
      console.error('Error detallado:', err);
      toast.error(`Error: ${err.message || 'Error al guardar la disponibilidad'}`);
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
    <div className="flex-1 bg-gray-50 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mi Disponibilidad</h1>
          <p className="text-gray-600 mt-2">Gestiona tus horarios de atención</p>
        </header>
        
        {/* Formulario para agregar/editar disponibilidad */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
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

            {/* Botón de envío */}
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-indigo-800 text-white py-2 px-4 rounded hover:bg-indigo-900 transition-colors"
              >
                {editingId ? 'Actualizar' : 'Agregar'}
              </button>
            </div>
          </form>

          {/* Checkbox para activo/inactivo */}
          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="activo"
                checked={nuevaDisponibilidad.activo}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Disponibilidad activa</span>
            </label>
          </div>
        </div>

        {/* Lista de disponibilidades existentes */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Disponibilidades Configuradas</h3>
          
          {isLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-800 mx-auto"></div>
              <p className="mt-2 text-gray-600">Cargando disponibilidades...</p>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchDisponibilidades}
                className="mt-2 text-indigo-800 hover:underline"
              >
                Reintentar
              </button>
            </div>
          ) : disponibilidades.length === 0 ? (
            <p className="text-gray-600 text-center py-4">
              No hay disponibilidades configuradas. Agrega una nueva arriba.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {disponibilidades.map(disp => (
                <div key={disp.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">
                      {DIAS_SEMANA.find(d => d.id === disp.diaSemana)?.label || disp.diaSemana}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      disp.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {disp.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    {disp.horaInicio.substring(0, 5)} - {disp.horaFin.substring(0, 5)}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(disp)}
                      className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded hover:bg-yellow-200"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(disp.id)}
                      className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded hover:bg-red-200"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Calendario de vista */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Vista de Calendario</h3>
          {eventos.length > 0 ? (
            <MyCalendar 
              events={eventos}
              components={{
                event: CustomEvent
              }}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No hay eventos para mostrar en el calendario.</p>
              <p className="text-sm text-gray-500 mt-1">
                Los eventos aparecerán cuando agregues disponibilidades activas.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Disponibilidad
