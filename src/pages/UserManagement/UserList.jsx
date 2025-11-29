// src/pages/UserManagement/UserList.jsx
import React, { useState } from 'react';

const ROLES = {
  1: 'ADMINISTRADOR',
  2: 'COORDINADOR',
  3: 'COORDINADOR_INFRAESTRUCTURA',
  4: 'PROFESOR',
  5: 'ESTUDIANTE'
};

const ROLE_ICONS = {
  1: '👑',
  2: '📋',
  3: '🏢',
  4: '👨‍🏫',
  5: '🎓'
};

const UserList = ({ users, onToggleStatus, currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = 
      user.nombre_usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.correo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchRole = !filterRole || user.id_rol === parseInt(filterRole);
    
    const matchStatus = 
      filterStatus === '' || 
      (filterStatus === 'active' && user.esta_activo) ||
      (filterStatus === 'inactive' && !user.esta_activo);

    return matchSearch && matchRole && matchStatus;
  });

  if (!users || users.length === 0) {
    return (
      <div className="no-users">
        <div className="empty-state">
          <span className="empty-icon">👥</span>
          <h3>No hay usuarios registrados</h3>
          <p>Crea el primer usuario haciendo clic en "Crear Nuevo Usuario"</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-list">
      <div className="list-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los roles</option>
            <option value="1">👑 Administrador</option>
            <option value="2">📋 Coordinador</option>
            <option value="3">🏢 Coord. Infraestructura</option>
            <option value="4">👨‍🏫 Profesor</option>
            <option value="5">🎓 Estudiante</option>
          </select>
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="active">✅ Activos</option>
            <option value="inactive">❌ Inactivos</option>
          </select>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron usuarios con los filtros aplicados</p>
        </div>
      ) : (
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Fecha Creación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const isCurrentUser = user.id_usuario === currentUserId;
              
              return (
                <tr key={user.id_usuario} className={isCurrentUser ? 'current-user-row' : ''}>
                  <td>{user.id_usuario}</td>
                  <td>
                    <div className="user-cell">
                      <strong>{user.nombre_usuario}</strong>
                      {isCurrentUser && <span className="you-badge">TÚ</span>}
                    </div>
                  </td>
                  <td>{user.correo}</td>
                  <td>
                    <span className={`role-badge role-${user.id_rol}`}>
                      {ROLE_ICONS[user.id_rol]} {ROLES[user.id_rol] || 'DESCONOCIDO'}
                    </span>
                  </td>
                  <td>{formatDate(user.fecha_creacion)}</td>
                  <td>
                    <span className={`status-badge ${user.esta_activo ? 'active' : 'inactive'}`}>
                      {user.esta_activo ? '✅ Activo' : '❌ Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`btn-action ${user.esta_activo ? 'btn-deactivate' : 'btn-activate'}`}
                      onClick={() => onToggleStatus(user.id_usuario, user.esta_activo)}
                      disabled={isCurrentUser && user.esta_activo}
                      title={
                        isCurrentUser && user.esta_activo 
                          ? 'No puedes desactivar tu propia cuenta' 
                          : user.esta_activo 
                            ? 'Desactivar usuario' 
                            : 'Activar usuario'
                      }
                    >
                      {user.esta_activo ? '🚫 Desactivar' : '✅ Activar'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;