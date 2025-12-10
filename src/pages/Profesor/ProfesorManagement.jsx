// src/pages/Profesor/ProfesorManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { profesorService } from '../../services/profesorService';
import ProfesorList from './ProfesorList';
import ProfesorForm from './ProfesorForm';
import ProfesorDetail from './ProfesorDetail';
import ProfesorEdit from './ProfesorEdit';
import DisponibilidadProfesorManagement from './DisponibilidadProfesorManagement';
import './ProfesorManagement.css';

const ProfesorManagement = () => {
  const { currentUser } = useAuth();
  const [profesores, setProfesores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDisponibilidad, setShowDisponibilidad] = useState(false);
  const [selectedProfesor, setSelectedProfesor] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  const isCoordinador = currentUser?.id_rol === 2;

  useEffect(() => {
    if (!isCoordinador) {
      setError('Solo los coordinadores pueden acceder a esta sección');
      setLoading(false);
      return;
    }
    loadProfesores();
  }, [isCoordinador, refreshTrigger]);

  const loadProfesores = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await profesorService.getProfesores();
      setProfesores(data);
    } catch (err) {
      setError(err.message || 'Error al cargar profesores');
    } finally {
      setLoading(false);
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleProfesorCreated = () => {
    setShowForm(false);
    showSuccessMessage('✅ Profesor registrado exitosamente');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleProfesorUpdated = () => {
    setShowEdit(false);
    setShowDetail(false);
    setSelectedProfesor(null);
    showSuccessMessage('✅ Profesor actualizado exitosamente');
    setRefreshTrigger(prev => prev + 1);
  };

  const handleViewDetail = (profesorId) => {
    setSelectedProfesor(profesorId);
    setShowDetail(true);
    setShowForm(false);
    setShowEdit(false);
    setShowDisponibilidad(false);
  };

  const handleEdit = (profesor) => {
    if (!profesor.usuario.esta_activo) {
      setError('⚠️ No se puede editar un profesor inactivo');
      setTimeout(() => setError(''), 5000);
      return;
    }
    setSelectedProfesor(profesor);
    setShowEdit(true);
    setShowForm(false);
    setShowDetail(false);
    setShowDisponibilidad(false);
  };

  const handleDelete = async (profesor) => {
    if (!profesor.usuario.esta_activo) {
      setError('⚠️ El profesor ya está inactivo');
      setTimeout(() => setError(''), 5000);
      return;
    }

    const confirmMsg = `¿Está seguro de eliminar al profesor "${profesor.usuario.nombre} ${profesor.usuario.apellido}"?\n\nEsta acción desactivará el usuario asociado y no se podrá deshacer.`;
    
    if (!window.confirm(confirmMsg)) {
      return;
    }

    try {
      await profesorService.deleteProfesor(profesor.id_profesor);
      showSuccessMessage(`✅ Profesor eliminado correctamente`);
      setShowDetail(false);
      setShowEdit(false);
      setSelectedProfesor(null);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      setError(err.message || 'Error al eliminar profesor');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleGestionarDisponibilidad = (profesor) => {
    setSelectedProfesor(profesor);
    setShowDisponibilidad(true);
    setShowForm(false);
    setShowDetail(false);
    setShowEdit(false);
  };

  const handleBack = () => {
    setShowDetail(false);
    setShowEdit(false);
    setShowForm(false);
    setShowDisponibilidad(false);
    setSelectedProfesor(null);
    setError('');
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setShowEdit(false);
    setError('');
  };

  if (!isCoordinador) {
    return (
      <div className="profesor-management">
        <div className="error-container">
          <h2>🚫 Acceso Denegado</h2>
          <p>Solo los coordinadores pueden gestionar profesores</p>
        </div>
      </div>
    );
  }

  if (showDisponibilidad && selectedProfesor) {
    return (
      <div className="profesor-management">
        <DisponibilidadProfesorManagement
          profesor={selectedProfesor}
          onBack={handleBack}
        />
      </div>
    );
  }

  if (showDetail && selectedProfesor) {
    return (
      <div className="profesor-management">
        <ProfesorDetail
          profesorId={selectedProfesor}
          onBack={handleBack}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onGestionarDisponibilidad={handleGestionarDisponibilidad}
        />
      </div>
    );
  }

  if (showEdit && selectedProfesor) {
    return (
      <div className="profesor-management">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        <ProfesorEdit
          profesor={selectedProfesor}
          onProfesorUpdated={handleProfesorUpdated}
          onCancel={handleBack}
        />
      </div>
    );
  }

  return (
    <div className="profesor-management">
      <div className="profesor-management-header">
        <div className="header-title">
          <h1>👨‍🏫 Gestión de Profesores</h1>
          <p className="header-subtitle">
            {showForm ? 'Registrar nuevo profesor' : 'Administre profesores y su disponibilidad horaria'}
          </p>
        </div>
        
        {!showForm && (
          <button 
            className="btn-primary btn-create"
            onClick={() => setShowForm(true)}
          >
            ➕ Registrar Nuevo Profesor
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
        <ProfesorForm 
          onProfesorCreated={handleProfesorCreated}
          onCancel={handleCancelForm}
        />
      )}

      {!showForm && (
        <>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando profesores...</p>
            </div>
          ) : (
            <ProfesorList 
              profesores={profesores}
              onViewDetail={handleViewDetail}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onGestionarDisponibilidad={handleGestionarDisponibilidad}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ProfesorManagement;