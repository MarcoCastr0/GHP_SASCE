// src/pages/Salon/DisponibilidadManagement.jsx
import React, { useState, useEffect } from 'react';
import { disponibilidadService } from '../../services/disponibilidadService';
import DisponibilidadForm from './DisponibilidadForm';
import DisponibilidadCalendar from './DisponibilidadCalendar';

const DIAS_SEMANA_MAP = {
  0: 'Domingo',
  1: 'Lunes',
  2: 'Martes',
  3: 'Miércoles',
  4: 'Jueves',
  5: 'Viernes',
  6: 'Sábado'
};

const DisponibilidadManagement = ({ salon, onBack }) => {
  const [ocupaciones, setOcupaciones] = useState([]);
  const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Filtros
  const [selectedPeriodo, setSelectedPeriodo] = useState('');
  const [selectedDia, setSelectedDia] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedPeriodo) {
      loadOcupaciones();
    }
  }, [selectedPeriodo, selectedDia, refreshTrigger]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const periodos = await disponibilidadService.getPeriodosAcademicos();
      setPeriodosAcademicos(periodos);
      
      // Seleccionar automáticamente el periodo activo
      const periodoActivo = periodos.find(p => p.esta_activo);
      if (periodoActivo) {
        setSelectedPeriodo(periodoActivo.id_periodo.toString());
      } else if (periodos.length > 0) {
        setSelectedPeriodo(periodos[0].id_periodo.toString());
      }
    } catch (err) {
      setError(err.message || 'Error al cargar datos iniciales');
    } finally {
      setLoading(false);
    }
  };

  const loadOcupaciones = async () => {
    try {
      setLoading(true);
      setError('');
      
      const filtros = {
        id_periodo_academico: selectedPeriodo
      };
      
      if (selectedDia !== '') {
        filtros.dia_semana = parseInt(selectedDia, 10);
      }
      
      const data = await disponibilidadService.getOcupaciones(salon.id_salon, filtros);
      setOcupaciones(data);
    } catch (err) {
      setError(err.message || 'Error al cargar ocupaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleOcupacionCreated = () => {
    setShowForm(false);
    setSuccessMessage('✅ Horario bloqueado correctamente');
    setRefreshTrigger(prev => prev + 1);
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleDeleteOcupacion = async (idOcupacion) => {
    try {
      setError('');
      await disponibilidadService.deleteOcupacion(idOcupacion);
      setSuccessMessage('✅ Bloqueo eliminado correctamente');
      setRefreshTrigger(prev => prev + 1);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (err) {
      setError(err.message || 'Error al eliminar bloqueo');
      setTimeout(() => {
        setError('');
      }, 5000);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setError('');
  };

  return (
    <div className="disponibilidad-management">
      <div className="disponibilidad-header">
        <div>
          <button onClick={onBack} className="btn-back">
            ← Volver a Salones
          </button>
          <h2>📅 Gestión de Disponibilidad Horaria</h2>
          <p className="disponibilidad-subtitle">
            Salón: <strong>{salon.codigo_salon}</strong>
            {salon.nombre_salon && ` - ${salon.nombre_salon}`}
          </p>
        </div>
        
        {!showForm && (
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            🚫 Bloquear Horario
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

      {showForm ? (
        <DisponibilidadForm
          salon={salon}
          onOcupacionCreated={handleOcupacionCreated}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <div className="disponibilidad-filters">
            <div className="filter-group">
              <label htmlFor="filter-periodo">
                <span className="label-icon">📅</span>
                Periodo Académico:
              </label>
              <select
                id="filter-periodo"
                value={selectedPeriodo}
                onChange={(e) => setSelectedPeriodo(e.target.value)}
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

            <div className="filter-group">
              <label htmlFor="filter-dia">
                <span className="label-icon">📆</span>
                Filtrar por día:
              </label>
              <select
                id="filter-dia"
                value={selectedDia}
                onChange={(e) => setSelectedDia(e.target.value)}
                disabled={loading}
              >
                <option value="">Todos los días</option>
                {Object.entries(DIAS_SEMANA_MAP).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando disponibilidad...</p>
            </div>
          ) : (
            <DisponibilidadCalendar
              ocupaciones={ocupaciones}
              onDeleteOcupacion={handleDeleteOcupacion}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DisponibilidadManagement;