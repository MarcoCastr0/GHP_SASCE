// src/services/userService.js
import { apiClient } from './api';

export const userService = {
  // GET /api/admin/users - Listar todos los usuarios
  async getUsers() {
    try {
      return await apiClient.get('/admin/users');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener usuarios');
    }
  },

  // POST /api/admin/users - Crear nuevo usuario
  async createUser(userData) {
    try {
      return await apiClient.post('/admin/users', {
        nombre_usuario: userData.nombre_usuario,
        correo: userData.correo,
        password: userData.password,
        nombre_rol: userData.nombre_rol,
        nombre: userData.nombre,
        apellido: userData.apellido
      });
    } catch (error) {
      throw new Error(error.message || 'Error al crear usuario');
    }
  },

  // PATCH /api/admin/users/:id/desactivar - Desactivar usuario
  async desactivarUser(id) {
    try {
      return await apiClient.patch(`/admin/users/${id}/desactivar`);
    } catch (error) {
      throw new Error(error.message || 'Error al desactivar usuario');
    }
  },

  // PATCH /api/admin/users/:id/activar - Activar usuario
  async activarUser(id) {
    try {
      return await apiClient.patch(`/admin/users/${id}/activar`);
    } catch (error) {
      throw new Error(error.message || 'Error al activar usuario');
    }
  },
};
