import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Verificar token al cargar
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        setAuthToken(token);
        try {
          const res = await axios.get('https://backendsongs-93gj.onrender.com/api/auth/me');
          setUser(res.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error(err);
          localStorage.removeItem('token');
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  // Registrar usuario
  const register = async (formData) => {
    try {
      const res = await axios.post('https://backendsongs-93gj.onrender.com/api/auth/register', formData);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Error al registrar usuario' 
      };
    }
  };

  // Iniciar sesión
  const login = async (formData) => {
    try {
      const res = await axios.post('https://backendsongs-93gj.onrender.com/api/auth/login', formData);
      
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Credenciales inválidas' 
      };
    }
  };

  // Cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Añadir canción a favoritos
  const addToFavorites = async (songId) => {
    try {
      await axios.post(`https://backendsongs-93gj.onrender.com/api/favorites/${songId}`);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Error al añadir a favoritos' 
      };
    }
  };

  // Eliminar canción de favoritos
  const removeFromFavorites = async (songId) => {
    try {
      await axios.delete(`https://backendsongs-93gj.onrender.com/api/favorites/${songId}`);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Error al eliminar de favoritos' 
      };
    }
  };

  // Obtener canciones favoritas
  const getFavorites = async () => {
    try {
      const res = await axios.get('https://backendsongs-93gj.onrender.com/api/favorites');
      return { success: true, data: res.data };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.msg || 'Error al obtener favoritos' 
      };
    }
  };

  // Agregar token a los headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        isAuthenticated,
        loading,
        user,
        register,
        login,
        logout,
        addToFavorites,
        removeFromFavorites,
        getFavorites
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;