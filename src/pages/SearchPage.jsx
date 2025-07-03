import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Header } from '../components/layout';
import { usePsychologists } from '../hooks/usePsychologists';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [filteredResults, setFilteredResults] = useState([]);
  const { psychologists, loading } = usePsychologists();
  
  const searchTerm = searchParams.get('term') || '';

  useEffect(() => {
    if (!searchTerm || loading) {
      setFilteredResults([]);
      return;
    }

    // Filtrar psicólogos basado en el término de búsqueda
    const filtered = psychologists.filter(psych => {
      const searchLower = searchTerm.toLowerCase();
      return (
        psych.name.toLowerCase().includes(searchLower) ||
        psych.specialty.toLowerCase().includes(searchLower) ||
        psych.experience.toLowerCase().includes(searchLower)
      );
    });

    setFilteredResults(filtered);
  }, [searchTerm, psychologists, loading]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header de búsqueda */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Resultados de búsqueda
            </h1>
            {searchTerm && (
              <p className="text-gray-600">
                Resultados para: <span className="font-semibold">"{searchTerm}"</span>
              </p>
            )}
          </div>

          {/* Resultados */}
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-800"></div>
            </div>
          ) : filteredResults.length > 0 ? (
            <>
              <p className="text-gray-600 mb-6">
                Se encontraron {filteredResults.length} especialista(s)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((psych) => (
                  <div key={psych.id} className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <img 
                          src={psych.imageUrl} 
                          alt={psych.name} 
                          className="h-16 w-16 rounded-full mr-4 object-cover"
                        />
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{psych.name}</h3>
                          <p className="text-sm text-gray-600">
                            {psych.specialty} | {psych.experience.split(" ")[0]} {psych.experience.split(" ")[1]} de experiencia
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 text-xs rounded-full font-medium">
                          {psych.specialty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 mb-4">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <div>
                            <div className="text-sm text-gray-600">
                              {psych.availability.days.length > 0 ? psych.availability.days.join(' y ') : 'Consultar horarios'}
                            </div>
                            <div className="text-xs text-gray-500">{psych.availability.hours}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-indigo-800 font-bold">{psych.price}</div>
                          <div className="text-xs text-gray-500">Starting</div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/reserva?psychologist=${psych.id}`}
                        className="w-full bg-indigo-800 text-white text-center py-3 rounded-md hover:bg-indigo-900 transition-colors block"
                      >
                        Reservar una cita
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : searchTerm ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-600 mb-4">
                  No hay especialistas que coincidan con tu búsqueda "{searchTerm}".
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Ingresa un término de búsqueda
                </h3>
                <p className="text-gray-600 mb-4">
                  Busca especialistas por nombre, especialidad o experiencia.
                </p>
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Volver al inicio
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
