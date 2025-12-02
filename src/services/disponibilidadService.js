// src/services/disponibilidadService.js
import { apiClient } from './api';

export const disponibilidadService = {
  // GET /api/coordinador-infra/salones/periodos-academicos
  async getPeriodosAcademicos() {
    try {
      return await apiClient.get('/coordinador-infra/salones/periodos-academicos');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener periodos académicos');
    }
  },

  // GET /api/coordinador-infra/salones/:id/ocupacion
  async getOcupaciones(idSalon, filtros = {}) {
    try {
      const params = new URLSearchParams();
      if (filtros.id_periodo_academico) {
        params.append('id_periodo_academico', filtros.id_periodo_academico);
      }
      if (filtros.dia_semana !== undefined && filtros.dia_semana !== null) {
        params.append('dia_semana', filtros.dia_semana);
      }
      
      const queryString = params.toString();
      const url = `/coordinador-infra/salones/${idSalon}/ocupacion${queryString ? '?' + queryString : ''}`;
      
      return await apiClient.get(url);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener ocupaciones');
    }
  },

  // POST /api/coordinador-infra/salones/:id/ocupacion
  async createOcupacion(idSalon, ocupacionData) {
    try {
      return await apiClient.post(`/coordinador-infra/salones/${idSalon}/ocupacion`, {
        id_periodo_academico: ocupacionData.id_periodo_academico,
        dia_semana: ocupacionData.dia_semana,
        hora_inicio: ocupacionData.hora_inicio,
        hora_fin: ocupacionData.hora_fin,
        motivo: ocupacionData.motivo
      });
    } catch (error) {
      throw new Error(error.message || 'Error al crear ocupación');
    }
  },

  // DELETE /api/coordinador-infra/salones/ocupacion/:id_ocupacion
  async deleteOcupacion(idOcupacion) {
    try {
      return await apiClient.delete(`/coordinador-infra/salones/ocupacion/${idOcupacion}`);
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar ocupación');
    }
  }
};