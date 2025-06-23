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
import GenerarInforme from "./components/sesion/GenerarInforme.jsx";
import Disponibilidad from "./components/Calendario/Disponibilidad.jsx";
import MainPage from "./pages/mainpage.jsx";
import DashboardContainer from "./components/dashboard/DashboardContainer";
import PerfilPsicologo from "./components/auth/ProfilePsico.jsx";
import PerfilPaciente from "./components/auth/ProfileUser.jsx";
import MisConsultas from "./pages/MisConsultas";
import PacientesPage from "./pages/PacientesPage";
import TestManagement from "./components/test/TestManagement";
import PatientTestView from "./components/test/PatientTestView";
import TestPage from "./components/test/TestPage";
import TestResultDetail from "./components/test/TestResultDetail";
import EditarPerfil from "./pages/EditarPerfil"; 

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
          path="/ginforme"
          element={
            <ProtectedRoute>
              <GenerarInforme />
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
              user ? <Navigate to="/dashboard" /> :<PerfilPaciente />
          }
        />
        <Route
          path="perfil_psicologo"
          element={
              user ? <Navigate to="/dashboard" /> :<PerfilPsicologo />
          }
        />
        <Route
          path="/editarperfil"
          element={
            <ProtectedRoute>
              <EditarPerfil userData={useAuth().user} />
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
