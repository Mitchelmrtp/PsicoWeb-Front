import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROUTE_PATHS } from '../../routes/routePaths';

const Header = () => {
  const { user, logout } = useAuth();

  // Debug temporal para ver la estructura del usuario
  console.log('User object in Header:', user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error durante logout:', error);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to={ROUTE_PATHS.HOME} className="text-2xl font-bold text-indigo-800">
            <img src="/assets/logo-blue.png" alt="PsycoWeb Logo" className="h-8 mr-2 inline" />
            PsycoWeb
          </Link>
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link to={ROUTE_PATHS.TEST_MENU} className="text-gray-600 hover:text-indigo-800">Test</Link>
          {user ? (
            <>
              <Link to={ROUTE_PATHS.DASHBOARD} className="text-gray-600 hover:text-indigo-800">
                {user.nombre || user.name || 'Mi Cuenta'}
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-indigo-800"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTE_PATHS.LOGIN} className="text-gray-600 hover:text-indigo-800">Login</Link>
              <Link to={ROUTE_PATHS.REGISTER} className="bg-indigo-800 text-white px-6 py-2 rounded-md hover:bg-indigo-900">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export { Header };
export default Header;