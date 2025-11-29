// src/pages/SalonManagement/SalonForm.jsx
import React, { useState, useEffect } from 'react';
import { salonService } from '../../services/salonService';

const SalonForm = ({ onSalonCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    codigo_salon: '',
    nombre_salon: '',
    id_edificio: '',
    numero_piso: '',
    capacidad: '',
    descripcion_ubicacion: ''
  });
  const [recursos, setRecursos] = useState([]);
  const [edificios, setEdificios] = useState([]);
  const [tiposRecurso, setTiposRecurso] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      const [edificiosData, tiposData] = await Promise.all([
        salonService.getEdificios(),
        salonService.getTiposRecurso()
      ]);
      setEdificios(edificiosData);
      setTiposRecurso(tiposData);
    } catch (err) {
      setError(err.message || 'Error al cargar datos del formulario');
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddRecurso = () => {
    setRecursos([
      ...recursos,
      { id_tipo_recurso: '', cantidad: 1, notas: '' }
    ]);
  };

  const handleRemoveRecurso = (index) => {
    setRecursos(recursos.filter((_, i) => i !== index));
  };

  const handleRecursoChange = (index, field, value) => {
    const newRecursos = [...recursos];
    newRecursos[index][field] = value;
    setRecursos(newRecursos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!formData.codigo_salon || !formData.id_edificio || !formData.capacidad) {
      setError('Los campos código de salón, edificio y capacidad son obligatorios');
      setLoading(false);
      return;
    }

    // Validar capacidad
    const capacidad = Number(formData.capacidad);
    if (isNaN(capacidad) || capacidad <= 0) {
      setError('La capacidad debe ser un número mayor a cero');
      setLoading(false);
      return;
    }

    // Validar recursos
    const recursosValidos = recursos.filter(r => 
      r.id_tipo_recurso && Number(r.cantidad) > 0
    );

    try {
      await salonService.createSalon({
        codigo_salon: formData.codigo_salon.trim(),
        nombre_salon: formData.nombre_salon.trim() || null,
        id_edificio: Number(formData.id_edificio),
        numero_piso: formData.numero_piso ? Number(formData.numero_piso) : null,
        capacidad: capacidad,
        descripcion_ubicacion: formData.descripcion_ubicacion.trim() || null,
        recursos: recursosValidos
      });
      onSalonCreated();
    } catch (err) {
      setError(err.message || 'Error al crear salón');
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="salon-form-container">
        <div className="loading">Cargando formulario...</div>
      </div>
    );
  }

  return (
    <div className="salon-form-container">
      <div className="form-header">
        <h2>🏢 Registrar Nuevo Salón</h2>
        <p className="form-subtitle">Complete la información del salón y sus recursos</p>
      </div>
      
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="salon-form">
        {/* DATOS BÁSICOS DEL SALÓN */}
        <div className="form-section">
          <h3 className="section-title">📋 Información Básica</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="codigo_salon">
                <span className="label-icon">🏷️</span>
                Código del Salón *
              </label>
              <input
                type="text"
                id="codigo_salon"
                name="codigo_salon"
                value={formData.codigo_salon}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Ej: A101, LAB-02"
                maxLength={50}
              />
            </div>

            <div className="form-group">
              <label htmlFor="nombre_salon">
                <span className="label-icon">📝</span>
                Nombre del Salón (Opcional)
              </label>
              <input
                type="text"
                id="nombre_salon"
                name="nombre_salon"
                value={formData.nombre_salon}
                onChange={handleChange}
                disabled={loading}
                placeholder="Ej: Laboratorio de Química"
                maxLength={100}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="id_edificio">
                <span className="label-icon">🏛️</span>
                Edificio *
              </label>
              <select
                id="id_edificio"
                name="id_edificio"
                value={formData.id_edificio}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Seleccionar edificio...</option>
                {edificios.map((edificio) => (
                  <option key={edificio.id_edificio} value={edificio.id_edificio}>
                    {edificio.nombre_edificio} ({edificio.codigo_edificio})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="numero_piso">
                <span className="label-icon">🔢</span>
                Número de Piso (Opcional)
              </label>
              <input
                type="number"
                id="numero_piso"
                name="numero_piso"
                value={formData.numero_piso}
                onChange={handleChange}
                disabled={loading}
                placeholder="Ej: 1, 2, 3"
                min="0"
                max="50"
              />
            </div>

            <div className="form-group">
              <label htmlFor="capacidad">
                <span className="label-icon">👥</span>
                Capacidad *
              </label>
              <input
                type="number"
                id="capacidad"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="Ej: 30"
                min="1"
                max="999"
              />
              <small className="field-hint">Número máximo de personas</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label htmlFor="descripcion_ubicacion">
                <span className="label-icon">📍</span>
                Descripción de Ubicación (Opcional)
              </label>
              <textarea
                id="descripcion_ubicacion"
                name="descripcion_ubicacion"
                value={formData.descripcion_ubicacion}
                onChange={handleChange}
                disabled={loading}
                placeholder="Ej: Al lado de la cafetería, frente al laboratorio de física"
                rows="3"
                maxLength={500}
              />
            </div>
          </div>
        </div>

        {/* RECURSOS DEL SALÓN */}
        <div className="form-section">
          <div className="section-header">
            <h3 className="section-title">🛠️ Recursos del Salón</h3>
            <button
              type="button"
              className="btn-add-recurso"
              onClick={handleAddRecurso}
              disabled={loading}
            >
              ➕ Agregar Recurso
            </button>
          </div>

          {recursos.length === 0 ? (
            <div className="no-recursos">
              <p>No hay recursos agregados. Puede agregar recursos como proyectores, computadoras, etc.</p>
            </div>
          ) : (
            <div className="recursos-list">
              {recursos.map((recurso, index) => (
                <div key={index} className="recurso-item">
                  <div className="recurso-fields">
                    <div className="form-group">
                      <label>Tipo de Recurso</label>
                      <select
                        value={recurso.id_tipo_recurso}
                        onChange={(e) => handleRecursoChange(index, 'id_tipo_recurso', e.target.value)}
                        disabled={loading}
                        required
                      >
                        <option value="">Seleccionar...</option>
                        {tiposRecurso.map((tipo) => (
                          <option key={tipo.id_tipo_recurso} value={tipo.id_tipo_recurso}>
                            {tipo.nombre_recurso}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Cantidad</label>
                      <input
                        type="number"
                        value={recurso.cantidad}
                        onChange={(e) => handleRecursoChange(index, 'cantidad', e.target.value)}
                        disabled={loading}
                        min="1"
                        max="999"
                        required
                      />
                    </div>

                    <div className="form-group full-width">
                      <label>Notas (Opcional)</label>
                      <input
                        type="text"
                        value={recurso.notas}
                        onChange={(e) => handleRecursoChange(index, 'notas', e.target.value)}
                        disabled={loading}
                        placeholder="Ej: Buen estado, requiere mantenimiento"
                        maxLength={200}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-remove-recurso"
                    onClick={() => handleRemoveRecurso(index)}
                    disabled={loading}
                    title="Eliminar recurso"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
          )}
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
                Registrando...
              </>
            ) : (
              <>✅ Registrar Salón</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalonForm;