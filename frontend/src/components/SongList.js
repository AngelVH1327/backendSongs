import React, { useEffect, useState, useContext } from 'react';
import { getSongs, deleteSong } from '../api';
import AuthContext from '../context/AuthContext';

const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const { addToFavorites, removeFromFavorites, getFavorites } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);

    const fetchFavorites = async () => {
        const result = await getFavorites();
        if (result.success) {
            // Crear un arreglo con solo los IDs para facilitar la búsqueda
            const favoriteIds = result.data.map(song => song._id);
            setFavorites(favoriteIds);
        }
    };

    const fetchSongs = async () => {
        try {
            setLoading(true);
            const data = await getSongs();
            setSongs(data);
            setError('');
        } catch (err) {
            setError('Error al cargar las canciones');
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        fetchSongs();
        fetchFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteSong(id);
            fetchSongs();
        } catch (err) {
            setError('Error al eliminar la canción');
        }
    };
    
    const handleToggleFavorite = async (id) => {
        // Verificar si ya está en favoritos
        const isFavorite = favorites.includes(id);
        
        let result;
        if (isFavorite) {
            result = await removeFromFavorites(id);
        } else {
            result = await addToFavorites(id);
        }
        
        if (result.success) {
            fetchFavorites();
        } else {
            setError(result.error);
        }
    };
    
    if (loading) {
        return (
            <div className="container d-flex justify-content-center my-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="text-center">Lista de Canciones</h2>
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}
            
            {songs.length === 0 ? (
                <div className="card bg-dark text-white text-center p-5">
                    <h3 className="mb-3">No hay canciones disponibles</h3>
                    <p className="lead">
                        Usa el formulario para agregar tu primera canción
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
                            {songs.map(song => (
                                <tr key={song._id}>
                                    <td>{song.title}</td>
                                    <td>{song.artist}</td>
                                    <td>{song.album}</td>
                                    <td>{song.genre}</td>
                                    <td>{song.year}</td>
                                    <td>{song.duration}</td>
                                    <td className="d-flex gap-2">
                                        <button 
                                            className={`btn btn-sm ${favorites.includes(song._id) ? 'btn-danger' : 'btn-outline-danger'}`} 
                                            onClick={() => handleToggleFavorite(song._id)}
                                            title={favorites.includes(song._id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                        >
                                            {favorites.includes(song._id) ? '❤️' : '🤍'}
                                        </button>
                                        <button 
                                            className="btn btn-danger btn-sm" 
                                            onClick={() => handleDelete(song._id)}
                                            title="Eliminar canción"
                                        >
                                            🗑️ 
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

export default SongList;
