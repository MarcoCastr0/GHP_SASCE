// src/pages/GrupoEstudiante/GrupoEdit.jsx
import React, { useState, useEffect } from 'react';
import { grupoEstudianteService } from '../../services/grupoEstudianteService';

const GrupoEdit = ({ grupo, onGrupoUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre_grupo: '',
    id_nivel_academico: '',
    cantidad_estudiantes: '',
    requisitos_especiales: ''
  });
  const [nivelesAcademicos, setNivelesAcademicos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingNiveles, setLoadingNiveles] = useState(true);
  const [error, setError] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadNivelesAcademicos();
    if (grupo) {
      setFormData({
        nombre_grupo: grupo.nombre_grupo || '',
        id_nivel_academico: grupo.id_nivel_academico || '',
        cantidad_estudiantes: grupo.cantidad_estudiantes || '',
        requisitos_especiales: grupo.requisitos_especiales || ''
      });
    }
  }, [grupo]);

  const loadNivelesAcademicos = async () => {
    try {
      setLoadingNiveles(true);
      const data = await grupoEstudianteService.getNivelesAcademicos();
      setNivelesAcademicos(data);
    } catch (err) {
      setError(err.message || 'Error al cargar niveles académicos');
    } finally {
      setLoadingNiveles(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setHasChanges(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!formData.nombre_grupo || !formData.id_nivel_academico || !formData.cantidad_estudiantes) {
      setError('Todos los campos obligatorios deben ser completados');
      setLoading(false);
      return;
    }

    // Validar cantidad de estudiantes
    const cantidad = Number(formData.cantidad_estudiantes);
    if (isNaN(cantidad) || cantidad <= 0) {
      setError('El número de estudiantes debe ser mayor a cero');
      setLoading(false);
      return;
    }

    try {
      await grupoEstudianteService.updateGrupo(grupo.id_grupo, {
        nombre_grupo: formData.nombre_grupo.trim(),
        id_nivel_academico: Number(formData.id_nivel_academico),
        cantidad_estudiantes: cantidad,
        requisitos_especiales: formData.requisitos_especiales.trim() || null
      });
      onGrupoUpdated();
    } catch (err) {
      setError(err.message || 'Error al actualizar grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    if (hasChanges) {
      const confirm = window.confirm('¿Está seguro de cancelar? Los cambios no guardados se perderán.');
      if (confirm) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  if (loadingNiveles) {
    return (
      <div className="grupo-form-container">
        <div className="loading">Cargando formulario...</div>
      </div>
    );
  }

  return (
    <div className="grupo-form-container">
      <div className="form-header">
        <h2>✏️ Editar Grupo de Estudiantes</h2>
        <p className="form-subtitle">Modifique la información del grupo "{grupo.nombre_grupo}"</p>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      <div className="info-box-edit">
        <p>
          <strong>ℹ️ Nota:</strong> Solo puede editar grupos activos. Los cambios se aplicarán inmediatamente después de guardar.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="grupo-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="nombre_grupo">
              <span className="label-icon">👥</span>
              Nombre del Grupo *
            </label>
            <input
              type="text"
              id="nombre_grupo"
              name="nombre_grupo"
              value={formData.nombre_grupo}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Ej: Grupo 10A, Matemáticas Avanzadas"
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label htmlFor="id_nivel_academico">
              <span className="label-icon">📊</span>
              Nivel Académico *
            </label>
            <select
              id="id_nivel_academico"
              name="id_nivel_academico"
              value={formData.id_nivel_academico}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Seleccionar nivel...</option>
              {nivelesAcademicos.map((nivel) => (
                <option key={nivel.id_nivel} value={nivel.id_nivel}>
                  {nivel.nombre_nivel}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="cantidad_estudiantes">
              <span className="label-icon">🔢</span>
              Cantidad de Estudiantes *
            </label>
            <input
              type="number"
              id="cantidad_estudiantes"
              name="cantidad_estudiantes"
              value={formData.cantidad_estudiantes}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Ej: 25"
              min="1"
              max="999"
            />
            <small className="field-hint">Debe ser un número mayor a cero</small>
          </div>

          <div className="form-group full-width">
            <label htmlFor="requisitos_especiales">
              <span className="label-icon">📝</span>
              Requisitos Especiales (Opcional)
            </label>
            <textarea
              id="requisitos_especiales"
              name="requisitos_especiales"
              value={formData.requisitos_especiales}
              onChange={handleChange}
              disabled={loading}
              placeholder="Ej: Laboratorio de ciencias, proyector, computadoras"
              rows="3"
              maxLength={500}
            />
            <small className="field-hint">
              Indique necesidades especiales de infraestructura o equipamiento
            </small>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={handleCancelClick}
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
                Guardando cambios...
              </>
            ) : (
              <>💾 Guardar Cambios</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GrupoEdit;