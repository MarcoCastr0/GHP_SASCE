// src/pages/Login/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [credentials, setCredentials] = useState({
    correo: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
    // Limpiar error al escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validación básica
    if (!credentials.correo || !credentials.password) {
      setError('Correo y contraseña son requeridos');
      setLoading(false);
      return;
    }

    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.correo)) {
      setError('Formato de correo inválido');
      setLoading(false);
      return;
    }

    try {
      await login(credentials);
      // La redirección se maneja en el useEffect
    } catch (err) {
      console.error('Error en login:', err);
      setError(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !loading) {
      handleSubmit(e);
    }
  };

  return (
    
    <div className="login-container">
      <div className="login-card">
    
        <div className="login-header">
          <div className="login-icon">🎓</div>
          <h1>Sistema de Asignación de Salones</h1>
          <h2>GHP-SASCE</h2>
          
        </div>
        
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
          <div className="form-group">
            <label htmlFor="correo">
              <span className="label-icon">📧</span>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="correo"
              name="correo"
              value={credentials.correo}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="usuario@ejemplo.com"
              autoComplete="email"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <span className="label-icon">🔒</span>
              Contraseña
            </label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                disabled={loading}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                disabled={loading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Iniciando sesión...
              </>
            ) : (
              <>
                <span>🚀</span>
                Iniciar Sesión
              </>
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <div className="info-box">
            <p className="info-title">ℹ️ Información del Sistema</p>
            <ul className="info-list">
              <li>
                <strong>Administrador:</strong> Gestión completa del sistema
              </li>
              <li>
                <strong>Coordinador:</strong> Gestión de grupos de estudiantes
              </li>
              <li>
                <strong>Coordinador Infraestructura:</strong> Gestión de salones
              </li>
            </ul>
          </div>
          
          <p className="version">v1.0.0 - CU1 Implementado</p>
        </div>
      </div>
    </div>
  );
};

export default Login;