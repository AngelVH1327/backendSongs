import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);
  
  const { email, password } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const result = await login(formData);
    
    setIsLoading(false);
    
    if (!result.success) {
      setError(result.error);
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
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={onSubmit}>
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
            <div className="mb-4">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control bg-dark text-white"
                id="password"
                name="password"
                value={password}
                onChange={onChange}
                required
                placeholder="Ingresa tu contraseña"
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