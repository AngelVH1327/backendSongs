import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Welcome.css'; // Importamos un nuevo archivo CSS específico

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
    <div className="welcome-container">
      {/* Hero section con gradiente y mensaje principal */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Música sin límites</h1>
          <p className="hero-subtitle">
            Tu biblioteca musical personalizada, donde y cuando quieras
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn-primary">
              Comenzar ahora
            </Link>
            <Link to="/login" className="btn-secondary">
              Iniciar Sesión
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="album-grid">
            <div className="album-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60')" }}></div>
            <div className="album-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60')" }}></div>
            <div className="album-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OHx8bXVzaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60')" }}></div>
            <div className="album-cover" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bXVzaWN8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60')" }}></div>
          </div>
        </div>
      </section>

      {/* Sección de características */}
      <section className="features-section">
        <h2 className="section-title">Descubre MusicApp</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-music-note-list"></i>
            </div>
            <h3>Organiza tu colección</h3>
            <p>Guarda todas tus canciones favoritas en un solo lugar, organizadas como tú prefieras.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-heart-fill"></i>
            </div>
            <h3>Crea tus favoritos</h3>
            <p>Marca las canciones que más te gustan y accede rápidamente a tu música preferida.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-search"></i>
            </div>
            <h3>Busca sin esfuerzo</h3>
            <p>Encuentra cualquier canción, artista o álbum con nuestro potente buscador integrado.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <i className="bi bi-device-ssd"></i>
            </div>
            <h3>Accede desde cualquier lugar</h3>
            <p>Tu biblioteca te sigue allá donde vayas, desde cualquier dispositivo.</p>
          </div>
        </div>
      </section>

      {/* Call to action final */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>¿Listo para comenzar?</h2>
          <p>Únete a miles de amantes de la música que ya organizan su colección con MusicApp</p>
          <Link to="/register" className="btn-primary">Crear cuenta gratis</Link>
        </div>
      </section>
    </div>
  );
};

export default Welcome;