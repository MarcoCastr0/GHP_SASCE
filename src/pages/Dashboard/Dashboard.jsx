// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserManagement from '../UserManagement/UserManagement';
import GrupoManagement from '../GrupoEstudiante/GrupoManagement';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout, isAdmin, isCoordinador } = useAuth();
  const [activeModule, setActiveModule] = useState(() => {
    // Módulo inicial según el rol
    if (isAdmin) return 'usuarios';
    if (isCoordinador) return 'grupos';
    return 'inicio';
  });

  const getRoleName = (id_rol) => {
    const roles = {
      1: 'Administrador',
      2: 'Coordinador',
      3: 'Coordinador de Infraestructura',
      4: 'Profesor',
      5: 'Estudiante'
    };
    return roles[id_rol] || 'Usuario';
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'usuarios':
        return isAdmin ? <UserManagement /> : <AccessDenied />;
      
      case 'grupos':
        return isCoordinador ? <GrupoManagement /> : <AccessDenied />;
      
      case 'inicio':
      default:
        return <WelcomeScreen isAdmin={isAdmin} isCoordinador={isCoordinador} setActiveModule={setActiveModule} />;
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>📚 Sistema de Asignación de Salones</h1>
          <div className="user-info">
            <span>👤 Bienvenido, <strong>{currentUser?.username}</strong></span>
            <span className="user-role">{getRoleName(currentUser?.id_rol)}</span>
            <button onClick={logout} className="logout-btn">
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <ul>
          <li className={activeModule === 'inicio' ? 'nav-active' : ''}>
            <a href="#inicio" onClick={(e) => { e.preventDefault(); setActiveModule('inicio'); }}>
              🏠 Inicio
            </a>
          </li>
          
          {isAdmin && (
            <li className={activeModule === 'usuarios' ? 'nav-active' : ''}>
              <a href="#usuarios" onClick={(e) => { e.preventDefault(); setActiveModule('usuarios'); }}>
                👥 Gestión de Usuarios
              </a>
            </li>
          )}
          
          {isCoordinador && (
            <li className={activeModule === 'grupos' ? 'nav-active' : ''}>
              <a href="#grupos" onClick={(e) => { e.preventDefault(); setActiveModule('grupos'); }}>
                📚 Grupos de Estudiantes
              </a>
            </li>
          )}
          
          <li className={activeModule === 'profesores' ? 'nav-active' : ''}>
            <a href="#profesores" onClick={(e) => { e.preventDefault(); setActiveModule('profesores'); }}>
              👨‍🏫 Profesores
            </a>
          </li>
          
          <li className={activeModule === 'asignaciones' ? 'nav-active' : ''}>
            <a href="#asignaciones" onClick={(e) => { e.preventDefault(); setActiveModule('asignaciones'); }}>
              📅 Asignaciones
            </a>
          </li>
          
          <li className={activeModule === 'reportes' ? 'nav-active' : ''}>
            <a href="#reportes" onClick={(e) => { e.preventDefault(); setActiveModule('reportes'); }}>
              📊 Reportes
            </a>
          </li>
        </ul>
      </nav>

      <main className="dashboard-main">
        {renderContent()}
      </main>
    </div>
  );
};

// Componente de pantalla de bienvenida
const WelcomeScreen = ({ isAdmin, isCoordinador, setActiveModule }) => {
  return (
    <div className="welcome-section">
      <h2>Bienvenido al Sistema GHP-SASCE</h2>
      <p>Seleccione una opción del menú para comenzar</p>
      
      <div className="quick-stats">
        {isAdmin && (
          <div className="stat-card" onClick={() => setActiveModule('usuarios')}>
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Usuarios</h3>
              <p>Gestione usuarios del sistema</p>
              <span className="stat-link">Ir a usuarios →</span>
            </div>
          </div>
        )}
        
        {isCoordinador && (
          <div className="stat-card" onClick={() => setActiveModule('grupos')}>
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Grupos de Estudiantes</h3>
              <p>Administre grupos de estudiantes</p>
              <span className="stat-link">Ir a grupos →</span>
            </div>
          </div>
        )}
        
        <div className="stat-card disabled">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Asignaciones</h3>
            <p>Próximamente</p>
          </div>
        </div>
        
        <div className="stat-card disabled">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Reportes</h3>
            <p>Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de acceso denegado
const AccessDenied = () => {
  return (
    <div className="access-denied">
      <div className="access-denied-content">
        <span className="access-denied-icon">🚫</span>
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección</p>
      </div>
    </div>
  );
};

export default Dashboard;