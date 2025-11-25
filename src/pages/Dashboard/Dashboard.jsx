// src/pages/Dashboard/Dashboard.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserManagement from '../UserManagement/UserManagement';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Sistema de Asignación de Salones</h1>
          <div className="user-info">
            <span>Bienvenido, {currentUser?.nombre} {currentUser?.apellido}</span>
            <span className="user-role">{currentUser?.rol?.nombre_rol}</span>
            <button onClick={logout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li className="nav-active">
            <a href="#usuarios">Gestión de Usuarios</a>
          </li>
          <li>
            <a href="#profesores">Profesores</a>
          </li>
          <li>
            <a href="#estudiantes">Estudiantes</a>
          </li>
          <li>
            <a href="#asignaciones">Asignaciones</a>
          </li>
        </ul>
      </nav>

      <main className="dashboard-main">
        <UserManagement />
      </main>
    </div>
  );
};

export default Dashboard;