// src/services/userService.js
import { apiClient } from './api';

export const userService = {
  // Obtener todos los usuarios
  getUsers() {
    return apiClient.get('/usuarios');
  },

  // Obtener usuario por ID
  getUserById(id) {
    return apiClient.get(`/usuarios/${id}`);
  },

  // Crear nuevo usuario
  createUser(userData) {
    return apiClient.post('/usuarios', userData);
  },

  // Actualizar usuario
  updateUser(id, userData) {
    return apiClient.put(`/usuarios/${id}`, userData);
  },

  // Desactivar usuario
  deleteUser(id) {
    return apiClient.delete(`/usuarios/${id}`);
  },

  // Activar usuario
  activateUser(id) {
    return apiClient.patch(`/usuarios/${id}/activate`);
  },
};