import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../common/Button'
import MyCalendar from '../common/Calendar'
import { format } from 'date-fns'

const EventSummary = ({ events }) => {
  return (
    <div className="event-summary p-4 border-l border-gray-200 w-80 overflow-auto h-[600px]">
      <h2 className="text-xl font-bold mb-4">Eventos</h2>
      {events.length === 0 ? (
        <p>No hay eventos disponibles</p>
      ) : (
        events.map((ev, idx) => (
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

export const Disponibilidad = () => {
  const eventos = [
    {
      title: '1',
      start: new Date(2025, 4, 20, 10, 0),
      end: new Date(2025, 4, 20, 11, 0),
    },
    {
      title: '1',
      start: new Date(2025, 4, 23, 12, 0),
      end: new Date(2025, 4, 23, 13, 0),
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
    }
  ]

  const navigate = useNavigate()

  const handlePagPrincipal = (e) => {
    e.preventDefault()
    navigate('/PagPrincipal')
  }

  const handleLogout = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <header className="flex items-center justify-between px-8 py-6">
        <h1 className="text-4xl font-extrabold text-gray-800">DISPONIBILIDAD</h1>
        <Button
          type="submit"
          variant="danger"
          className="auth-btn logout-btn"
          onClick={handleLogout}
        >
          Cerrar Sesión
        </Button>
      </header>

      <div className="flex gap-4 p-4 min-h-[600px]">
        <div className="flex-1">
          <MyCalendar events={eventos} />
        </div>
        <EventSummary events={eventos} />
      </div>

      <div className="px-8 pb-8">
        <Button
          type="submit"
          variant="primary"
          className="auth-btn"
          onClick={handlePagPrincipal}
        >
          Regresar a la Página Principal
        </Button>
      </div>
    </div>
  )
}
