// src/services/salonService.js
import { apiClient } from './api';

export const salonService = {
  // GET /api/coordinador-infra/salones - Listar todos los salones
  async getSalones() {
    try {
      return await apiClient.get('/coordinador-infra/salones');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener salones');
    }
  },

  // POST /api/coordinador-infra/salones - Crear nuevo salón
  async createSalon(salonData) {
    try {
      return await apiClient.post('/coordinador-infra/salones', {
        codigo_salon: salonData.codigo_salon,
        nombre_salon: salonData.nombre_salon || null,
        id_edificio: salonData.id_edificio,
        numero_piso: salonData.numero_piso ?? null,
        capacidad: salonData.capacidad,
        descripcion_ubicacion: salonData.descripcion_ubicacion || null,
        recursos: salonData.recursos || []
      });
    } catch (error) {
      throw new Error(error.message || 'Error al crear salón');
    }
  },

  // GET /api/coordinador-infra/salones/edificios - Obtener edificios
  async getEdificios() {
    try {
      return await apiClient.get('/coordinador-infra/salones/edificios');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener edificios');
    }
  },

  // GET /api/coordinador-infra/salones/tipos-recurso - Obtener tipos de recurso
  async getTiposRecurso() {
    try {
      return await apiClient.get('/coordinador-infra/salones/tipos-recurso');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener tipos de recurso');
    }
  }
};