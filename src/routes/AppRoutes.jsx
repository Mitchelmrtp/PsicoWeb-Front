/* eslint-disable react/prop-types */

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
const ChatPage = lazy(() => import("../pages/ChatPage"));

// Nuevos componentes de informes
const MostrarInformes = lazy(() => import("../components/informes/MostrarInformes"));
const GenerarInforme = lazy(() => import("../components/informes/GenerarInforme"));

// Componentes de objetivos y emociones
const ObjetivosPacienteContainer = lazy(() => import("../components/objetivos/ObjetivosPacienteContainer"));
const MisObjetivosContainer = lazy(() => import("../components/objetivos/MisObjetivosContainer"));
const RegistrarEmocionesPage = lazy(() => import("../pages/RegistrarEmocionesPage"));
const MisEmocionesPage = lazy(() => import("../pages/MisEmocionesPage"));
const GestionEmocionesPage = lazy(() => import("../pages/GestionEmocionesPage"));

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
        <Route path={ROUTE_PATHS.LOGIN} element={<LoginForm />} />
        <Route path={ROUTE_PATHS.REGISTER} element={<RegisterForm />} />
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

        {/* Rutas de informes */}
        <Route
          path={ROUTE_PATHS.GENERAR_INFORME}
          element={
            <ProtectedRoute>
              <GenerarInforme />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.MOSTRAR_INFORME}
          element={
            <ProtectedRoute>
              <MostrarInformes />
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

        {/* Rutas de chat */}
        <Route
          path={ROUTE_PATHS.CHAT}
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.CHAT_DETAIL}
          element={
            <ProtectedRoute>
              <ChatPage />
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
              {user?.role === 'psicologo' ? <TestManagement /> : <TestManagement />}
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.TEST_PAGE}
          element={
            <ProtectedRoute>
              <TestManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.RESULTADO}
          element={
            <ProtectedRoute>
              <TestManagement />
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
          path={ROUTE_PATHS.PERFIL_PSICOLOGO}
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

        {/* Rutas de objetivos y emociones */}
        <Route
          path={ROUTE_PATHS.OBJETIVOS_PACIENTE}
          element={
            <ProtectedRoute>
              <ObjetivosPacienteContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.MIS_OBJETIVOS}
          element={
            <ProtectedRoute>
              <MisObjetivosContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.REGISTRAR_EMOCIONES}
          element={
            <ProtectedRoute>
              <RegistrarEmocionesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.MIS_EMOCIONES}
          element={
            <ProtectedRoute>
              <MisEmocionesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTE_PATHS.GESTION_EMOCIONES}
          element={
            <ProtectedRoute>
              <GestionEmocionesPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
