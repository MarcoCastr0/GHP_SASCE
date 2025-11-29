// src/pages/UserManagement/UserForm.jsx
import React, { useState } from 'react';
import { userService } from '../../services/userService';

const ROLES_OPTIONS = [
  { value: 'ADMINISTRADOR', label: 'Administrador', description: 'Control total del sistema' },
  { value: 'COORDINADOR', label: 'Coordinador', description: 'Gestión de grupos de estudiantes' },
  { value: 'COORDINADOR_INFRAESTRUCTURA', label: 'Coordinador de Infraestructura', description: 'Gestión de salones' },
  { value: 'PROFESOR', label: 'Profesor', description: 'Visualización de asignaciones' },
  { value: 'ESTUDIANTE', label: 'Estudiante', description: 'Consulta de horarios' }
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
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'nombre':
      case 'apellido':
        if (!value.trim()) {
          error = 'Este campo es obligatorio';
        } else if (value.trim().length < 2) {
          error = 'Debe tener al menos 2 caracteres';
        } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
          error = 'Solo se permiten letras';
        }
        break;

      case 'nombre_usuario':
        if (!value.trim()) {
          error = 'Este campo es obligatorio';
        } else if (value.trim().length < 4) {
          error = 'Debe tener al menos 4 caracteres';
        } else if (!/^[a-zA-Z0-9._-]+$/.test(value)) {
          error = 'Solo letras, números, puntos, guiones y guión bajo';
        }
        break;

      case 'correo':
        if (!value.trim()) {
          error = 'Este campo es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Correo electrónico inválido';
        }
        break;

      case 'password':
        if (!value) {
          error = 'Este campo es obligatorio';
        } else if (value.length < 6) {
          error = 'Debe tener al menos 6 caracteres';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          error = 'Debe contener mayúsculas, minúsculas y números';
        }
        break;

      case 'nombre_rol':
        if (!value) {
          error = 'Debe seleccionar un rol';
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar en tiempo real
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await userService.createUser(formData);
      onUserCreated(response.message || 'Usuario creado exitosamente');
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        submit: err.message || 'Error al crear usuario'
      }));
    } finally {
      setLoading(false);
    }
  };

  const getSelectedRole = () => {
    return ROLES_OPTIONS.find(r => r.value === formData.nombre_rol);
  };

  return (
    <div className="user-form-container">
      <div className="form-header">
        <h2>📝 Crear Nuevo Usuario</h2>
        <p>Complete todos los campos para registrar un nuevo usuario en el sistema</p>
      </div>
      
      {errors.submit && (
        <div className="error-message">
          <strong>❌ Error:</strong> {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="user-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
              placeholder="Juan"
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <span className="field-error">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="apellido">
              Apellido <span className="required">*</span>
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              disabled={loading}
              placeholder="Pérez"
              className={errors.apellido ? 'input-error' : ''}
            />
            {errors.apellido && <span className="field-error">{errors.apellido}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre_usuario">
              Nombre de Usuario <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre_usuario"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleChange}
              disabled={loading}
              placeholder="juan.perez"
              className={errors.nombre_usuario ? 'input-error' : ''}
            />
            {errors.nombre_usuario && <span className="field-error">{errors.nombre_usuario}</span>}
            <small className="field-hint">Solo letras, números, punto, guión y guión bajo</small>
          </div>

          <div className="form-group">
            <label htmlFor="correo">
              Correo Electrónico <span className="required">*</span>
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              disabled={loading}
              placeholder="juan.perez@example.com"
              className={errors.correo ? 'input-error' : ''}
            />
            {errors.correo && <span className="field-error">{errors.correo}</span>}
            <small className="field-hint">El correo debe ser único en el sistema</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">
              Contraseña <span className="required">*</span>
            </label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                placeholder="••••••••"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
            <small className="field-hint">Mínimo 6 caracteres con mayúsculas, minúsculas y números</small>
          </div>

          <div className="form-group">
            <label htmlFor="nombre_rol">
              Rol <span className="required">*</span>
            </label>
            <select
              id="nombre_rol"
              name="nombre_rol"
              value={formData.nombre_rol}
              onChange={handleChange}
              disabled={loading}
              className={errors.nombre_rol ? 'input-error' : ''}
            >
              <option value="">Seleccionar rol...</option>
              {ROLES_OPTIONS.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            {errors.nombre_rol && <span className="field-error">{errors.nombre_rol}</span>}
            {getSelectedRole() && (
              <small className="field-hint">📋 {getSelectedRole().description}</small>
            )}
          </div>
        </div>

        <div className="form-info">
          <p>
            <strong>⚠️ Importante:</strong> Cada usuario debe tener un rol asignado y un correo único.
            Solo los administradores pueden crear o eliminar usuarios.
          </p>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            ❌ Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? '⏳ Creando...' : '✅ Crear Usuario'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;