// src/services/profesorService.js
import { apiClient } from "./api";

export const profesorService = {
  // GET - Listar profesores
  async getProfesores() {
    return apiClient.get("/coordinador/profesores");
  },

  // GET - Obtener profesor por ID
  async getProfesorById(id) {
    return apiClient.get(`/coordinador/profesores/${id}`);
  },

  // POST - Crear profesor
  async createProfesor(profesorData) {
    try {
      const formData = new FormData();

      // Campos básicos
      formData.append("numero_identificacion", profesorData.numero_identificacion);
      formData.append("nombre", profesorData.nombre);
      formData.append("apellido", profesorData.apellido);
      formData.append("correo", profesorData.correo);

      // Opcionales
      if (profesorData.biografia) formData.append("biografia", profesorData.biografia);
      if (profesorData.cualificaciones) formData.append("cualificaciones", profesorData.cualificaciones);

      // Especialidades como JSON
      if (profesorData.especialidades) {
        formData.append("especialidades", JSON.stringify(profesorData.especialidades));
      }

      // Archivo
      if (profesorData.hoja_vida instanceof File) {
        formData.append("hoja_vida", profesorData.hoja_vida);
      } else {
        throw new Error("Debe seleccionar una hoja de vida en PDF.");
      }

      const token = localStorage.getItem("accessToken");
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_BASE_URL}/coordinador/profesores`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData, // NO AGREGAR content-type
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // PUT - Actualizar profesor
  async updateProfesor(id, profesorData) {
    try {
      const formData = new FormData();

      Object.entries(profesorData).forEach(([key, value]) => {
        if (key === "especialidades") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "hoja_vida" && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      const token = localStorage.getItem("accessToken");
      const API_BASE_URL = import.meta.env.VITE_API_URL;

      const response = await fetch(`${API_BASE_URL}/coordinador/profesores/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message);
      }

      return await response.json();
    } catch (error) {
      throw new Error(error.message);
    }
  },

  // DELETE - Baja lógica
  async deleteProfesor(id) {
    return apiClient.delete(`/coordinador/profesores/${id}`);
  },
};
