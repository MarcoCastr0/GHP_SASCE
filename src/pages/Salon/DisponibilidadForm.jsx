// src/pages/Salon/DisponibilidadForm.jsx
import React, { useState, useEffect } from 'react';
import { disponibilidadService } from '../../services/disponibilidadService';

const DIAS_SEMANA = [
  { value: 0, label: 'Domingo' },
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' }
];

const DisponibilidadForm = ({ salon, onOcupacionCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    id_periodo_academico: '',
    dia_semana: '',
    hora_inicio: '',
    hora_fin: '',
    motivo: ''
  });
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPeriodos, setLoadingPeriodos] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPeriodosAcademicos();
  }, []);

  const loadPeriodosAcademicos = async () => {
    try {
      setLoadingPeriodos(true);
      const data = await disponibilidadService.getPeriodosAcademicos();
      setPeriodosAcademicos(data);
      
      // Seleccionar automáticamente el periodo activo
      const periodoActivo = data.find(p => p.esta_activo);
      if (periodoActivo) {
        setFormData(prev => ({
          ...prev,
          id_periodo_academico: periodoActivo.id_periodo
        }));
      }
    } catch (err) {
      setError(err.message || 'Error al cargar periodos académicos');
    } finally {
      setLoadingPeriodos(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validaciones básicas
    if (!formData.id_periodo_academico || formData.dia_semana === '' || 
        !formData.hora_inicio || !formData.hora_fin || !formData.motivo) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    // Validar que hora_fin > hora_inicio
    if (formData.hora_fin <= formData.hora_inicio) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      setLoading(false);
      return;
    }

    // Validar rango de operación (06:00 - 22:00)
    const horaInicio = formData.hora_inicio.substring(0, 5);
    const horaFin = formData.hora_fin.substring(0, 5);
    
    if (horaInicio < '06:00' || horaFin > '22:00') {
      setError('El horario debe estar dentro del rango de operación (06:00 - 22:00)');
      setLoading(false);
      return;
    }

    try {
      await disponibilidadService.createOcupacion(salon.id_salon, {
        id_periodo_academico: Number(formData.id_periodo_academico),
        dia_semana: Number(formData.dia_semana),
        hora_inicio: formData.hora_inicio,
        hora_fin: formData.hora_fin,
        motivo: formData.motivo.trim()
      });
      onOcupacionCreated();
    } catch (err) {
      setError(err.message || 'Error al registrar bloqueo de horario');
    } finally {
      setLoading(false);
    }
  };

  if (loadingPeriodos) {
    return (
      <div className="disponibilidad-form-container">
        <div className="loading">Cargando formulario...</div>
      </div>
    );
  }

  return (
    <div className="disponibilidad-form-container">
      <div className="form-header">
        <h2>🚫 Bloquear Horario del Salón</h2>
        <p className="form-subtitle">
          Salón: <strong>{salon.codigo_salon}</strong>
          {salon.nombre_salon && ` - ${salon.nombre_salon}`}
        </p>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="info-box-warning">
        <p>
          <strong>ℹ️ Importante:</strong> Los bloqueos de horario impiden que el salón 
          sea asignado para clases en los días y horas especificados. Use esta función 
          para mantenimientos, limpiezas profundas o eventos especiales.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="disponibilidad-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="id_periodo_academico">
              <span className="label-icon">📅</span>
              Periodo Académico *
            </label>
            <select
              id="id_periodo_academico"
              name="id_periodo_academico"
              value={formData.id_periodo_academico}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccionar periodo...</option>
              {periodosAcademicos.map((periodo) => (
                <option key={periodo.id_periodo} value={periodo.id_periodo}>
                  {periodo.nombre_periodo} {periodo.esta_activo && '(Activo)'}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dia_semana">
              <span className="label-icon">📆</span>
              Día de la Semana *
            </label>
            <select
              id="dia_semana"
              name="dia_semana"
              value={formData.dia_semana}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccionar día...</option>
              {DIAS_SEMANA.map((dia) => (
                <option key={dia.value} value={dia.value}>
                  {dia.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="hora_inicio">
              <span className="label-icon">🕐</span>
              Hora de Inicio *
            </label>
            <input
              type="time"
              id="hora_inicio"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              required
              disabled={loading}
              min="06:00"
              max="22:00"
            />
            <small className="field-hint">Horario de operación: 06:00 - 22:00</small>
          </div>

          <div className="form-group">
            <label htmlFor="hora_fin">
              <span className="label-icon">🕐</span>
              Hora de Fin *
            </label>
            <input
              type="time"
              id="hora_fin"
              name="hora_fin"
              value={formData.hora_fin}
              onChange={handleChange}
              required
              disabled={loading}
              min="06:00"
              max="22:00"
            />
            <small className="field-hint">Debe ser posterior a la hora de inicio</small>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="motivo">
              <span className="label-icon">📝</span>
              Motivo del Bloqueo *
            </label>
            <textarea
              id="motivo"
              name="motivo"
              value={formData.motivo}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Ej: Mantenimiento preventivo, limpieza profunda, evento especial"
              rows="3"
              maxLength={500}
            />
            <small className="field-hint">
              Describa el motivo del bloqueo del horario
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            ❌ Cancelar
          </button>
          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Registrando bloqueo...
              </>
            ) : (
              <>🚫 Bloquear Horario</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DisponibilidadForm;