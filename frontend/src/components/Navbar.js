import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const authLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/home">Inicio</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/favorites">Mis Favoritos</Link>
      </li>
      <li className="nav-item">
        <button 
          onClick={handleLogout} 
          className="btn btn-link nav-link" 
          style={{ border: 'none', background: 'none', padding: 0 }}
        >
          Cerrar Sesión
        </button>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li className="nav-item">
        <Link className="nav-link" to="/login">Iniciar Sesión</Link>
      </li>
      <li className="nav-item">
        <Link className="nav-link" to="/register">Registrarse</Link>
      </li>
    </>
  );

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#151515' }}>
      <div className="container">
        <Link className="navbar-brand" to={isAuthenticated ? '/home' : '/'}>
          <span className="text-success">🎵</span> MusicApp
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
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? authLinks : guestLinks}
          </ul>
        </div>
        {isAuthenticated && user && (
          <span className="navbar-text ms-3 text-success">
            Hola, {user.username}
          </span>
        )}
      </div>
    </nav>
  );
};

export default Navbar;