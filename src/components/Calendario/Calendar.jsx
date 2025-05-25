import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

const MyCalendar = ({ events = [], onSelectDate, onEventClick }) => {
  // Custom event component that displays availability status with clear visual cues
  const EventComponent = ({ event }) => {
    return (
      <div 
        className={`${event.className || ''} text-xs p-1 rounded overflow-hidden transition-all cursor-pointer ${event.isAvailable ? 'hover:bg-green-300' : ''}`}
        onClick={() => event.isAvailable && onEventClick && onEventClick(event)}
      >
        <div className="font-semibold">{event.title}</div>
        {event.isAvailable && (
          <div className="text-xs">
            {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-96 p-1 bg-white rounded-lg border border-gray-200">
      <div className="mb-2 text-xs text-right text-gray-500">
        <span>Haga clic en un horario disponible para seleccionarlo</span>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100% - 20px)' }}
        onSelectSlot={(slotInfo) => {
          onSelectDate(slotInfo.start);
        }}
        onSelectEvent={(event) => {
          if (onEventClick && event.isAvailable) onEventClick(event);
        }}
        selectable
        views={['month', 'week', 'day']}
        defaultView="week"
        components={{
          event: EventComponent
        }}
        messages={{
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay horarios disponibles en este período'
        }}
        eventPropGetter={(event) => {
          let style = {};
          if (event.isAvailable) {
            style = {
              backgroundColor: '#16a34a', // Green for available
              color: 'white',
              borderRadius: '4px'
            };
          }
          return { style };
        }}
        dayPropGetter={(date) => {
          const today = new Date();
          const isPast = date < today && 
            !(date.getDate() === today.getDate() && 
              date.getMonth() === today.getMonth() && 
              date.getFullYear() === today.getFullYear());
          
          if (isPast) {
            return {
              className: 'bg-gray-100',
              style: {
                opacity: 0.6
              }
            };
          }
          return {};
        }}
      />
    </div>
  );
};

export default MyCalendar;
