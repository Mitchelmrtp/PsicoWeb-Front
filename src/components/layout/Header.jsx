import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user } = useAuth();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold text-indigo-800">
            <img src="/assets/logo-blue.png" alt="PsycoWeb Logo" className="h-8 mr-2 inline" />
            PsycoWeb
          </Link>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/testmenu" className="text-gray-600 hover:text-indigo-800">Test</Link>
          {user ? (
            <Link to="/PagPrincipal" className="text-gray-600 hover:text-indigo-800">Mi Cuenta</Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-indigo-800">Login</Link>
              <Link to="/register" className="bg-indigo-800 text-white px-6 py-2 rounded-md hover:bg-indigo-900">
                Registrarse
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;