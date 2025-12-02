// src/pages/Salon/DisponibilidadCalendar.jsx
import React from 'react';

const DIAS_SEMANA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

const HORAS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
  '18:00', '19:00', '20:00', '21:00', '22:00'
];

const DisponibilidadCalendar = ({ ocupaciones, onDeleteOcupacion }) => {
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (ocupacion) => {
    const confirmMsg = `¿Está seguro de eliminar este bloqueo?\n\n` +
      `Día: ${DIAS_SEMANA[ocupacion.dia_semana]}\n` +
      `Horario: ${formatTime(ocupacion.hora_inicio)} - ${formatTime(ocupacion.hora_fin)}\n` +
      `Motivo: ${ocupacion.motivo}`;
    
    if (window.confirm(confirmMsg)) {
      onDeleteOcupacion(ocupacion.id_ocupacion);
    }
  };

  // Agrupar ocupaciones por día
  const ocupacionesPorDia = {};
  DIAS_SEMANA.forEach((_, index) => {
    ocupacionesPorDia[index] = [];
  });

  ocupaciones.forEach(ocupacion => {
    if (ocupacionesPorDia[ocupacion.dia_semana]) {
      ocupacionesPorDia[ocupacion.dia_semana].push(ocupacion);
    }
  });

  // Ordenar ocupaciones por hora de inicio
  Object.keys(ocupacionesPorDia).forEach(dia => {
    ocupacionesPorDia[dia].sort((a, b) => 
      a.hora_inicio.localeCompare(b.hora_inicio)
    );
  });

  if (ocupaciones.length === 0) {
    return (
      <div className="no-ocupaciones">
        <div className="empty-state-small">
          <span className="empty-icon-small">📅</span>
          <p>No hay horarios bloqueados para este salón</p>
          <small>Los bloqueos que registre aparecerán aquí</small>
        </div>
      </div>
    );
  }

  return (
    <div className="disponibilidad-calendar">
      <div className="calendar-grid">
        {DIAS_SEMANA.map((dia, index) => (
          <div key={index} className="calendar-day-column">
            <div className="calendar-day-header">
              <strong>{dia}</strong>
              {ocupacionesPorDia[index].length > 0 && (
                <span className="ocupaciones-count">
                  {ocupacionesPorDia[index].length}
                </span>
              )}
            </div>
            
            <div className="calendar-day-body">
              {ocupacionesPorDia[index].length === 0 ? (
                <div className="no-ocupaciones-dia">
                  <span>✅ Disponible</span>
                </div>
              ) : (
                <div className="ocupaciones-list">
                  {ocupacionesPorDia[index].map((ocupacion) => (
                    <div key={ocupacion.id_ocupacion} className="ocupacion-card">
                      <div className="ocupacion-time">
                        🕐 {formatTime(ocupacion.hora_inicio)} - {formatTime(ocupacion.hora_fin)}
                      </div>
                      <div className="ocupacion-motivo">
                        📝 {ocupacion.motivo}
                      </div>
                      <div className="ocupacion-fecha">
                        <small>Registrado: {formatDate(ocupacion.fecha_creacion)}</small>
                      </div>
                      <button
                        className="btn-delete-ocupacion"
                        onClick={() => handleDelete(ocupacion)}
                        title="Eliminar bloqueo"
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="calendar-legend">
        <h4>📊 Resumen Semanal</h4>
        <div className="legend-stats">
          <div className="stat-item">
            <span className="stat-label">Total de bloqueos:</span>
            <span className="stat-value">{ocupaciones.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Días con bloqueos:</span>
            <span className="stat-value">
              {Object.values(ocupacionesPorDia).filter(arr => arr.length > 0).length} / 7
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisponibilidadCalendar;