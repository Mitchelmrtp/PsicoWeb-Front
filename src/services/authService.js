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
            
            // Handle the new response structure from Clean Architecture
            const loginData = data.data || data; // Support both old and new structure
            
            // Guardar el token
            if (loginData.token) {
                localStorage.setItem('token', loginData.token);
                localStorage.setItem('user', JSON.stringify(loginData.user));
            }
            
            return {
                token: loginData.token,
                user: loginData.user,
                message: loginData.message || data.message
            };
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
            // Improve error handling to show more details
            if (data.error && Array.isArray(data.error)) {
                // Handle validation errors from Joi
                throw new Error(data.error.map(err => err.message).join(', '));
            }
            throw new Error(data.message || 'Error en el registro');
        }
        
        // Handle the new response structure from Clean Architecture
        const registerData = data.data || data; // Support both old and new structure
        
        // Guardar el token
        if (registerData.token) {
            localStorage.setItem('token', registerData.token);
            localStorage.setItem('user', JSON.stringify(registerData.user));
        }
        
        return {
            token: registerData.token,
            user: registerData.user,
            message: registerData.message || data.message
        };
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