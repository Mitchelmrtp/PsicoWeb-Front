import { Card, LoadingSpinner } from "../ui";
import AppointmentCard from "./AppointmentCard";

// Componente que agrupa funcionalidad de lista de citas
const AppointmentList = ({
  appointments = [],
  loading = false,
  error = null,
  title = "Citas",
  emptyMessage = "No hay citas programadas",
  onViewDetails,
  showViewAll = false,
  onViewAll,
}) => {
  // Agrupar citas por mes para mejor organización
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const month = appointment.date.toLocaleDateString("es-ES", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(appointment);
    return acc;
  }, {});

  if (loading) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>{title}</Card.Title>
        </Card.Header>
        <Card.Content>
          <LoadingSpinner />
        </Card.Content>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <Card.Header>
          <Card.Title>{title}</Card.Title>
        </Card.Header>
        <Card.Content>
          <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
            {error}. Por favor intente de nuevo más tarde.
          </div>
        </Card.Content>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex justify-between items-center">
          <Card.Title>{title}</Card.Title>
          {showViewAll && appointments.length > 0 && (
            <button
              onClick={onViewAll}
              className="text-blue-600 hover:underline flex items-center text-sm"
            >
              Ver Todo
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}
        </div>
      </Card.Header>

      <Card.Content>
        {appointments.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-500">{emptyMessage}</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedAppointments).map(
              ([month, appointmentsInMonth]) => (
                <div key={month}>
                  <h4 className="text-gray-500 font-medium mb-3 capitalize">
                    {month}
                  </h4>
                  <div className="space-y-3">
                    {appointmentsInMonth.map((appointment) => (
                      <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onViewDetails={onViewDetails}
                      />
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </Card.Content>
    </Card>
  );
};

export default AppointmentList;
