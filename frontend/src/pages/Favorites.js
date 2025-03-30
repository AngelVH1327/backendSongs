import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';

// Función para decodificar entidades HTML
const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { getFavorites, removeFromFavorites } = useContext(AuthContext);
    
    const loadFavorites = async () => {
        setLoading(true);
        const result = await getFavorites();
        
        if (result.success) {
            setFavorites(result.data);
            setError('');
        } else {
            setError('Error al cargar tus canciones favoritas');
        }
        
        setLoading(false);
    };
    
    useEffect(() => {
        loadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const handleRemoveFavorite = async (id) => {
        const result = await removeFromFavorites(id);
        
        if (result.success) {
            // Actualizar la lista de favoritos
            loadFavorites();
        } else {
            setError('Error al eliminar de favoritos');
        }
    };
    
    if (loading) {
        return (
            <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }
    
    return (
        <div className="container mt-4 mb-5">
            <h2 className="text-center text-white mb-4">
                <span className="text-success">❤️</span> Mis Canciones Favoritas
            </h2>
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            
            {favorites.length === 0 ? (
                <div className="card bg-dark text-white text-center p-5">
                    <h3 className="mb-3">No tienes canciones favoritas</h3>
                    <p className="lead">
                        Agrega canciones a tus favoritos para verlas aquí
                    </p>
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover shadow">
                        <thead className="table-dark">
                            <tr>
                                <th>Título</th>
                                <th>Artista</th>
                                <th>Álbum</th>
                                <th>Género</th>
                                <th>Año</th>
                                <th>Duración</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {favorites.map(song => (
                                <tr key={song._id}>
                                    <td>{decodeHTML(song.title)}</td>
                                    <td>{decodeHTML(song.artist)}</td>
                                    <td>{decodeHTML(song.album)}</td>
                                    <td>{decodeHTML(song.genre)}</td>
                                    <td>{song.year}</td>
                                    <td>{song.duration}</td>
                                    <td>
                                        <button 
                                            className="btn btn-danger btn-sm" 
                                            onClick={() => handleRemoveFavorite(song._id)}
                                        >
                                            ❌ Quitar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Favorites;