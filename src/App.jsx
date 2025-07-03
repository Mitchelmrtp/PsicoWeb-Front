import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/auth/Login";
import { RegisterForm } from "./components/auth/Register";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { CrearPruebas } from "./components/test/CrearPruebas.jsx";
import ResetPassword from "./components/auth/ResetPassword";
import ReservaCita from "./components/sesion/ReservaCita.jsx";
import Disponibilidad from "./components/Calendario/Disponibilidad.jsx";
import MainPage from "./pages/mainpage.jsx";
import DashboardContainer from "./components/dashboard/DashboardContainer";
import PerfilPsicologo from "./components/auth/PerfilPsicologo.jsx";
import PerfilPaciente from "./components/auth/PerfilPaciente.jsx";
import MisConsultas from "./pages/MisConsultas";
import PacientesPage from "./pages/PacientesPage";
import TestManagement from "./components/test/TestManagement";
import PatientTestView from "./components/test/PatientTestView";
import TestPage from "./components/test/TestPage";
import TestResultDetail from "./components/test/TestResultDetail";

// Componente protegido para páginas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Wrapper para proveer el contexto de autenticación
const AppWithAuth = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

// Contenido de la aplicación que usa el contexto de autenticación
const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginForm />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/dashboard" /> : <RegisterForm />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/reserva"
          element={
            <ProtectedRoute>
              <ReservaCita />
            </ProtectedRoute>
          }
        />
        <Route
          path="/disponibilidad"
          element={
            <ProtectedRoute>
              <Disponibilidad />
            </ProtectedRoute>
          }
        />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/CrearPruebas"
          element={
            <ProtectedRoute>
              <CrearPruebas />
            </ProtectedRoute>
          }
        />
        <Route path="/mainpage" element={<MainPage />} />
        <Route
          path="/testmenu"
          element={
            <ProtectedRoute>
              {user?.role === 'psicologo' ? <TestManagement /> : <PatientTestView />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/:testId"
          element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resultado/:resultId"
          element={
            <ProtectedRoute>
              <TestResultDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/EditarPrueba/:testId"
          element={
            <ProtectedRoute>
              <CrearPruebas />
            </ProtectedRoute>
          }
        />
        <Route
          path="perfil_paciente/:id"
          element={
            <ProtectedRoute>
              <PerfilPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="perfil_psicologo"
          element={
            <ProtectedRoute>
              <PerfilPsicologo />
            </ProtectedRoute>
          }
        />
        <Route
          path="/consultas"
          element={
            <ProtectedRoute>
              <MisConsultas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pacientes"
          element={
            <ProtectedRoute>
              <PacientesPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/help"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Centro de Ayuda</h2>
                  <p className="text-gray-600 mb-4">
                    Bienvenido al centro de ayuda de PsicoWeb. Aquí encontrarás recursos para usar la plataforma.
                  </p>
                  <div className="space-y-2">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h3 className="font-semibold text-blue-900">Para Pacientes</h3>
                      <p className="text-blue-700 text-sm">Cómo reservar citas y acceder a recursos</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h3 className="font-semibold text-green-900">Para Psicólogos</h3>
                      <p className="text-green-700 text-sm">Gestión de pacientes y herramientas profesionales</p>
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/calendario"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Calendario</h2>
                  <p className="text-gray-600 mb-4">
                    Gestión de citas y disponibilidad.
                  </p>
                  <p className="text-sm text-gray-500">
                    Esta funcionalidad está en desarrollo.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/consultas-online"
          element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultas Online</h2>
                  <p className="text-gray-600 mb-4">
                    Acceso a consultas virtuales y sesiones en línea.
                  </p>
                  <p className="text-sm text-gray-500">
                    Esta funcionalidad está en desarrollo.
                  </p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route 
          path="/perfil_paciente"
          element={
            <ProtectedRoute>
              <PerfilPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil-paciente"
          element={
            <ProtectedRoute>
              <PerfilPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil-psicologo"
          element={
            <ProtectedRoute>
              <PerfilPsicologo />
            </ProtectedRoute>
          }
        />
        <Route path="/tests/:testId/preguntas/:preguntaId/opciones" element={
          <ProtectedRoute>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <>
      <AppWithAuth />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
