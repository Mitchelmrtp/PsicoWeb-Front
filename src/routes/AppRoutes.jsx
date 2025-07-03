import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTE_PATHS } from "./routePaths";

// Lazy loading de componentes para mejor rendimiento
import { lazy, Suspense } from "react";

// Componentes base
import { LoginForm } from "../components/auth/Login";
import { RegisterForm } from "../components/auth/Register";
import { ForgotPassword } from "../components/auth/ForgotPassword";
import ResetPassword from "../components/auth/ResetPassword";
import MainPage from "../pages/mainpage.jsx";
import SearchPage from "../pages/SearchPage.jsx";
import DashboardContainer from "../components/dashboard/DashboardContainer";

// Lazy loading de páginas
const ReservaCita = lazy(() => import("../components/sesion/ReservaCita.jsx"));
const Disponibilidad = lazy(() => import("../components/Calendario/Disponibilidad.jsx"));
const CrearPruebas = lazy(() => import("../components/test/CrearPruebas.jsx"));
const PerfilPsicologo = lazy(() => import("../components/auth/PerfilPsicologo.jsx"));
const PerfilPaciente = lazy(() => import("../components/auth/PerfilPaciente.jsx"));
const MisConsultas = lazy(() => import("../pages/MisConsultas"));
const PacientesPage = lazy(() => import("../pages/PacientesPage"));
const TestManagement = lazy(() => import("../components/test/TestManagement"));
// Nuevos componentes refactorizados con Container/Presenter pattern
const PatientTestViewContainer = lazy(() => import("../components/test/PatientTestViewContainer"));
const TestPageContainer = lazy(() => import("../components/test/TestPageContainer"));
const TestResultDetailContainer = lazy(() => import("../components/test/TestResultDetailContainer"));

// Componente de carga
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Componente protegido reutilizable
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to={ROUTE_PATHS.LOGIN} />;
  return children;
};

// Componente para rutas públicas (solo usuarios no autenticados)
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  if (user) return <Navigate to={ROUTE_PATHS.DASHBOARD} />;
  return children;
};

// Placeholder para funcionalidades en desarrollo
const ComingSoonPage = ({ title, description }) => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <p className="text-sm text-gray-500">
        Esta funcionalidad está en desarrollo.
      </p>
    </div>
  </div>
);

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Rutas públicas */}
        <Route path={ROUTE_PATHS.HOME} element={<MainPage />} />
        <Route path={ROUTE_PATHS.MAIN_PAGE} element={<MainPage />} />
        <Route path={ROUTE_PATHS.SEARCH} element={<SearchPage />} />
        
        {/* Rutas de autenticación */}
        <Route
          path={ROUTE_PATHS.LOGIN}
          element={
            <PublicRoute>
              <LoginForm />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.REGISTER}
          element={
            <PublicRoute>
              <RegisterForm />
            </PublicRoute>
          }
        />
        <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPassword />} />
        <Route path={ROUTE_PATHS.RESET_PASSWORD} element={<ResetPassword />} />

        {/* Dashboard principal */}
        <Route
          path={ROUTE_PATHS.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardContainer />
            </ProtectedRoute>
          }
        />

        {/* Rutas de reservas y disponibilidad */}
        <Route
          path={ROUTE_PATHS.RESERVA}
          element={
            <ProtectedRoute>
              <ReservaCita />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.DISPONIBILIDAD}
          element={
            <ProtectedRoute>
              <Disponibilidad />
            </ProtectedRoute>
          }
        />

        {/* Rutas de pruebas psicológicas */}
        <Route
          path={ROUTE_PATHS.CREAR_PRUEBAS}
          element={
            <ProtectedRoute>
              <CrearPruebas />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.EDITAR_PRUEBA}
          element={
            <ProtectedRoute>
              <CrearPruebas />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.TEST_MENU}
          element={
            <ProtectedRoute>
              {user?.role === 'psicologo' ? <TestManagement /> : <PatientTestViewContainer />}
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.TEST_PAGE}
          element={
            <ProtectedRoute>
              <TestPageContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.RESULTADO}
          element={
            <ProtectedRoute>
              <TestResultDetailContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.RESULTADO_PLURAL}
          element={
            <ProtectedRoute>
              <TestResultDetailContainer />
            </ProtectedRoute>
          }
        />

        {/* Rutas de perfiles */}
        <Route
          path={ROUTE_PATHS.PERFIL_PACIENTE}
          element={
            <ProtectedRoute>
              <PerfilPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.PERFIL_PACIENTE_ALT}
          element={
            <ProtectedRoute>
              <PerfilPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.PERFIL_PACIENTE_ID}
          element={
            <ProtectedRoute>
              <PerfilPaciente />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.PERFIL_PSICOLOGO}
          element={
            <ProtectedRoute>
              <PerfilPsicologo />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.PERFIL_PSICOLOGO_ALT}
          element={
            <ProtectedRoute>
              <PerfilPsicologo />
            </ProtectedRoute>
          }
        />

        {/* Rutas de consultas y pacientes */}
        <Route
          path={ROUTE_PATHS.CONSULTAS}
          element={
            <ProtectedRoute>
              <MisConsultas />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.PACIENTES}
          element={
            <ProtectedRoute>
              <PacientesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.PACIENTE_DETAIL}
          element={
            <ProtectedRoute>
              <PerfilPaciente />
            </ProtectedRoute>
          }
        />

        {/* Rutas en desarrollo */}
        <Route 
          path={ROUTE_PATHS.HELP}
          element={
            <ProtectedRoute>
              <ComingSoonPage 
                title="Centro de Ayuda"
                description="Bienvenido al centro de ayuda de PsicoWeb. Aquí encontrarás recursos para usar la plataforma."
              />
            </ProtectedRoute>
          }
        />
        <Route 
          path={ROUTE_PATHS.CALENDARIO}
          element={
            <ProtectedRoute>
              <ComingSoonPage 
                title="Calendario"
                description="Gestión de citas y disponibilidad."
              />
            </ProtectedRoute>
          }
        />
        <Route 
          path={ROUTE_PATHS.CONSULTAS_ONLINE}
          element={
            <ProtectedRoute>
              <ComingSoonPage 
                title="Consultas Online"
                description="Acceso a consultas virtuales y sesiones en línea."
              />
            </ProtectedRoute>
          }
        />

        {/* Ruta temporal para compatibilidad */}
        <Route 
          path="/tests/:testId/preguntas/:preguntaId/opciones" 
          element={
            <ProtectedRoute>
              <ComingSoonPage 
                title="Configuración de Opciones"
                description="Gestión de opciones de preguntas de pruebas."
              />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
