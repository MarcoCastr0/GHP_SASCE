// src/services/profesorService.js
import { apiClient } from './api';

export const profesorService = {
  // GET /api/coordinador/profesores - Listar todos los profesores
  async getProfesores() {
    try {
      return await apiClient.get('/coordinador/profesores');
    } catch (error) {
      throw new Error(error.message || 'Error al obtener profesores');
    }
  },

  // GET /api/coordinador/profesores/:id - Obtener un profesor por ID
  async getProfesorById(id) {
    try {
      return await apiClient.get(`/coordinador/profesores/${id}`);
    } catch (error) {
      throw new Error(error.message || 'Error al obtener el profesor');
    }
  },

  // POST /api/coordinador/profesores - Crear nuevo profesor (con FormData)
  async createProfesor(profesorData) {
    try {
      const formData = new FormData();
      
      // Campos básicos
      formData.append('numero_identificacion', profesorData.numero_identificacion);
      formData.append('nombre', profesorData.nombre);
      formData.append('apellido', profesorData.apellido);
      formData.append('correo', profesorData.correo);
      
      // Campos opcionales
      if (profesorData.biografia) {
        formData.append('biografia', profesorData.biografia);
      }
      if (profesorData.cualificaciones) {
        formData.append('cualificaciones', profesorData.cualificaciones);
      }
      
      // Especialidades como JSON
      if (profesorData.especialidades) {
        formData.append('especialidades', JSON.stringify(profesorData.especialidades));
      }
      
      // Archivo PDF (hoja de vida)
      if (profesorData.hoja_vida) {
        formData.append('hoja_vida', profesorData.hoja_vida);
      }

      // Usar fetch directamente para FormData
      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://marcocastr0.github.io/GHP_SASCE/';
      
      const response = await fetch(`${API_BASE_URL}/coordinador/profesores`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear profesor');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al crear profesor');
    }
  },

  // PUT /api/coordinador/profesores/:id - Actualizar profesor
  async updateProfesor(id, profesorData) {
    try {
      const formData = new FormData();
      
      // Solo agregar campos que fueron modificados
      if (profesorData.numero_identificacion) {
        formData.append('numero_identificacion', profesorData.numero_identificacion);
      }
      if (profesorData.nombre) {
        formData.append('nombre', profesorData.nombre);
      }
      if (profesorData.apellido) {
        formData.append('apellido', profesorData.apellido);
      }
      if (profesorData.biografia !== undefined) {
        formData.append('biografia', profesorData.biografia);
      }
      if (profesorData.cualificaciones !== undefined) {
        formData.append('cualificaciones', profesorData.cualificaciones);
      }
      if (profesorData.especialidades) {
        formData.append('especialidades', JSON.stringify(profesorData.especialidades));
      }
      if (profesorData.hoja_vida) {
        formData.append('hoja_vida', profesorData.hoja_vida);
      }

      const token = localStorage.getItem('accessToken');
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
      
      const response = await fetch(`${API_BASE_URL}/coordinador/profesores/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al actualizar profesor');
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar profesor');
    }
  },

  // DELETE /api/coordinador/profesores/:id - Eliminar profesor (baja lógica)
  async deleteProfesor(id) {
    try {
      return await apiClient.delete(`/coordinador/profesores/${id}`);
    } catch (error) {
      throw new Error(error.message || 'Error al eliminar profesor');
    }
  }
};