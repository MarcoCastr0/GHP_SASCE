// src/pages/GrupoEstudiante/GrupoList.jsx
import React from 'react';

const GrupoList = ({ grupos }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!grupos || grupos.length === 0) {
    return (
      <div className="no-grupos">
        <div className="empty-state">
          <span className="empty-icon">📚</span>
          <h3>No hay grupos registrados</h3>
          <p>Comience creando su primer grupo de estudiantes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grupo-list">
      <div className="list-header">
        <h3>📋 Grupos Registrados ({grupos.length})</h3>
      </div>
      
      <div className="grupos-grid">
        {grupos.map((grupo) => (
          <div key={grupo.id_grupo} className="grupo-card">
            <div className="grupo-card-header">
              <h4>{grupo.nombre_grupo}</h4>
              <span className={`status-badge ${grupo.esta_activo ? 'active' : 'inactive'}`}>
                {grupo.esta_activo ? '✓ Activo' : '✗ Inactivo'}
              </span>
            </div>
            
            <div className="grupo-card-body">
              <div className="grupo-info-item">
                <span className="info-label">🏷️ Código:</span>
                <span className="info-value">{grupo.codigo_grupo}</span>
              </div>
              
              <div className="grupo-info-item">
                <span className="info-label">📊 Nivel Académico:</span>
                <span className="info-value">
                  {grupo.nivel_academico?.nombre_nivel || 'N/A'}
                </span>
              </div>
              
              <div className="grupo-info-item">
                <span className="info-label">👥 Estudiantes:</span>
                <span className="info-value cantidad-badge">
                  {grupo.cantidad_estudiantes}
                </span>
              </div>
              
              {grupo.requisitos_especiales && (
                <div className="grupo-info-item full-width">
                  <span className="info-label">📝 Requisitos:</span>
                  <span className="info-value requisitos">
                    {grupo.requisitos_especiales}
                  </span>
                </div>
              )}
              
              <div className="grupo-info-item full-width">
                <span className="info-label">📅 Fecha de creación:</span>
                <span className="info-value">{formatDate(grupo.fecha_creacion)}</span>
              </div>
            </div>
            
            <div className="grupo-card-footer">
              <button className="btn-view" title="Ver detalles">
                👁️ Ver
              </button>
              <button className="btn-edit" title="Editar grupo">
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrupoList;