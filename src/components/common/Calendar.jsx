import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import { format, parse, startOfWeek as startOfWeekFn, getDay } from 'date-fns'
import es from 'date-fns/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './CalendarCustom.css' 

const locales = { es }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date) => startOfWeekFn(date, { locale: es }),
  getDay,
  locales,
})

export default function MyCalendar({ events }) {
  return (
    <div className="calendar-container mx-auto max-w-[480px] p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={['month']}
        style={{ height: 600 }}
        dayLayoutAlgorithm="no-overlap"
        eventPropGetter={() => ({
          style: {
            backgroundColor: '#0399b8',
            borderRadius: '8px',
            color: 'black',
            padding: '4px 8px',
            fontSize: '0.85rem',
            marginBottom: '4px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            cursor: 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          },
        })}
      />
    </div>
  )
}
