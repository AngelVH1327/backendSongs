import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);
  
  const { email, password } = formData;
  
  // Validaciones en tiempo real
  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'El email es obligatorio';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Debe ingresar un email válido';
        return '';
        
      case 'password':
        if (!value) return 'La contraseña es obligatoria';
        return '';
        
      default:
        return '';
    }
  };
  
  const onChange = e => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validar el campo al cambiar
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validar cada campo
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(newErrors);
    return isValid;
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setGeneralError('');
    
    // Validar el formulario completo
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await login(formData);
    
    setIsSubmitting(false);
    
    if (!result.success) {
      setGeneralError(result.error || 'Credenciales inválidas');
    } else {
      navigate('/home');
    }
  };
  
  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '80px' }}>
      <div className="card bg-dark text-white shadow-lg">
        <div className="card-header text-center p-4">
          <h2><span className="text-success">🎵</span> Iniciar Sesión</h2>
        </div>
        <div className="card-body p-4">
          {generalError && (
            <div className="alert alert-danger" role="alert">
              {generalError}
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className={`form-control bg-dark text-white ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Ingresa tu email"
                autoComplete="email"
              />
              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className={`form-control bg-dark text-white ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 py-2"
              disabled={isSubmitting || Object.values(errors).some(error => error)}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Cargando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>
        </div>
        <div className="card-footer text-center p-3">
          <p className="mb-0">
            ¿No tienes cuenta? <Link to="/register" className="text-success">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;