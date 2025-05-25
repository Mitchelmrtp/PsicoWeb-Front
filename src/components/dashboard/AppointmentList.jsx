import { useState } from 'react';

const AppointmentList = ({ appointments, title, showViewAll = true, onViewDetails }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  // Group appointments by month
  const groupedAppointments = appointments.reduce((acc, appointment) => {
    const month = appointment.date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(appointment);
    return acc;
  }, {});
  
  // Format date like "Lun 15"
  const formatDate = (date) => {
    const day = date.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', '');
    return {
      weekday: day.charAt(0).toUpperCase() + day.slice(1),
      day: date.getDate()
    };
  };
  
  // Format time range like "09:00am - 09:30am"
  const formatTimeRange = (start, end) => {
    const startTime = start.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
    
    const endTime = end.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    });
    
    return `${startTime} - ${endTime}`;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        {showViewAll && (
          <a href="/citas" className="text-blue-600 hover:underline flex items-center text-sm">
            Ver Todo
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
      
      {Object.entries(groupedAppointments).map(([month, monthAppointments]) => (
        <div key={month} className="bg-white rounded-lg shadow p-4 mb-4">
          <h4 className="text-gray-500 font-medium mb-2 capitalize">{month}</h4>
          
          {monthAppointments.map((appointment) => (
            <div 
              key={appointment.id}
              className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center">
                <div className="bg-gray-50 rounded-lg h-14 w-14 flex flex-col items-center justify-center mr-4">
                  <span className="text-xs text-gray-500 uppercase">
                    {formatDate(appointment.date).weekday}
                  </span>
                  <span className="text-xl font-bold">
                    {formatDate(appointment.date).day}
                  </span>
                </div>
                
                <div>
                  <h5 className="font-medium">{appointment.doctor || appointment.patient}</h5>
                  <p className="text-sm text-gray-500">
                    {formatTimeRange(appointment.date, appointment.endTime)}
                  </p>
                </div>
              </div>
              
              <button
                className="text-indigo-800 p-2"
                onClick={() => onViewDetails && onViewDetails(appointment)}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;