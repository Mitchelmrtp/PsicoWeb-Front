import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Header } from '../components/layout';


const MainPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [psychologists, setPsychologists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  
  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        
        const mockData = [
          {
            id: 1,
            name: 'Amanda Clara',
            specialty: 'Psicología Infantil',
            experience: '12 años de experiencia',
            availability: { days: ['Mar', 'Jue'], hours: '10:00 AM-01:00 PM' },
            price: '$25',
            imageUrl: '/assets/psychologist1.jpg',
            tag: 'Psicología Infantil'
          },
          {
            id: 2,
            name: 'Jason Shatsky',
            specialty: 'Psicología Clínica',
            experience: '7 años de experiencia',
            availability: { days: ['Miér', 'Jue'], hours: '10:00 AM-01:00 PM' },
            price: '$35',
            imageUrl: '/assets/psychologist2.jpg',
            tag: 'Psicología Clínica'
          },
          {
            id: 3,
            name: 'Jessie Dux',
            specialty: 'Psicólogo educativo',
            experience: '5 años de experiencia',
            availability: { days: ['Sáb', 'Dom'], hours: '10:00 AM-01:00 PM' },
            price: '$15',
            imageUrl: '/assets/psychologist3.jpg',
            tag: 'Psicólogo educativo'
          }
        ];
        
        setPsychologists(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching psychologists:', error);
        setLoading(false);
      }
    };
    
    fetchPsychologists();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?term=${searchTerm}&location=${location}`);
  };

  const goToSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="relative bg-gray-100">
        <div className="container mx-auto px-6 pt-16 md:pt-24 pb-0 relative">
          <div className="max-w-9x1">
            <div className="rounded-3xl bg-gradient-to-r from-blue-200 via-blue-300 to-indigo-200 px-8 py-10 md:py-14 md:px-10 shadow-md relative">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 drop-shadow">
                No necesitas ir al consultorio
              </h1>
              <h2 className="text-2xl md:text-3xl font-medium text-white mb-4 drop-shadow">
                Recibe tu apoyo psicológico en línea
              </h2>
              <p className="text-lg text-blue-100 mb-6">
                Llamada / mensaje / videollamada
              </p>
              <div className="flex items-center mb-2">
                <div className="flex -space-x-2 mr-3">
                  <img src="/assets/avatar1.jpg" alt="Especialista" className="w-9 h-9 rounded-full border-2 border-white" />
                  <img src="/assets/avatar2.jpg" alt="Especialista" className="w-9 h-9 rounded-full border-2 border-white" />
                  <img src="/assets/avatar3.jpg" alt="Especialista" className="w-9 h-9 rounded-full border-2 border-white" />
                </div>
                <span className="text-white text-base font-medium">+180 Especialistas en Línea</span>
              </div>
            </div>
          </div>
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[85%] w-full max-w-2xl z-20">
            <form
              onSubmit={handleSearch}
              className="bg-white rounded-2xl shadow-xl flex flex-row items-center px-4 py-2 gap-2"
              style={{ border: '1.5px solid #E5E7EB' }}
            >
              <div className="flex items-center flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar Psicólogos"
                  className="ml-2 w-full border-0 focus:ring-0 focus:outline-none text-gray-700 bg-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />
              <div className="flex items-center flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  placeholder="Location"
                  className="ml-2 w-full border-0 focus:ring-0 focus:outline-none text-gray-700 bg-transparent"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="h-6 w-px bg-gray-200 mx-2 hidden md:block" />
              <button
                type="button"
                className="p-2 rounded-full hover:bg-gray-100 transition"
                tabIndex={-1}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
              </button>
              <button
                type="submit"
                className="bg-[#384C7C] text-white px-8 py-2 rounded-lg font-medium ml-2 shadow hover:bg-[#2c3a5c] transition"
              >
                Buscar
              </button>
            </form>
          </div>
          <div className="hidden md:block absolute right-0 top-0 h-full w-1/3">
            <img 
              src="/assets/psychologist.webp" 
              alt="Psychologists" 
              className="h-full w-full object-cover object-center rounded-r-3xl" 
            />
          </div>
        </div>
      </section>

      <div className="flex justify-center py-4">
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 w-2 rounded-full ${index === activeSlide ? 'bg-indigo-800' : 'bg-gray-300'}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <section className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Psicólogos Recomendados</h2>
          <Link to="/psicologos" className="text-indigo-800 hover:underline flex items-center">
            Ver Todo
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-800"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {psychologists.map((psych) => (
              <div key={psych.id} className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <img 
                      src={psych.imageUrl} 
                      alt={psych.name} 
                      className="h-16 w-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-lg">{psych.name}</h3>
                      <p className="text-sm text-gray-600">Especialista | {psych.experience.split(" ")[0]} {psych.experience.split(" ")[1]} de experiencia</p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <span className="inline-block bg-blue-50 text-blue-500 px-3 py-1 text-xs rounded-full">
                      {psych.tag}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-b border-gray-100 py-4 mb-4">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <div>
                        <div className="text-sm text-gray-600">{psych.availability.days.join(' y ')}</div>
                        <div className="text-xs text-gray-500">{psych.availability.hours}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-indigo-800 font-bold">{psych.price}</div>
                      <div className="text-xs text-gray-500">Starting</div>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full bg-indigo-800 text-white text-center py-3 rounded-md hover:bg-indigo-900"
                    onClick={() => navigate(`/reserva?psychologist=${psych.id}`)}
                  >
                    Reservar una cita
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MainPage;