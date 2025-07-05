import { useEffect, useMemo } from 'react';
import { useAuthStore } from '../store/authStore.jsx';

// Hook mejorado con mejor gestión de estado y validación automática de tokens
export const useAuth = () => {
  const authStore = useAuthStore();

  // Verificar estado de autenticación al montar el componente solo una vez
  useEffect(() => {
    // Verificamos que no se llame más de lo necesario
    const lastCheck = localStorage.getItem('lastAuthCheck');
    const now = Date.now();
    
    // Solo verificamos si han pasado más de 5 segundos desde la última verificación
    // para evitar múltiples llamadas en componentes que se montan casi al mismo tiempo
    if (!lastCheck || now - parseInt(lastCheck) > 5000) {
      localStorage.setItem('lastAuthCheck', now.toString());
      authStore.checkAuthState();
    }
  }, []); // Dependencias vacías para ejecutar solo al montar

  // Usamos useMemo para evitar crear un nuevo objeto usuario en cada render
  // solo si las propiedades relevantes cambian
  const normalizedUser = useMemo(() => {
    if (!authStore.user) return null;
    
    // Normalizar campos críticos
    const user = {
      ...authStore.user,
      userId: authStore.user.id || authStore.user.userId,
      id: authStore.user.id || authStore.user.userId,
      // Normalizar el campo de rol
      rol: authStore.user.rol || authStore.user.role,
      role: authStore.user.rol || authStore.user.role
    };
    
    return user;
  }, [authStore.user?.id, authStore.user?.role, authStore.user?.rol, authStore.user?.email]);

  return {
    ...authStore,
    user: normalizedUser,
  };
};