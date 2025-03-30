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
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);
  
  const { username, email, password, password2 } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    
    // Validar que las contraseñas coincidan
    if (password !== password2) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    setIsLoading(true);
    
    const result = await register({
      username,
      email,
      password
    });
    
    setIsLoading(false);
    
    if (!result.success) {
      setError(result.error);
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
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">Nombre de usuario</label>
              <input
                type="text"
                className="form-control bg-dark text-white"
                id="username"
                name="username"
                value={username}
                onChange={onChange}
                required
                minLength="3"
                placeholder="Elige un nombre de usuario"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control bg-dark text-white"
                id="email"
                name="email"
                value={email}
                onChange={onChange}
                required
                placeholder="Ingresa tu email"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control bg-dark text-white"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                minLength="6"
                placeholder="Crea una contraseña (mínimo 6 caracteres)"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password2" className="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                className="form-control bg-dark text-white"
                id="password2"
                name="password2"
                value={password2}
                onChange={onChange}
                required
                minLength="6"
                placeholder="Confirma tu contraseña"
              />
            </div>
            <button
              type="submit"
              className="btn btn-success w-100 py-2"
              disabled={isLoading}
            >
              {isLoading ? (
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