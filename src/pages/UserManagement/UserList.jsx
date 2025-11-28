// src/pages/UserManagement/UserList.jsx
import React from 'react';

const ROLES = {
  1: 'ADMINISTRADOR',
  2: 'COORDINADOR',
  3: 'COORDINADOR_INFRAESTRUCTURA',
  4: 'PROFESOR',
  5: 'ESTUDIANTE'
};

const UserList = ({ users, onToggleStatus }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  if (!users || users.length === 0) {
    return (
      <div className="no-users">
        <p>No hay usuarios registrados</p>
      </div>
    );
  }

  return (
    <div className="user-list">
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
          {users.map((user) => (
            <tr key={user.id_usuario}>
              <td>{user.id_usuario}</td>
              <td>{user.nombre_usuario}</td>
              <td>{user.correo}</td>
              <td>
                <span className={`role-badge role-${user.id_rol}`}>
                  {ROLES[user.id_rol] || 'DESCONOCIDO'}
                </span>
              </td>
              <td>{formatDate(user.fecha_creacion)}</td>
              <td>
                <span className={`status-badge ${user.esta_activo ? 'active' : 'inactive'}`}>
                  {user.esta_activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <button
                  className={`btn-action ${user.esta_activo ? 'btn-deactivate' : 'btn-activate'}`}
                  onClick={() => onToggleStatus(user.id_usuario, user.esta_activo)}
                >
                  {user.esta_activo ? 'Desactivar' : 'Activar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
