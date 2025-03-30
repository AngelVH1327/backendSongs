import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');
  
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);
  
  const { username, email, password, password2 } = formData;
  
  // Validaciones en tiempo real
  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'El nombre de usuario es obligatorio';
        if (value.length < 3) return 'El nombre debe tener al menos 3 caracteres';
        if (value.length > 30) return 'El nombre no puede exceder 30 caracteres';
        if (!/^[a-zA-Z0-9]+$/.test(value)) return 'Solo letras y números permitidos';
        return '';
        
      case 'email':
        if (!value.trim()) return 'El email es obligatorio';
        if (!/\S+@\S+\.\S+/.test(value)) return 'El email debe ser válido';
        return '';
        
      case 'password':
        if (!value) return 'La contraseña es obligatoria';
        if (value.length < 8) return 'La contraseña debe tener al menos 8 caracteres';
        
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);
        const hasNumbers = /\d/.test(value);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        
        if (!hasUpperCase) return 'Debe incluir al menos una mayúscula';
        if (!hasLowerCase) return 'Debe incluir al menos una minúscula';
        if (!hasNumbers) return 'Debe incluir al menos un número';
        if (!hasSpecialChar) return 'Debe incluir al menos un caracter especial (!@#$%^&*(),.?":{}|<>)';
        
        return '';
        
      case 'password2':
        if (!value) return 'Confirme su contraseña';
        if (value !== password) return 'Las contraseñas no coinciden';
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
    
    // Si estamos validando password2, también debemos re-validarlo cuando cambie password
    if (name === 'password' && formData.password2) {
      const password2Error = validateField('password2', formData.password2);
      setErrors(prev => ({
        ...prev,
        password2: password2Error
      }));
    }
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
  
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    let text, color;
    switch (strength) {
      case 0:
      case 1:
        text = 'Muy débil';
        color = 'danger';
        break;
      case 2:
        text = 'Débil';
        color = 'warning';
        break;
      case 3:
        text = 'Media';
        color = 'warning';
        break;
      case 4:
        text = 'Fuerte';
        color = 'success';
        break;
      case 5:
        text = 'Muy fuerte';
        color = 'success';
        break;
      default:
        text = '';
        color = '';
    }
    
    return { strength, text, color };
  };
  
  const passwordStrength = getPasswordStrength(password);
  
  const onSubmit = async e => {
    e.preventDefault();
    setGeneralError('');
    
    // Validar el formulario completo
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    const result = await register({
      username,
      email,
      password
    });
    
    setIsSubmitting(false);
    
    if (!result.success) {
      setGeneralError(result.error);
    } else {
      navigate('/home');
    }
  };
  
  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '60px' }}>
      <div className="card bg-dark text-white shadow-lg">
        <div className="card-header text-center p-4">
          <h2><span className="text-success">🎵</span> Crear Cuenta</h2>
        </div>
        <div className="card-body p-4">
          {generalError && (
            <div className="alert alert-danger" role="alert">
              {generalError}
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nombre de usuario *</label>
              <input
                type="text"
                className={`form-control bg-dark text-white ${errors.username ? 'is-invalid' : ''}`}
                id="username"
                name="username"
                value={username}
                onChange={onChange}
                required
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username}
                </div>
              )}
              <small className="form-text text-muted">
                Solo letras y números, mínimo 3 caracteres.
              </small>
            </div>
            
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email *</label>
              <input
                type="email"
                className={`form-control bg-dark text-white ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              )}
            </div>
            
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña *</label>
              <input
                type="password"
                className={`form-control bg-dark text-white ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password}
                </div>
              )}
              
              {password && (
                <div className="mt-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className={`text-${passwordStrength.color}`}>
                      Seguridad: {passwordStrength.text}
                    </small>
                    <div className="progress" style={{ height: '8px', width: '70%' }}>
                      <div 
                        className={`progress-bar bg-${passwordStrength.color}`} 
                        role="progressbar" 
                        style={{ width: `${passwordStrength.strength * 20}%` }} 
                        aria-valuenow={passwordStrength.strength * 20} 
                        aria-valuemin="0" 
                        aria-valuemax="100">
                      </div>
                    </div>
                  </div>
                  <small className="form-text text-muted d-block mt-1">
                    Debe contener al menos: 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial.
                  </small>
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password2" className="form-label">Confirmar Contraseña *</label>
              <input
                type="password"
                className={`form-control bg-dark text-white ${errors.password2 ? 'is-invalid' : ''}`}
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                required
              />
              {errors.password2 && (
                <div className="invalid-feedback">
                  {errors.password2}
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
                  Procesando...
                </>
              ) : (
                'Registrarse'
              )}
            </button>
          </form>
        </div>
        <div className="card-footer text-center p-3">
          <p className="mb-0">
            ¿Ya tienes cuenta? <Link to="/login" className="text-success">Inicia Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;