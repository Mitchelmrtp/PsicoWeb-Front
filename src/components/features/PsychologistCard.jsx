import { Card, Button } from '../ui';
import { useNavigate } from 'react-router-dom';
import { ROUTE_PATHS } from '../../routes/routePaths';

// Componente para mostrar información de psicólogos
const PsychologistCard = ({ psychologist, showBookButton = true }) => {
  const navigate = useNavigate();

  const handleBookAppointment = () => {
    navigate(`${ROUTE_PATHS.RESERVA}?psychologist=${psychologist.id}`);
  };

  return (
    <Card className="h-full">
      <Card.Content>
        <div className="flex items-center mb-4">
          <img 
            src={psychologist.imageUrl || psychologist.image} 
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
              {psychologist.specialty || 'Especialista'} | {psychologist.experience}
            </p>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-gray-600">Disponible</span>
          </div>
          
          {psychologist.availability && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">
                {psychologist.availability.days?.join(', ')}
              </span>
              <span className="text-gray-500">
                {psychologist.availability.hours}
              </span>
            </div>
          )}
        </div>
        
        {psychologist.price && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Desde</span>
            <div className="text-right">
              <p className="font-bold text-indigo-800">{psychologist.price}</p>
              <p className="text-xs text-gray-500">por sesión</p>
            </div>
          </div>
        )}
        
        {showBookButton && (
          <Button
            onClick={handleBookAppointment}
            className="w-full"
          >
            Reservar una cita
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

export default PsychologistCard;
