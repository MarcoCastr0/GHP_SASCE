// src/services/grupoEstudianteService.js
import { apiClient } from './api';

export const grupoEstudianteService = {
  // GET /api/coordinador/grupos - Listar todos los grupos
  async getGrupos() {
    try {
      return await apiClient.get('/coordinador/grupos');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener grupos');
    }
  },

  // GET /api/coordinador/grupos/:id - Obtener un grupo por ID
  async getGrupoById(id) {
    try {
      return await apiClient.get(`/coordinador/grupos/${id}`);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener el grupo');
    }
  },

  // POST /api/coordinador/grupos - Crear nuevo grupo
  async createGrupo(grupoData) {
    try {
      return await apiClient.post('/coordinador/grupos', {
        nombre_grupo: grupoData.nombre_grupo,
        id_nivel_academico: grupoData.id_nivel_academico,
        cantidad_estudiantes: grupoData.cantidad_estudiantes,
        requisitos_especiales: grupoData.requisitos_especiales || null
      });
    } catch (error) {
      throw new Error(error.message || 'Error al crear grupo');
    }
  },

  // PUT /api/coordinador/grupos/:id - Actualizar grupo existente
  async updateGrupo(id, grupoData) {
    try {
      return await apiClient.put(`/coordinador/grupos/${id}`, {
        nombre_grupo: grupoData.nombre_grupo,
        id_nivel_academico: grupoData.id_nivel_academico,
        cantidad_estudiantes: grupoData.cantidad_estudiantes,
        requisitos_especiales: grupoData.requisitos_especiales || null
      });
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar grupo');
    }
  },

  // PATCH /api/coordinador/grupos/:id/desactivar - Desactivar grupo
  async desactivarGrupo(id) {
    try {
      return await apiClient.patch(`/coordinador/grupos/${id}/desactivar`);
    } catch (error) {
      throw new Error(error.message || 'Error al desactivar grupo');
    }
  },

  // GET /api/coordinador/grupos/niveles-academicos - Obtener niveles académicos
  async getNivelesAcademicos() {
    try {
      return await apiClient.get('/coordinador/grupos/niveles-academicos');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener niveles académicos');
    }
  }
};