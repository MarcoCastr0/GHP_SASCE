// src/pages/SalonManagement/SalonManagement.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { salonService } from '../../services/salonService';
import SalonList from './SalonList';
import SalonForm from './SalonForm';
import './SalonManagement.css';

const SalonManagement = () => {
  const { currentUser } = useAuth();
  const [salones, setSalones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  // Verificar si el usuario es coordinador de infraestructura (id_rol === 3)
  const isCoordinadorInfra = currentUser?.id_rol === 3;

  useEffect(() => {
    if (!isCoordinadorInfra) {
      setError('Solo los coordinadores de infraestructura pueden acceder a esta sección');
      setLoading(false);
      return;
    }
    loadSalones();
  }, [isCoordinadorInfra, refreshTrigger]);

  const loadSalones = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await salonService.getSalones();
      setSalones(data);
    } catch (err) {
      setError(err.message || 'Error al cargar salones');
    } finally {
      setLoading(false);
    }
  };

  const handleSalonCreated = () => {
    setShowForm(false);
    setSuccessMessage('✅ Salón registrado exitosamente');
    setRefreshTrigger(prev => prev + 1);
    
    // Limpiar mensaje de éxito después de 5 segundos
    setTimeout(() => {
      setSuccessMessage('');
    }, 5000);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setError('');
  };

  if (!isCoordinadorInfra) {
    return (
      <div className="salon-management">
        <div className="error-container">
          <h2>🚫 Acceso Denegado</h2>
          <p>Solo los coordinadores de infraestructura pueden gestionar salones</p>
        </div>
      </div>
    );
  }

  return (
    <div className="salon-management">
      <div className="salon-management-header">
        <div className="header-title">
          <h1>🏢 Gestión de Salones</h1>
          <p className="header-subtitle">
            Administre y registre salones y sus recursos
          </p>
        </div>
        
        {!showForm && (
          <button 
            className="btn-primary btn-create"
            onClick={() => setShowForm(true)}
          >
            ➕ Registrar Nuevo Salón
          </button>
        )}
      </div>

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      {/* Mensaje de error general */}
      {error && !showForm && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          {error}
        </div>
      )}

      {/* Formulario de registro */}
      {showForm && (
        <SalonForm 
          onSalonCreated={handleSalonCreated}
          onCancel={handleCancelForm}
        />
      )}

      {/* Lista de salones */}
      {!showForm && (
        <>
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Cargando salones...</p>
            </div>
          ) : (
            <SalonList salones={salones} />
          )}
        </>
      )}
    </div>
  );
};

export default SalonManagement;