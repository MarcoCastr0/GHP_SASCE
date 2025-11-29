// src/pages/GrupoEstudiante/GrupoList.jsx
import React, { useState } from 'react';

const GrupoList = ({ grupos, onViewDetail, onEdit, onDeactivate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const filteredGrupos = grupos.filter(grupo => {
    const matchSearch = 
      grupo.nombre_grupo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grupo.codigo_grupo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && grupo.esta_activo) ||
      (filterStatus === 'inactive' && !grupo.esta_activo);

    return matchSearch && matchStatus;
  });

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
        <h3>📋 Grupos Registrados ({filteredGrupos.length} de {grupos.length})</h3>
        <div className="list-filters">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input-grupos"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select-grupos"
          >
            <option value="all">Todos los estados</option>
            <option value="active">✅ Activos</option>
            <option value="inactive">❌ Inactivos</option>
          </select>
        </div>
      </div>

      {filteredGrupos.length === 0 ? (
        <div className="no-results">
          <p>No se encontraron grupos con los filtros aplicados</p>
        </div>
      ) : (
        <div className="grupos-grid">
          {filteredGrupos.map((grupo) => (
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
                  <span className="info-label">📅 Creación:</span>
                  <span className="info-value">{formatDate(grupo.fecha_creacion)}</span>
                </div>
              </div>
              
              <div className="grupo-card-footer">
                <button 
                  className="btn-view" 
                  title="Ver detalles"
                  onClick={() => onViewDetail(grupo.id_grupo)}
                >
                  👁️ Ver
                </button>
                {grupo.esta_activo ? (
                  <>
                    <button 
                      className="btn-edit" 
                      title="Editar grupo"
                      onClick={() => onEdit(grupo)}
                    >
                      ✏️ Editar
                    </button>
                    <button 
                      className="btn-deactivate-small" 
                      title="Desactivar grupo"
                      onClick={() => onDeactivate(grupo)}
                    >
                      🚫
                    </button>
                  </>
                ) : (
                  <div className="inactive-label">Inactivo</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GrupoList;