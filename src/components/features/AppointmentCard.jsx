import { Card, Button } from "../ui";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Componente para mostrar lista de citas con botón de detalles
const AppointmentCard = ({
  appointment,
  onViewDetails,
  showActions = true,
}) => {
  const formatDate = (date) => {
    const day = date
      .toLocaleDateString("es-ES", { weekday: "short" })
      .replace(".", "");
    return {
      weekday: day.charAt(0).toUpperCase() + day.slice(1),
      day: date.getDate(),
    };
  };

  const formatTimeRange = (start, end) => {
    const startTime = format(start, "HH:mm", { locale: es });
    const endTime = format(end, "HH:mm", { locale: es });
    return `${startTime} - ${endTime}`;
  };

  const dateInfo = formatDate(appointment.date);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-50 rounded-lg">
            <span className="text-xs text-gray-500 uppercase">
              {dateInfo.weekday}
            </span>
            <span className="text-xl font-bold">{dateInfo.day}</span>
          </div>

          <div className="ml-4">
            <div className="flex items-center space-x-2">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <h3 className="font-semibold text-gray-900">
                {appointment.patient || appointment.doctor}
              </h3>
            </div>
            <p className="text-sm text-gray-500">
              {formatTimeRange(appointment.date, appointment.endTime)}
            </p>
          </div>
        </div>

        {showActions && (
          <div className="flex space-x-2">
            <button
              onClick={() => onViewDetails?.(appointment)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              Ver Detalles
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AppointmentCard;
