import { ENDPOINTS } from '../config/api';

class AuthService {
    async login(credentials) {
        try {
            const response = await fetch(ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al iniciar sesión');
            }
            
            // Guardar el token
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await fetch(ENDPOINTS.REGISTER, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el registro');
            }
            
            // Guardar el token
            if (data.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            
            return data;
        } catch (error) {
            console.error('Register error:', error);
            throw error;
        }
    }

    async forgotPassword(email) {
    try {
        const response = await fetch(ENDPOINTS.FORGOT_PASSWORD, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al solicitar recuperación');
        }

            return data;
        } catch (error) {
            console.error('Forgot password error:', error);
            throw error;
        }
    }


    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    getStoredUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }

    getStoredToken() {
        return localStorage.getItem('token');
    }

    isAuthenticated() {
        return !!this.getStoredToken();
    }
}

export default new AuthService();