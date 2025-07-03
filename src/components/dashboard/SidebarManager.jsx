import { useAuth } from '../../hooks/useAuth';
import NavigationSidebar from '../layout/NavigationSidebar';

// DEPRECATED: Este componente será reemplazado por NavigationSidebar
// Mantenido temporalmente para compatibilidad
const SidebarManager = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Usar el nuevo NavigationSidebar que es adaptativo por rol
  return <NavigationSidebar />;
};

export default SidebarManager;