import React from 'react'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import {
  format,
  parse,
  startOfWeek as startOfWeekFn,
  getDay,
  setHours,
  setMinutes,
} from 'date-fns'
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

export default function MyCalendar({ events, onSelectDate, components = {} }) {
  const minTime = setHours(setMinutes(new Date(1970, 1, 1), 0), 8)
  const maxTime = setHours(setMinutes(new Date(1970, 1, 1), 0), 20)

  const handleSelectSlot = (slotInfo) => {
    if (onSelectDate) {
      onSelectDate(slotInfo.start)
    }
  }

  return (
    <div className="calendar-container mx-auto max-w-[480px] p-4" style={{ height: '600px' }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={['week', 'day']}
        step={60}
        timeslots={1}
        min={minTime}
        max={maxTime}
        scrollToTime={minTime}
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: '100%' }}
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
        components={components}
      />
    </div>
  )
}
