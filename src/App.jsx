import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/auth/Login';
import { RegisterForm } from './components/auth/Register';

// Componente protegido para páginas que requieren autenticación
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
};

// Componente de dashboard (placeholder)
const Dashboard = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Bienvenido, {user.username}</h1>
      <p className="mb-4">Has iniciado sesión correctamente.</p>
      <button 
        onClick={logout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Cerrar sesión
      </button>
    </div>
  );
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginForm />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterForm />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

function App() {
  return <AppWithAuth />;
}

export default App;