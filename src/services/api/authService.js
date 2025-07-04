/**
 * Servicio para manejo de autenticación y perfiles de usuario
 * Implementa Single Responsibility Principle
 */
import BaseApiService from './baseApi';
import { ENDPOINTS } from '../../config/api';

class AuthService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.BASE_URL);
  }

  // Autenticación
  async login(credentials) {
    const response = await this.post('/login', credentials);
    // The backend returns the data directly, not wrapped in a data property
    if (response.data?.token) {
      this.setAuthToken(response.data.token);
      if (response.data?.user) {
        this.setStoredUser(response.data.user);
      }
    }
    return response;
  }

  async register(userData) {
    return this.post('/register', userData);
  }

  async logout() {
    this.clearAuthToken();
    this.setStoredUser(null);
    // Si hay endpoint de logout en el backend, llamarlo aquí
    // return this.post('/logout');
  }

  // Gestión de contraseñas
  async forgotPassword(email) {
    return this.post('/forgot-password', { email });
  }

  async resetPassword(token, newPassword) {
    return this.post('/reset-password', { token, newPassword });
  }

  // Gestión de tokens
  setAuthToken(token) {
    localStorage.setItem('token', token);
  }

  getAuthToken() {
    return localStorage.getItem('token');
  }

  clearAuthToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Gestión de usuario almacenado
  getStoredUser() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return null;
      
      const user = JSON.parse(userStr);
      
      // Normalizar el campo de rol para asegurar consistencia
      if (user && (user.rol || user.role)) {
        user.rol = user.rol || user.role;
        user.role = user.rol || user.role;
      }
      
      console.log('authService - Usuario almacenado recuperado:', user);
      return user;
    } catch (error) {
      console.error('Error parsing stored user:', error);
      return null;
    }
  }

  setStoredUser(user) {
    if (user) {
      // Normalizar el campo de rol para asegurar consistencia
      if (user.rol || user.role) {
        user.rol = user.rol || user.role;
        user.role = user.rol || user.role;
      }
      
      console.log('authService - Guardando usuario normalizado:', user);
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  // Verificar estado de autenticación con datos del usuario
  checkAuthState() {
    const token = this.getAuthToken();
    const user = this.getStoredUser();
    return {
      isAuthenticated: this.isAuthenticated(),
      user,
      token
    };
  }
}

class ProfileService extends BaseApiService {
  constructor() {
    super(ENDPOINTS.BASE_URL);
  }

  // Perfiles de psicólogo
  async getPsychologistProfile() {
    return this.get('/psicologo/profile');
  }

  async updatePsychologistProfile(profileData) {
    return this.put('/psicologo/profile', profileData);
  }

  // Perfiles de paciente
  async getPatientProfile() {
    return this.get('/paciente/profile');
  }

  async updatePatientProfile(profileData) {
    return this.put('/paciente/profile', profileData);
  }

  // Perfil genérico
  async getProfile() {
    return this.get('/profile');
  }

  async updateProfile(profileData) {
    return this.put('/profile', profileData);
  }
}

export { AuthService, ProfileService };
