// src/pages/GrupoEstudiante/GrupoDetail.jsx
import React, { useState, useEffect } from 'react';
import { grupoEstudianteService } from '../../services/grupoEstudianteService';

const GrupoDetail = ({ grupoId, onBack, onEdit, onDeactivate }) => {
  const [grupo, setGrupo] = useState(null);
  const [nivelesAcademicos, setNivelesAcademicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadGrupoDetail();
    loadNivelesAcademicos();
  }, [grupoId]);

  const loadGrupoDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await grupoEstudianteService.getGrupoById(grupoId);
      setGrupo(data);
    } catch (err) {
      setError(err.message || 'Error al cargar detalles del grupo');
    } finally {
      setLoading(false);
    }
  };

  const loadNivelesAcademicos = async () => {
    try {
      const data = await grupoEstudianteService.getNivelesAcademicos();
      setNivelesAcademicos(data);
    } catch (err) {
      console.error('Error al cargar niveles:', err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNivelNombre = (idNivel) => {
    const nivel = nivelesAcademicos.find(n => n.id_nivel === idNivel);
    return nivel ? nivel.nombre_nivel : 'N/A';
  };

  if (loading) {
    return (
      <div className="grupo-detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando detalles del grupo...</p>
        </div>
      </div>
    );
  }

  if (error || !grupo) {
    return (
      <div className="grupo-detail-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error || 'Grupo no encontrado'}
        </div>
        <button onClick={onBack} className="btn-secondary">
          ← Volver
        </button>
      </div>
    );
  }

  return (
    <div className="grupo-detail-container">
      <div className="detail-header">
        <button onClick={onBack} className="btn-back">
          ← Volver a la lista
        </button>
        <div className="header-actions">
          {grupo.esta_activo ? (
            <>
              <button 
                onClick={() => onEdit(grupo)}
                className="btn-edit"
              >
                ✏️ Editar Grupo
              </button>
              <button 
                onClick={() => onDeactivate(grupo)}
                className="btn-deactivate"
              >
                🚫 Desactivar Grupo
              </button>
            </>
          ) : (
            <div className="inactive-badge">
              ❌ Grupo Inactivo
            </div>
          )}
        </div>
      </div>

      <div className="detail-card">
        <div className="detail-card-header">
          <h2>{grupo.nombre_grupo}</h2>
          <span className={`status-badge ${grupo.esta_activo ? 'active' : 'inactive'}`}>
            {grupo.esta_activo ? '✓ Activo' : '✗ Inactivo'}
          </span>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h3>📋 Información General</h3>
            <div className="detail-items">
              <div className="detail-item">
                <span className="detail-label">🏷️ Código del Grupo:</span>
                <span className="detail-value code">{grupo.codigo_grupo}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📊 Nivel Académico:</span>
                <span className="detail-value">{getNivelNombre(grupo.id_nivel_academico)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">👥 Cantidad de Estudiantes:</span>
                <span className="detail-value cantidad-badge">{grupo.cantidad_estudiantes}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">📅 Estado:</span>
                <span className={`detail-value ${grupo.esta_activo ? 'text-success' : 'text-danger'}`}>
                  {grupo.esta_activo ? 'Grupo Activo' : 'Grupo Inactivo'}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>📝 Requisitos Especiales</h3>
            <div className="requisitos-box">
              {grupo.requisitos_especiales ? (
                <p>{grupo.requisitos_especiales}</p>
              ) : (
                <p className="no-requisitos">No se especificaron requisitos especiales</p>
              )}
            </div>
          </div>

          <div className="detail-section">
            <h3>🕒 Fechas</h3>
            <div className="detail-items">
              <div className="detail-item">
                <span className="detail-label">📅 Fecha de Creación:</span>
                <span className="detail-value">{formatDate(grupo.fecha_creacion)}</span>
              </div>
              {grupo.fecha_actualizacion && (
                <div className="detail-item">
                  <span className="detail-label">🔄 Última Actualización:</span>
                  <span className="detail-value">{formatDate(grupo.fecha_actualizacion)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {!grupo.esta_activo && (
        <div className="warning-message">
          <span className="warning-icon">⚠️</span>
          <div>
            <strong>Grupo Inactivo</strong>
            <p>Este grupo ha sido desactivado y no puede ser editado. Los grupos inactivos se mantienen en el historial del sistema.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrupoDetail;