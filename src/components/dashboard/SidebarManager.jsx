import { useAuth } from '../../hooks/useAuth';
import Sidebar from './Sidebar';
import PsicologoSidebar from './PsicologoSidebar';

const SidebarManager = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Return the appropriate sidebar based on user role
  if (user.role === 'psicologo') {
    return <PsicologoSidebar />;
  } else {
    return <Sidebar />;
  }
};

export default SidebarManager;