// src/pages/GrupoEstudiante/GrupoManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { grupoEstudianteService } from '../../services/grupoEstudianteService';
import GrupoList from './GrupoList';
import GrupoForm from './GrupoForm';
import GrupoDetail from './GrupoDetail';
import GrupoEdit from './GrupoEdit';
import './GrupoManagement.css';

const GrupoManagement = () => {
  const { currentUser } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedGrupo, setSelectedGrupo] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

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

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleGrupoCreated = () => {
    setShowForm(false);
    showSuccessMessage('✅ Grupo registrado exitosamente');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleGrupoUpdated = () => {
    setShowEdit(false);
    setShowDetail(false);
    setSelectedGrupo(null);
    showSuccessMessage('✅ Grupo actualizado exitosamente');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewDetail = (grupoId) => {
    setSelectedGrupo(grupoId);
    setShowDetail(true);
    setShowForm(false);
    setShowEdit(false);
  };

  const handleEdit = (grupo) => {
    if (!grupo.esta_activo) {
      setError('⚠️ No se puede editar un grupo inactivo');
      setTimeout(() => setError(''), 5000);
      return;
    }
    setSelectedGrupo(grupo);
    setShowEdit(true);
    setShowForm(false);
    setShowDetail(false);
  };

  const handleDeactivate = async (grupo) => {
    if (!grupo.esta_activo) {
      setError('⚠️ El grupo ya está inactivo');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const confirmMsg = `¿Está seguro de desactivar el grupo "${grupo.nombre_grupo}"?\n\nEsta acción no se puede deshacer y el grupo ya no aparecerá en los listados activos.\n\nNota: No se puede desactivar un grupo con estudiantes activos.`;
    
    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      await grupoEstudianteService.desactivarGrupo(grupo.id_grupo);
      showSuccessMessage(`✅ Grupo "${grupo.nombre_grupo}" desactivado correctamente`);
      setShowDetail(false);
      setShowEdit(false);
      setSelectedGrupo(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError(err.message || 'Error al desactivar grupo');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleBack = () => {
    setShowDetail(false);
    setShowEdit(false);
    setShowForm(false);
    setSelectedGrupo(null);
    setError('');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setShowEdit(false);
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

  if (showDetail && selectedGrupo) {
    return (
      <div className="grupo-management">
        <GrupoDetail
          grupoId={selectedGrupo}
          onBack={handleBack}
          onEdit={handleEdit}
          onDeactivate={handleDeactivate}
        />
      </div>
    );
  }

  if (showEdit && selectedGrupo) {
    return (
      <div className="grupo-management">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        <GrupoEdit
          grupo={selectedGrupo}
          onGrupoUpdated={handleGrupoUpdated}
          onCancel={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="grupo-management">
      <div className="grupo-management-header">
        <div className="header-title">
          <h1>📚 Gestión de Grupos de Estudiantes</h1>
          <p className="header-subtitle">
            {showForm ? 'Registrar nuevo grupo' : 'Administre y registre grupos de estudiantes del sistema'}
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

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {error && !showForm && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {showForm && (
        <GrupoForm 
          onGrupoCreated={handleGrupoCreated}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && (
        <>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando grupos...</p>
            </div>
          ) : (
            <GrupoList 
              grupos={grupos}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDeactivate={handleDeactivate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GrupoManagement;