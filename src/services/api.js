// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Cliente HTTP con soporte para autenticación JWT
export const apiClient = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Obtener token del localStorage
    const token = localStorage.getItem('accessToken');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    console.log('API Request:', {
      url,
      method: options.method || 'GET',
      body: config.body,
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);
      
      console.log('API Response Status:', response.status);
      
      // Manejar respuestas vacías (204, etc)
      const contentType = response.headers.get('content-type');
      let data = null;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
        console.log('API Response Data:', data);
      }

      // Manejar errores HTTP
      if (!response.ok) {
        // Si es 401, limpiar sesión
        if (response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('currentUser');
          window.location.href = '/login';
        }
        
        // Si es 403, sin permisos
        if (response.status === 403) {
          throw new Error(data?.message || 'No tienes permisos para realizar esta acción');
        }
        
        // Para otros errores
        throw new Error(data?.message || data?.error || `Error ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, { method: 'POST', body });
  },

  put(endpoint, body) {
    return this.request(endpoint, { method: 'PUT', body });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  patch(endpoint, body = null) {
    return this.request(endpoint, { method: 'PATCH', body });
  },
};
