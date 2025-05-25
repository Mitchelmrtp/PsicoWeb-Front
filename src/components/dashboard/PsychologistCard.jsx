import { useNavigate } from 'react-router-dom';

const PsychologistCard = ({ psychologist }) => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img 
            src={psychologist.image} 
            alt={psychologist.name} 
            className="h-16 w-16 rounded-full mr-4 object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${psychologist.name}&background=random`;
            }}
          />
          <div>
            <h3 className="font-bold text-lg">{psychologist.name}</h3>
            <p className="text-sm text-gray-600">
              Especialista | {psychologist.experience}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <span className="inline-block bg-blue-50 text-blue-500 px-3 py-1 text-xs rounded-full">
            {psychologist.specialty}
          </span>
        </div>
        
        <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <div className="text-sm text-gray-600">{psychologist.availability}</div>
              <div className="text-xs text-gray-500">{psychologist.availabilityHours}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-indigo-800 font-bold">${psychologist.price}</div>
            <div className="text-xs text-gray-500">Starting</div>
          </div>
        </div>
        
        <button 
          className="w-full bg-indigo-800 text-white text-center py-3 rounded-md hover:bg-indigo-900 transition-colors"
          onClick={() => navigate(`/reserva?psychologist=${psychologist.id}`)}
        >
          Reservar una cita
        </button>
      </div>
    </div>
  );
};

export default PsychologistCard;