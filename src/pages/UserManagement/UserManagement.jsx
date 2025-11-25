// src/pages/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import UserList from './UserList';
import UserForm from './UserForm';
import { userService } from '../../services/userService';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await userService.getUsers();
      setUsers(usersData);
    } catch (err) {
      setError('Error al cargar los usuarios: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleUserSaved = () => {
    handleCloseForm();
    loadUsers();
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres desactivar este usuario?')) {
      try {
        await userService.deleteUser(userId);
        await loadUsers();
      } catch (err) {
        setError('Error al desactivar usuario: ' + err.message);
      }
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await userService.activateUser(userId);
      await loadUsers();
    } catch (err) {
      setError('Error al activar usuario: ' + err.message);
    }
  };

  if (loading) {
    return <div className="loading">Cargando usuarios...</div>;
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <h2>Gestión de Usuarios</h2>
        <button 
          className="btn-primary"
          onClick={handleCreateUser}
        >
          + Crear Nuevo Usuario
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <UserList
        users={users}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        onActivate={handleActivateUser}
      />

      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleCloseForm}
          onSave={handleUserSaved}
        />
      )}
    </div>
  );
};

export default UserManagement;