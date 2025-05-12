import { createContext, useState, useCallback, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(authService.getStoredUser());
    const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());

    const login = useCallback(async (credentials) => {
        try {
            const result = await authService.login(credentials);
            setUser(result.user);
            setIsAuthenticated(true);
            return result;
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            throw err;
        }
    }, []);

    const register = useCallback(async (userData) => {
        try {
            const result = await authService.register(userData);
            setUser(result.user);
            setIsAuthenticated(true);
            return result;
        } catch (err) {
            setUser(null);
            setIsAuthenticated(false);
            throw err;
        }
    }, []);

    const logout = useCallback(() => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    }, []);

    // Verificar el estado de autenticación al cargar
    useEffect(() => {
        const storedUser = authService.getStoredUser();
        const isAuth = authService.isAuthenticated();
        setUser(storedUser);
        setIsAuthenticated(isAuth);
    }, []);

    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            login, 
            register, 
            logout 
        }}>
            {children}
        </AuthContext.Provider>
    );
};