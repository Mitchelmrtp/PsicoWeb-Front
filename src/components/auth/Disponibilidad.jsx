import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import MyCalendar from '../common/Calendar2'
import { format } from 'date-fns'
import Sidebar from '../common/SIdebar'

// Componente personalizado para que el evento muestre solo el título
const CustomEvent = ({ event }) => {
  return (
    <div style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
      {event.title}
    </div>
  )
}

const Disponibilidad = () => {
  const eventos = [
    {
      title: '1',
      start: new Date(2025, 4, 20, 10, 0),
      end: new Date(2025, 4, 20, 11, 0),
    },
    {
      title: '1',
      start: new Date(2025, 4, 23, 18, 0),
      end: new Date(2025, 4, 23, 19, 0),
    },
    {
      title: '2',
      start: new Date(2025, 4, 23, 10, 0),
      end: new Date(2025, 4, 23, 11, 0),
    },
    {
      title: '2',
      start: new Date(2025, 4, 19, 10, 0),
      end: new Date(2025, 4, 19, 11, 0),
    },
    {
      title: '3',
      start: new Date(2025, 4, 14, 10, 0),
      end: new Date(2025, 4, 14, 11, 0),
    },
    {
      title: '3',
      start: new Date(2025, 4, 31, 10, 0),
      end: new Date(2025, 4, 31, 11, 0),
    },
  ]

  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-4xl font-extrabold text-gray-800">DISPONIBILIDAD</h1>
      </header>

      <div className="flex gap-4 p-4 min-h-[600px]">
        {/* Sidebar a la izquierda */}
        <Sidebar />

        {/* Calendario al centro */}
        <div className="flex-1">
          <MyCalendar
            events={eventos}
            components={{ event: CustomEvent }} // Pasamos el componente personalizado
          />
        </div>

        {/* Resumen lateral a la derecha */}
        <EventSummary eventos={eventos} />
      </div>
    </div>
  )
}

const EventSummary = ({ eventos }) => {
  return (
    <div className="event-summary p-4 border-l border-gray-200 w-80 overflow-auto h-[600px]">
      <h2 className="text-xl font-bold mb-4">Eventos</h2>
      {eventos.length === 0 ? (
        <p>No hay eventos disponibles</p>
      ) : (
        eventos.map((ev, idx) => (
          <div key={idx} className="bg-gray-100 p-3 rounded mb-3 shadow">
            <p className="font-semibold">{ev.title}</p>
            <p className="text-sm">
              {format(ev.start, 'hh:mm a')} - {format(ev.end, 'hh:mm a')}
            </p>
            <p className="text-xs text-gray-500">{format(ev.start, 'MMM dd, yyyy')}</p>
          </div>
        ))
      )}
    </div>
  )
}

export default Disponibilidad