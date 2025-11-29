// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserManagement from '../UserManagement/UserManagement';
import './Dashboard.css';

const Dashboard = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('usuarios');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleName = (idRol) => {
    const roles = {
      1: 'Administrador',
      2: 'Coordinador',
      3: 'Coordinador de Infraestructura',
      4: 'Profesor',
      5: 'Estudiante'
    };
    return roles[idRol] || 'Usuario';
  };

  const getRoleIcon = (idRol) => {
    const icons = {
      1: '👑',
      2: '📋',
      3: '🏢',
      4: '👨‍🏫',
      5: '🎓'
    };
    return icons[idRol] || '👤';
  };

  // Determinar tabs disponibles según el rol
  const availableTabs = [
    { 
      id: 'usuarios', 
      label: 'Gestión de Usuarios', 
      icon: '👥',
      roles: [1], // Solo admin
      component: UserManagement 
    },
    { 
      id: 'grupos', 
      label: 'Grupos de Estudiantes', 
      icon: '📚',
      roles: [1, 2], // Admin y coordinador
      disabled: true 
    },
    { 
      id: 'salones', 
      label: 'Gestión de Salones', 
      icon: '🏫',
      roles: [1, 3], // Admin y coord. infraestructura
      disabled: true 
    },
    { 
      id: 'asignaciones', 
      label: 'Asignaciones', 
      icon: '📅',
      roles: [1, 2, 3, 4], // Todos excepto estudiantes
      disabled: true 
    },
  ];

  const userCanAccessTab = (tab) => {
    return tab.roles.includes(currentUser?.id_rol);
  };

  const visibleTabs = availableTabs.filter(tab => userCanAccessTab(tab));

  const ActiveComponent = visibleTabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>🎓 GHP-SASCE</h1>
            <p className="header-subtitle">Sistema de Asignación de Salones</p>
          </div>
          
          <div className="header-right">
            <div className="user-info-card">
              <div className="user-avatar">
                {getRoleIcon(currentUser?.id_rol)}
              </div>
              <div className="user-details">
                <span className="user-name">
                  {currentUser?.username || 'Usuario'}
                </span>
                <span className="user-role">
                  {getRoleName(currentUser?.id_rol)}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setShowLogoutConfirm(true)} 
              className="logout-btn"
              title="Cerrar Sesión"
            >
              🚪 Salir
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <ul className="nav-tabs">
          {visibleTabs.map(tab => (
            <li 
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'nav-active' : ''} ${tab.disabled ? 'nav-disabled' : ''}`}
            >
              <button
                onClick={() => !tab.disabled && setActiveTab(tab.id)}
                disabled={tab.disabled}
                title={tab.disabled ? 'Próximamente disponible' : tab.label}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                {tab.disabled && <span className="coming-soon">Próximamente</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {ActiveComponent ? (
          <ActiveComponent />
        ) : (
          <div className="empty-content">
            <div className="empty-icon">📋</div>
            <h2>Selecciona una sección</h2>
            <p>Elige una opción del menú para comenzar</p>
          </div>
        )}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🚪 Cerrar Sesión</h3>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro que deseas cerrar sesión?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowLogoutConfirm(false)}
              >
                ❌ Cancelar
              </button>
              <button 
                className="btn-danger"
                onClick={handleLogout}
              >
                ✅ Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2024 GHP-SASCE - Sistema de Asignación de Salones v1.0.0</p>
      </footer>
    </div>
  );
};

export default Dashboard;