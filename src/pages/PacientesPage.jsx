import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ENDPOINTS, getAuthHeader } from '../config/api';
import { toast } from 'react-toastify';
import SidebarManager from '../components/dashboard/SidebarManager';
import PatientsList from '../components/dashboard/PatientsList';

const PacientesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch patients from backend
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetching patients from API
        
        const response = await fetch(ENDPOINTS.PSICOLOGO_PACIENTES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(),
          },
        });
        
        if (!response.ok) {
          // Try to read detailed error information
          let errorText;
          try {
            const errorData = await response.json();
            errorText = errorData.message || errorData.error || 'Error desconocido';
            console.error('Backend error details:', errorData);
          } catch (e) {
            errorText = 'Error al cargar los pacientes';
          }
          
          throw new Error(errorText);
        }
        
        const data = await response.json();
        // Processing patient data from backend
        
        // Handle the new Clean Architecture response structure
        const patientsArray = data.data || data;
        
        // Handle empty array case
        if (Array.isArray(patientsArray) && patientsArray.length === 0) {
          // No patients found for this psychologist
        }
        
        // Process patient data
        const processedPatients = Array.isArray(patientsArray) ? patientsArray.map(patient => ({
          id: patient.id,
          first_name: patient.first_name || 'Sin nombre',
          last_name: patient.last_name || 'Sin apellido',
          email: patient.email || 'No email disponible',
          diagnostico: patient.diagnostico || 'Sin diagnóstico registrado',
          lastAppointment: patient.lastAppointment || null
        })) : [];
        
        setPatients(processedPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError(`No se pudieron cargar los pacientes: ${error.message}`);
        toast.error(`Error al cargar los pacientes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, []);

  // Filter patients based on search query
  const filteredPatients = searchQuery 
    ? patients.filter(patient => 
        `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (patient.diagnostico && patient.diagnostico.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : patients;

  return (
    <div className="flex h-screen">
      <SidebarManager />
      
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Mis Pacientes</h1>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 relative">
            <input
              type="text"
              placeholder="Buscar paciente por nombre, email o diagnóstico..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          <PatientsList 
            patients={filteredPatients}
            isLoading={loading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
};

export default PacientesPage;