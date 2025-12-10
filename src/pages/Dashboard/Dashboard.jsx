// src/pages/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import UserManagement from '../UserManagement/UserManagement';
import GrupoManagement from '../GrupoEstudiante/GrupoManagement';
import SalonManagement from '../Salon/SalonManagement';
import './Dashboard.css';
import CrearProfesor from "../Profesor/CrearProfesor";



const Dashboard = () => {
  const { currentUser, logout, isAdmin, isCoordinador, isCoordinadorInfra } = useAuth();
  
  // Debug en consola
  console.log('📊 Dashboard - Roles:', {
    isAdmin,
    isCoordinador,
    isCoordinadorInfra,
    id_rol: currentUser?.id_rol
  });
  
  const [activeModule, setActiveModule] = useState(() => {
    // Módulo inicial según el rol
    if (isAdmin) return 'usuarios';
    if (isCoordinador) return 'grupos';
    if (isCoordinadorInfra) return 'salones';
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
    console.log('🎯 Renderizando módulo:', activeModule);
    
    switch (activeModule) {
      case 'usuarios':
        return isAdmin ? <UserManagement /> : <AccessDenied />;
      
      case 'grupos':
        return isCoordinador ? <GrupoManagement /> : <AccessDenied />;
      
      case 'salones':
        console.log('🏢 Cargando SalonManagement, isCoordinadorInfra:', isCoordinadorInfra);
        return isCoordinadorInfra ? <SalonManagement /> : <AccessDenied />;
      
      case 'inicio':
      default:
        return <WelcomeScreen 
          isAdmin={isAdmin} 
          isCoordinador={isCoordinador} 
          isCoordinadorInfra={isCoordinadorInfra}
          setActiveModule={setActiveModule} 
        />;

      
      
      case 'profesores':
        return <CrearProfesor />;

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
            <a href="#inicio" onClick={(e) => { 
              e.preventDefault(); 
              console.log('Navegando a: inicio');
              setActiveModule('inicio'); 
            }}>
              🏠 Inicio
            </a>
          </li>
          
          {isAdmin && (
            <li className={activeModule === 'usuarios' ? 'nav-active' : ''}>
              <a href="#usuarios" onClick={(e) => { 
                e.preventDefault(); 
                console.log('Navegando a: usuarios');
                setActiveModule('usuarios'); 
              }}>
                👥 Gestión de Usuarios
              </a>
            </li>
          )}
          
          {isCoordinador && (
            <li className={activeModule === 'grupos' ? 'nav-active' : ''}>
              <a href="#grupos" onClick={(e) => { 
                e.preventDefault(); 
                console.log('Navegando a: grupos');
                setActiveModule('grupos'); 
              }}>
                📚 Grupos de Estudiantes
              </a>
            </li>
          )}
          
          {isCoordinadorInfra && (
            <li className={activeModule === 'salones' ? 'nav-active' : ''}>
              <a href="#salones" onClick={(e) => { 
                e.preventDefault(); 
                console.log('🏢 Navegando a: salones');
                setActiveModule('salones'); 
              }}>
                🏢 Gestión de Salones
              </a>
            </li>
          )}
          
          <li className={activeModule === 'profesores' ? 'nav-active' : ''}>
            <a href="#profesores" onClick={(e) => { 
              e.preventDefault(); 
              setActiveModule('profesores'); 
            }}>
              👨‍🏫 Profesores
            </a>
          </li>
          
          <li className={activeModule === 'asignaciones' ? 'nav-active' : ''}>
            <a href="#asignaciones" onClick={(e) => { 
              e.preventDefault(); 
              setActiveModule('asignaciones'); 
            }}>
              📅 Asignaciones
            </a>
          </li>
          
          <li className={activeModule === 'reportes' ? 'nav-active' : ''}>
            <a href="#reportes" onClick={(e) => { 
              e.preventDefault(); 
              setActiveModule('reportes'); 
            }}>
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
const WelcomeScreen = ({ isAdmin, isCoordinador, isCoordinadorInfra, setActiveModule }) => {
  console.log('🏠 WelcomeScreen - Mostrando tarjetas para:', {
    isAdmin,
    isCoordinador,
    isCoordinadorInfra
  });

  return (
    <div className="welcome-section">
      <h2>Bienvenido al Sistema GHP-SASCE</h2>
      <p>Seleccione una opción del menú para comenzar</p>
      
      <div className="quick-stats">
        {isAdmin && (
          <div className="stat-card" onClick={() => {
            console.log('Click en tarjeta: usuarios');
            setActiveModule('usuarios');
          }}>
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Usuarios</h3>
              <p>Gestione usuarios del sistema</p>
              <span className="stat-link">Ir a usuarios →</span>
            </div>
          </div>
        )}
        
        {isCoordinador && (
          <div className="stat-card" onClick={() => {
            console.log('Click en tarjeta: grupos');
            setActiveModule('grupos');
          }}>
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>Grupos de Estudiantes</h3>
              <p>Administre grupos de estudiantes</p>
              <span className="stat-link">Ir a grupos →</span>
            </div>
          </div>
        )}
        
        {/* ✅ TARJETA DE SALONES - DEBE APARECER PARA COORDINADOR DE INFRAESTRUCTURA */}
        {isCoordinadorInfra && (
          <div className="stat-card" onClick={() => {
            console.log('🏢 Click en tarjeta: salones');
            setActiveModule('salones');
          }}>
            <div className="stat-icon">🏢</div>
            <div className="stat-content">
              <h3>Gestión de Salones</h3>
              <p>Registre y administre salones</p>
              <span className="stat-link">Ir a salones →</span>
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