import { createContext, useContext, useReducer, useCallback } from 'react';
import authService from '../services/authService';

// Action types siguiendo el patrón Redux
const AUTH_ACTIONS = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  REGISTER_START: 'REGISTER_START',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAILURE: 'REGISTER_FAILURE',
  LOGOUT: 'LOGOUT',
  SET_USER: 'SET_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Estado inicial
const initialState = {
  user: authService.getStoredUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
};

// Reducer para manejar estado de autenticación
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload.error,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: !!action.payload.user,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Context
const AuthStoreContext = createContext(null);

// Provider component
export const AuthStoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Acciones
  const login = useCallback(async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });
    try {
      const result = await authService.login(credentials);
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: { user: result.user } 
      });
      return result;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_FAILURE, 
        payload: { error: error.message } 
      });
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });
    try {
      const result = await authService.register(userData);
      dispatch({ 
        type: AUTH_ACTIONS.REGISTER_SUCCESS, 
        payload: { user: result.user } 
      });
      return result;
    } catch (error) {
      dispatch({ 
        type: AUTH_ACTIONS.REGISTER_FAILURE, 
        payload: { error: error.message } 
      });
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const setUser = useCallback((user) => {
    if (!user) {
      dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user: null } });
      return;
    }
    
    // Verificamos si el usuario ya existe y es el mismo para evitar re-renders innecesarios
    if (state.user && 
        state.user.id === user.id && 
        state.user.role === user.role &&
        state.user.email === user.email) {
      // No actualizamos si es el mismo usuario con los mismos datos esenciales
      return;
    }
    
    // Sólo enviamos la acción si hay cambios reales
    dispatch({ type: AUTH_ACTIONS.SET_USER, payload: { user } });
  }, [state.user]);

  // Verificar token al inicializar
  const checkAuthState = useCallback(() => {
    const storedUser = authService.getStoredUser();
    const isAuth = authService.isAuthenticated();
    
    // Usamos una comparación más estricta para evitar actualizaciones innecesarias
    if (storedUser && isAuth) {
      if (!state.user || state.user.id !== storedUser.id || state.user.role !== storedUser.role) {
        // Solo actualizamos si no hay usuario o si hay cambios en propiedades críticas
        setUser(storedUser);
      }
    } else if (!isAuth && state.isAuthenticated) {
      // Si no hay autenticación pero el estado dice que sí, cerramos sesión
      logout();
    }
  }, [state.user, state.isAuthenticated, setUser, logout]);

  const value = {
    // Estado
    ...state,
    
    // Acciones
    login,
    register,
    logout,
    clearError,
    setUser,
    checkAuthState,
  };

  return (
    <AuthStoreContext.Provider value={value}>
      {children}
    </AuthStoreContext.Provider>
  );
};

// Hook personalizado para usar el store
export const useAuthStore = () => {
  const context = useContext(AuthStoreContext);
  if (context === undefined) {
    throw new Error('useAuthStore must be used within an AuthStoreProvider');
  }
  return context;
};
