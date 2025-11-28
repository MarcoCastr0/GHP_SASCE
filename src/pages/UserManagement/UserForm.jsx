// src/pages/UserManagement/UserForm.jsx
import React, { useState } from 'react';
import { userService } from '../../services/userService';

const ROLES_OPTIONS = [
  { value: 'ADMINISTRADOR', label: 'Administrador' },
  { value: 'COORDINADOR', label: 'Coordinador' },
  { value: 'COORDINADOR_INFRAESTRUCTURA', label: 'Coordinador de Infraestructura' },
  { value: 'PROFESOR', label: 'Profesor' },
  { value: 'ESTUDIANTE', label: 'Estudiante' }
];

const UserForm = ({ onUserCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    correo: '',
    password: '',
    nombre_rol: '',
    nombre: '',
    apellido: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!formData.nombre_usuario || !formData.correo || !formData.password || 
        !formData.nombre_rol || !formData.nombre || !formData.apellido) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    try {
      await userService.createUser(formData);
      onUserCreated();
    } catch (err) {
      setError(err.message || 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-form-container">
      <h2>Crear Nuevo Usuario</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">Nombre *</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Juan"
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido *</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Pérez"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre_usuario">Nombre de Usuario *</label>
            <input
              type="text"
              id="nombre_usuario"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="juan.perez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo">Correo Electrónico *</label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="juan@example.com"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre_rol">Rol *</label>
            <select
              id="nombre_rol"
              name="nombre_rol"
              value={formData.nombre_rol}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccionar rol...</option>
              {ROLES_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
