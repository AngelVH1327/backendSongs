import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Welcome = () => {
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="container-fluid welcome-container" style={{
      minHeight: 'calc(100vh - 56px)',
      background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <div className="welcome-text p-4">
              <h1 className="display-4 text-white mb-4">
                Bienvenido a <span className="text-success">MusicApp</span>
              </h1>
              <p className="lead text-light mb-4">
                Tu plataforma para descubrir, organizar y disfrutar de tu música favorita.
                Crea tu cuenta y empieza a coleccionar tus canciones preferidas.
              </p>
              <div className="d-flex gap-3">
                <Link to="/register" className="btn btn-success btn-lg">
                  Registrarse
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg">
                  Iniciar Sesión
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="welcome-image p-4 text-center">
              <div className="music-icon" style={{
                fontSize: '150px',
                color: '#1db954',
                textShadow: '0 0 10px rgba(29, 185, 84, 0.5)'
              }}>
                🎵
              </div>
              <div className="mt-4 text-white">
                <h3>Características:</h3>
                <ul className="list-unstyled text-start">
                  <li className="mb-2">✅ Guarda tus canciones favoritas</li>
                  <li className="mb-2">✅ Organiza tu colección personal</li>
                  <li className="mb-2">✅ Descubre nueva música</li>
                  <li className="mb-2">✅ Interfaz inspirada en Spotify</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;