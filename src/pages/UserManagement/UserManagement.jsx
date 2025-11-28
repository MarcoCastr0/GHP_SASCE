// src/pages/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import UserList from './UserList';
import UserForm from './UserForm';
import './UserManagement.css';

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      setError('No tienes permisos para acceder a esta sección');
      setLoading(false);
      return;
    }
    loadUsers();
  }, [isAdmin, refreshTrigger]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err.message || 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleUserCreated = () => {
    setShowForm(false);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleToggleStatus = async (userId, estaActivo) => {
    try {
      if (estaActivo) {
        await userService.desactivarUser(userId);
      } else {
        await userService.activarUser(userId);
      }
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError(err.message || 'Error al cambiar estado del usuario');
    }
  };

  if (!isAdmin) {
    return (
      <div className="user-management">
        <div className="error-container">
          <h2>Acceso Denegado</h2>
          <p>Solo los administradores pueden gestionar usuarios</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h1>Gestión de Usuarios</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : 'Crear Nuevo Usuario'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <UserForm 
          onUserCreated={handleUserCreated}
          onCancel={() => setShowForm(false)}
        />
      )}

      {loading ? (
        <div className="loading">Cargando usuarios...</div>
      ) : (
        <UserList 
          users={users}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default UserManagement;
