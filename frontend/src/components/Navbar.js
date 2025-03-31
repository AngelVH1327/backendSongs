import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import '../styles/Navbar.css'; // Nuevo archivo CSS específico

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para cambiar el estilo de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const authLinks = (
    <>
      <li className="nav-item">
        <Link className={`nav-link ${isActive('/home') ? 'active' : ''}`} to="/home">
          <i className="bi bi-house-door nav-icon"></i>
          <span>Inicio</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className={`nav-link ${isActive('/favorites') ? 'active' : ''}`} to="/favorites">
          <i className="bi bi-heart nav-icon"></i>
          <span>Favoritos</span>
        </Link>
      </li>
      <li className="nav-item dropdown">
        <button 
          className="nav-link dropdown-toggle" 
          id="navbarDropdown"
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          <i className="bi bi-person-circle nav-icon"></i>
          <span>{user ? user.username : 'Usuario'}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
          <li>
            <button 
              onClick={handleLogout} 
              className="dropdown-item" 
            >
              <i className="bi bi-box-arrow-right me-2"></i>
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item">
        <Link className={`nav-link ${isActive('/login') ? 'active' : ''}`} to="/login">
          <i className="bi bi-box-arrow-in-right nav-icon"></i>
          <span>Iniciar Sesión</span>
        </Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link btn-signup" to="/register">
          <span>Registrarse</span>
        </Link>
      </li>
    </>
  );

  return (
    <nav className={`navbar navbar-expand-lg ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to={isAuthenticated ? '/home' : '/'}>
          <div className="brand-logo">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,3C7.03,3 3,7.03 3,12C3,16.97 7.03,21 12,21C16.97,21 21,16.97 21,12C21,7.03 16.97,3 12,3M16,16V8H13L9,8V16H11V10H12V16H14V10H15V16H16Z"></path>
            </svg>
          </div>
          <span className="brand-text">MusicApp</span>
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <i className="bi bi-list"></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;