// src/pages/GrupoEstudiante/GrupoManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { grupoEstudianteService } from '../../services/grupoEstudianteService';
import GrupoList from './GrupoList';
import GrupoForm from './GrupoForm';
import './GrupoManagement.css';

const GrupoManagement = () => {
  const { currentUser } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Verificar si el usuario es coordinador (id_rol === 2)
  const isCoordinador = currentUser?.id_rol === 2;

  useEffect(() => {
    if (!isCoordinador) {
      setError('Solo los coordinadores pueden acceder a esta sección');
      setLoading(false);
      return;
    }
    loadGrupos();
  }, [isCoordinador, refreshTrigger]);

  const loadGrupos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await grupoEstudianteService.getGrupos();
      setGrupos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar grupos');
    } finally {
      setLoading(false);
    }
  };

  const handleGrupoCreated = () => {
    setShowForm(false);
    setSuccessMessage('✅ Grupo registrado exitosamente');
    setRefreshTrigger(prev => prev + 1);
    
    // Limpiar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setError('');
  };

  if (!isCoordinador) {
    return (
      <div className="grupo-management">
        <div className="error-container">
          <h2>🚫 Acceso Denegado</h2>
          <p>Solo los coordinadores pueden gestionar grupos de estudiantes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grupo-management">
      <div className="grupo-management-header">
        <div className="header-title">
          <h1>📚 Gestión de Grupos de Estudiantes</h1>
          <p className="header-subtitle">
            Administre y registre grupos de estudiantes del sistema
          </p>
        </div>
        
        {!showForm && (
          <button 
            className="btn-primary btn-create"
            onClick={() => setShowForm(true)}
          >
            ➕ Registrar Nuevo Grupo
          </button>
        )}
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Mensaje de error general */}
      {error && !showForm && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Formulario de registro */}
      {showForm && (
        <GrupoForm 
          onGrupoCreated={handleGrupoCreated}
          onCancel={handleCancelForm}
        />
      )}

      {/* Lista de grupos */}
      {!showForm && (
        <>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando grupos...</p>
            </div>
          ) : (
            <GrupoList grupos={grupos} />
          )}
        </>
      )}
    </div>
  );
};

export default GrupoManagement;