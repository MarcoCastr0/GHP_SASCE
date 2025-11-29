// src/pages/UserManagement/UserManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import UserList from './UserList';
import UserForm from './UserForm';
import './UserManagement.css';

const UserManagement = () => {
  const { isAdmin, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
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

  const handleUserCreated = (message) => {
    setShowForm(false);
    setSuccessMessage(message || 'Usuario creado exitosamente');
    setRefreshTrigger(prev => prev + 1);
    
    // Limpiar mensaje después de 5 segundos
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleToggleStatus = async (userId, estaActivo) => {
    // Prevenir que el admin se desactive a sí mismo
    if (userId === currentUser?.id && estaActivo) {
      setError('No puedes desactivar tu propia cuenta');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      setError('');
      if (estaActivo) {
        await userService.desactivarUser(userId);
        setSuccessMessage('Usuario desactivado exitosamente');
      } else {
        await userService.activarUser(userId);
        setSuccessMessage('Usuario activado exitosamente');
      }
      setRefreshTrigger(prev => prev + 1);
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (err) {
      setError(err.message || 'Error al cambiar estado del usuario');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setError('');
  };

  if (!isAdmin) {
    return (
      <div className="user-management">
        <div className="error-container">
          <h2>⛔ Acceso Denegado</h2>
          <p>Solo los administradores pueden gestionar usuarios</p>
          <p className="error-detail">
            Tu rol actual: <strong>{currentUser?.rol?.nombre_rol || 'Desconocido'}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-management-header">
        <div>
          <h1>👥 Gestión de Usuarios</h1>
          <p className="subtitle">CU1 - Administración de cuentas de usuario</p>
        </div>
        {!showForm && (
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            ➕ Crear Nuevo Usuario
          </button>
        )}
      </div>

      {error && (
        <div className="error-message">
          <strong>❌ Error:</strong> {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          <strong>✅ Éxito:</strong> {successMessage}
        </div>
      )}

      {showForm && (
        <UserForm 
          onUserCreated={handleUserCreated}
          onCancel={handleCancelForm}
        />
      )}

      {loading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
      ) : (
        <UserList 
          users={users}
          onToggleStatus={handleToggleStatus}
          currentUserId={currentUser?.id}
        />
      )}

      {!loading && users.length > 0 && (
        <div className="user-stats">
          <p>
            <strong>Total de usuarios:</strong> {users.length} |{' '}
            <strong>Activos:</strong> {users.filter(u => u.esta_activo).length} |{' '}
            <strong>Inactivos:</strong> {users.filter(u => !u.esta_activo).length}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;