// src/services/authService.js
import { apiClient } from './api';

// NOTA: Necesitarás implementar el endpoint de login en el backend
export const authService = {
  async login(credentials) {
    // Esto es temporal - necesitarás crear el endpoint de login en el backend
    const users = await apiClient.get('/usuarios');
    const user = users.find(u => 
      u.correo === credentials.email && u.esta_activo
    );
    
    if (user) {
      // En un caso real, aquí verificarías la contraseña hasheada
      localStorage.setItem('currentUser', JSON.stringify(user));
      return user;
    }
    
    throw new Error('Credenciales inválidas');
  },

  logout() {
    localStorage.removeItem('currentUser');
  },

  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated() {
    return !!this.getCurrentUser();
  },
};