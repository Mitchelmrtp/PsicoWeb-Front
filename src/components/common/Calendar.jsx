import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  setHours,
  setMinutes,
} from "date-fns";
import es from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function MyCalendar({ events, onSelectDate }) {
  const minTime = setHours(setMinutes(new Date(1970, 1, 1), 0), 8);
  const maxTime = setHours(setMinutes(new Date(1970, 1, 1), 0), 20);

  const handleSelectSlot = (slotInfo) => {
    if (onSelectDate) {
      onSelectDate(slotInfo.start);
    }
  };

  return (
    <div className="w-full h-[500px] mt-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={["week", "day"]}
        step={60}
        timeslots={1}
        min={minTime}
        max={maxTime}
        scrollToTime={minTime}
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: "100%" }}
      />
    </div>
  );
}
