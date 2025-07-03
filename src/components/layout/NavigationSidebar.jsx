import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { NAVIGATION_ROUTES } from '../../routes/routePaths';
import { Button } from '../ui';

// Iconos como componentes para mejor organización
const Icons = {
  dashboard: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 14a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  calendar: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  test: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  consultation: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  patients: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  availability: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  online: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  ),
  profile: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  help: (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// Componente de navegación mejorado
const NavigationSidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Determinar las rutas de navegación según el rol del usuario
  const navigationItems = user.role === 'psicologo' 
    ? NAVIGATION_ROUTES.PSYCHOLOGIST 
    : NAVIGATION_ROUTES.PATIENT;

  return (
    <div className="w-full max-w-[220px] h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center">
          <img
            src="/assets/logo-blue.png"
            alt="PsicoWeb Logo"
            className="h-8"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="ml-2 text-xl font-bold text-indigo-900">
            PsicoWeb
          </span>
        </Link>
      </div>

      {/* Navegación principal */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`
                    flex items-center px-4 py-3 rounded-md text-gray-700 
                    hover:bg-indigo-50 hover:text-indigo-800 transition-colors
                    ${isActive ? 'bg-indigo-50 text-indigo-800' : ''}
                  `}
                >
                  {Icons[item.icon] || Icons.dashboard}
                  <span className="ml-3">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer con información del usuario y logout */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-3">
          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-800 font-semibold text-sm">
              {user.name?.charAt(0) || user.first_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-900">
              {user.name || user.first_name || 'Usuario'}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user.role}
            </p>
          </div>
        </div>
        
        <Button
          onClick={logout}
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-700 hover:text-red-600"
        >
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};

export default NavigationSidebar;
