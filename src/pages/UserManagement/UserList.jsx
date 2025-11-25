// src/pages/UserManagement/UserList.jsx
import React from 'react';
import './UserManagement.css';

const UserList = ({ users, onEdit, onDelete, onActivate }) => {
  if (users.length === 0) {
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
            <th>Nombre</th>
            <th>Correo</th>
            <th>Usuario</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_usuario}>
              <td>{user.nombre} {user.apellido}</td>
              <td>{user.correo}</td>
              <td>{user.nombre_usuario}</td>
              <td>
                <span className={`role-badge role-${user.rol?.nombre_rol?.toLowerCase()}`}>
                  {user.rol?.nombre_rol}
                </span>
              </td>
              <td>
                <span className={`status-badge ${user.esta_activo ? 'active' : 'inactive'}`}>
                  {user.esta_activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(user)}
                    title="Editar usuario"
                  >
                    ✏️
                  </button>
                  {user.esta_activo ? (
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(user.id_usuario)}
                      title="Desactivar usuario"
                    >
                      🚫
                    </button>
                  ) : (
                    <button
                      className="btn-activate"
                      onClick={() => onActivate(user.id_usuario)}
                      title="Activar usuario"
                    >
                      ✅
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;