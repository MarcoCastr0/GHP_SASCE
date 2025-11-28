// src/services/authService.js
import { apiClient } from './api';

export const authService = {
  async login(credentials) {
    try {
      console.log('authService.login - Datos a enviar:', {
        correo: credentials.correo,
        password: credentials.password
      });

      // POST /api/auth/login
      const response = await apiClient.post('/auth/login', {
        correo: credentials.correo,
        password: credentials.password
      });

      console.log('authService.login - Respuesta recibida:', response);
      
      // Guardar token y usuario
      if (response.success && response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return response.user;
      }
      
      throw new Error('Respuesta de login inválida');
    } catch (error) {
      console.error('authService.login - Error:', error);
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  },

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('accessToken');
  },

  isAuthenticated() {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.id_rol === 1;
  },
};
