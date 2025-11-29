// src/pages/SalonManagement/SalonList.jsx
import React from 'react';

const SalonList = ({ salones }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!salones || salones.length === 0) {
    return (
      <div className="no-salones">
        <div className="empty-state">
          <span className="empty-icon">🏢</span>
          <h3>No hay salones registrados</h3>
          <p>Comience registrando el primer salón del sistema</p>
        </div>
      </div>
    );
  }

  return (
    <div className="salon-list">
      <div className="list-header">
        <h3>📋 Salones Registrados ({salones.length})</h3>
      </div>
      
      <div className="salones-grid">
        {salones.map((salon) => (
          <div key={salon.id_salon} className="salon-card">
            <div className="salon-card-header">
              <div>
                <h4>{salon.codigo_salon}</h4>
                {salon.nombre_salon && (
                  <p className="salon-subtitle">{salon.nombre_salon}</p>
                )}
              </div>
              <span className={`status-badge ${salon.esta_activo ? 'active' : 'inactive'}`}>
                {salon.esta_activo ? '✓ Activo' : '✗ Inactivo'}
              </span>
            </div>
            
            <div className="salon-card-body">
              <div className="salon-info-item">
                <span className="info-label">🏛️ Edificio:</span>
                <span className="info-value">
                  ID {salon.id_edificio}
                </span>
              </div>
              
              {salon.numero_piso !== null && (
                <div className="salon-info-item">
                  <span className="info-label">🔢 Piso:</span>
                  <span className="info-value">{salon.numero_piso}</span>
                </div>
              )}
              
              <div className="salon-info-item">
                <span className="info-label">👥 Capacidad:</span>
                <span className="info-value capacidad-badge">
                  {salon.capacidad} personas
                </span>
              </div>
              
              {salon.descripcion_ubicacion && (
                <div className="salon-info-item full-width">
                  <span className="info-label">📍 Ubicación:</span>
                  <span className="info-value ubicacion">
                    {salon.descripcion_ubicacion}
                  </span>
                </div>
              )}
              
              <div className="salon-info-item full-width">
                <span className="info-label">📅 Fecha de registro:</span>
                <span className="info-value">{formatDate(salon.fecha_creacion)}</span>
              </div>
            </div>
            
            <div className="salon-card-footer">
              <button className="btn-view" title="Ver detalles">
                👁️ Ver
              </button>
              <button className="btn-edit" title="Editar salón">
                ✏️ Editar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalonList;