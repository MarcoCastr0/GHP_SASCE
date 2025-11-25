// src/pages/UserManagement/UserForm.jsx
import React, { useState, useEffect } from 'react';
import { userService } from '../../services/userService';
import './UserManagement.css';

const UserForm = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    correo: '',
    hash_contrasena: '',
    nombre: '',
    apellido: '',
    id_rol: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    loadRoles();
    if (user) {
      setFormData({
        nombre_usuario: user.nombre_usuario || '',
        correo: user.correo || '',
        hash_contrasena: '', // No mostrar contraseña existente
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        id_rol: user.id_rol || ''
      });
    }
  }, [user]);

  const loadRoles = async () => {
    try {
      // NOTA: Necesitarás crear un servicio para roles
      // Por ahora usamos datos de ejemplo
      const exampleRoles = [
        { id_rol: 1, nombre_rol: 'Administrador' },
        { id_rol: 2, nombre_rol: 'Coordinador' },
        { id_rol: 3, nombre_rol: 'Profesor' }
      ];
      setRoles(exampleRoles);
    } catch (err) {
      console.error('Error loading roles:', err);
    }
  };

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

    try {
      if (user) {
        // Actualizar usuario
        await userService.updateUser(user.id_usuario, formData);
      } else {
        // Crear nuevo usuario
        await userService.createUser(formData);
      }
      onSave();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Apellido *</label>
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Nombre de Usuario *</label>
              <input
                type="text"
                name="nombre_usuario"
                value={formData.nombre_usuario}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Correo Electrónico *</label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Contraseña {!user && '*'}</label>
              <input
                type="password"
                name="hash_contrasena"
                value={formData.hash_contrasena}
                onChange={handleChange}
                required={!user}
                placeholder={user ? 'Dejar vacío para mantener actual' : ''}
              />
            </div>

            <div className="form-group">
              <label>Rol *</label>
              <select
                name="id_rol"
                value={formData.id_rol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar rol</option>
                {roles.map(role => (
                  <option key={role.id_rol} value={role.id_rol}>
                    {role.nombre_rol}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Guardando...' : (user ? 'Actualizar' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;