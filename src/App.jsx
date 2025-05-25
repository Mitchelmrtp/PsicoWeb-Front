import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import { LoginForm } from "./components/auth/Login";
import { RegisterForm } from "./components/auth/Register";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { PagPrincipal } from "./pages/PagPrincipal";
import { Form } from "./components/auth/Form";
import { CrearPruebas} from "./components/auth/CrearPruebas";
import TestsMenu from "./components/auth/TestMenu";
import TestForm from "./components/auth/TestForm";
import ResetPassword from "./components/auth/ResetPassword";
import ReservaCita from "./components/auth/reservaCita";
import Disponibilidad from "./components/auth/Disponibilidad";
import MainPage from "./pages/mainpage.jsx";
import DashboardContainer from "./components/dashboard/DashboardContainer";

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
        <Route
          path="/"
          element={<MainPage />}
        />
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
          path="/PagPrincipal"
          element={
            <ProtectedRoute>
              <PagPrincipal />
            </ProtectedRoute>
          }
        />
        <Route path="/Form" element={<Form />} />
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
              <TestsMenu />
            </ProtectedRoute>
          } 
        />
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
