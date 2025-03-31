import React, { useEffect, useState, useContext, useRef } from 'react';
import { getSongs, deleteSong } from '../api';
import AuthContext from '../context/AuthContext';
import SearchBar from './SearchBar';
import SongCard from './SongCard';
import SongDetails from './SongDetails';
import SortSelector from './SortSelector';

// Función para decodificar entidades HTML
const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const SongList = () => {
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSong, setSelectedSong] = useState(null);
    const [notification, setNotification] = useState(null);
    const [view, setView] = useState('grid'); // 'grid' o 'list'
    const [animateItems, setAnimateItems] = useState(false);
    const [sortBy, setSortBy] = useState('title'); // Ordenación por defecto por título
    
    const containerRef = useRef(null);
    
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
            // Iniciar animación después de cargar datos
            setTimeout(() => setAnimateItems(true), 100);
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
            if (selectedSong && selectedSong._id === id) {
                setSelectedSong(null);
            }
            showNotification('Canción eliminada correctamente', 'success');
            fetchSongs();
        } catch (err) {
            setError('Error al eliminar la canción');
            showNotification('Error al eliminar la canción', 'error');
        }
    };
    
    const handleToggleFavorite = async (id) => {
        // Verificar si ya está en favoritos
        const isFavorite = favorites.includes(id);
        
        let result;
        if (isFavorite) {
            result = await removeFromFavorites(id);
            if (result.success) {
                showNotification('Eliminada de favoritos', 'info');
            }
        } else {
            result = await addToFavorites(id);
            if (result.success) {
                showNotification('Añadida a favoritos', 'success');
            }
        }
        
        if (result.success) {
            fetchFavorites();
        } else {
            setError(result.error);
            showNotification(result.error, 'error');
        }
    };
    
    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    };
    
    const handleSongUpdated = () => {
        fetchSongs();
        showNotification('Canción actualizada correctamente', 'success');
    };
    
    const handleSortChange = (sortOption) => {
        setSortBy(sortOption);
        showNotification(`Ordenado por ${sortOption === 'title' ? 'título' : sortOption === 'artist' ? 'artista' : 'álbum'}`, 'info');
    };

    // Filtrar canciones según la búsqueda
    const filteredSongs = songs.filter(song => {
        const searchLower = searchTerm.toLowerCase();
        return (
            decodeHTML(song.title).toLowerCase().includes(searchLower) ||
            decodeHTML(song.artist).toLowerCase().includes(searchLower) ||
            decodeHTML(song.album).toLowerCase().includes(searchLower) ||
            (song.genre && decodeHTML(song.genre).toLowerCase().includes(searchLower))
        );
    });
    
    // Ordenar canciones según el criterio seleccionado
    const sortedSongs = [...filteredSongs].sort((a, b) => {
        // Decodificar texto para comparar correctamente
        const valueA = sortBy === 'title' ? decodeHTML(a.title).toLowerCase() : 
                      sortBy === 'artist' ? decodeHTML(a.artist).toLowerCase() : 
                      decodeHTML(a.album).toLowerCase();
        const valueB = sortBy === 'title' ? decodeHTML(b.title).toLowerCase() : 
                      sortBy === 'artist' ? decodeHTML(b.artist).toLowerCase() : 
                      decodeHTML(b.album).toLowerCase();
        
        return valueA.localeCompare(valueB);
    });
    
    if (loading) {
        return (
            <div className="container d-flex flex-column justify-content-center align-items-center my-5" style={{ minHeight: '60vh' }}>
                <div className="spinner-grow text-success mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="text-center text-secondary animate__animated animate__fadeIn animate__delay-1s">
                    Cargando tu biblioteca musical...
                </p>
            </div>
        );
    }

    return (
        <div className="container mt-4" ref={containerRef}>
            <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
                <h2 className="mb-3 mb-md-0 text-gradient">Biblioteca de Música</h2>
                <div className="d-flex gap-3 align-items-center flex-wrap">
                    <SortSelector currentSort={sortBy} onSortChange={handleSortChange} />
                    <div className="view-toggle ms-2">
                        <div className="btn-group" role="group">
                            <button 
                                type="button" 
                                className={`btn btn-sm ${view === 'grid' ? 'btn-success' : 'btn-dark'}`}
                                onClick={() => setView('grid')}
                            >
                                <i className="bi bi-grid-3x3-gap-fill"></i>
                            </button>
                            <button 
                                type="button" 
                                className={`btn btn-sm ${view === 'list' ? 'btn-success' : 'btn-dark'}`}
                                onClick={() => setView('list')}
                            >
                                <i className="bi bi-list-ul"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            {error && (
                <div className="alert alert-danger animate__animated animate__fadeIn" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                </div>
            )}
            
            {notification && (
                <div className={`notification animate__animated animate__fadeInRight ${notification.type}`}>
                    <div className="d-flex align-items-center">
                        <i className={`bi ${notification.type === 'success' ? 'bi-check-circle-fill' : 
                                           notification.type === 'error' ? 'bi-exclamation-triangle-fill' : 
                                           'bi-info-circle-fill'} me-2`}></i>
                        {notification.message}
                    </div>
                </div>
            )}
            
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            {selectedSong && (
                <SongDetails 
                    song={selectedSong} 
                    onClose={() => setSelectedSong(null)}
                    isFavorite={favorites.includes(selectedSong._id)}
                    onToggleFavorite={handleToggleFavorite}
                    onDelete={handleDelete}
                    onSongUpdated={handleSongUpdated}
                />
            )}
            
            {sortedSongs.length === 0 ? (
                <div className="card bg-dark text-white text-center p-5 animate__animated animate__fadeIn">
                    <div className="empty-state">
                        <i className="bi bi-music-note-list empty-icon mb-3"></i>
                        <h3 className="mb-3">
                            {searchTerm ? 'No se encontraron canciones' : 'No hay canciones disponibles'}
                        </h3>
                        <p className="lead">
                            {searchTerm 
                                ? 'Intenta con otros términos de búsqueda'
                                : 'Usa el formulario para agregar tu primera canción'
                            }
                        </p>
                    </div>
                </div>
            ) : view === 'grid' ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {sortedSongs.map((song, index) => (
                        <div 
                            className={`col animate__animated ${animateItems ? 'animate__fadeInUp' : ''}`} 
                            key={song._id}
                            style={{ 
                                animationDelay: `${index * 0.05}s`,
                                opacity: animateItems ? 1 : 0
                            }}
                        >
                            <SongCard 
                                song={song} 
                                onClick={() => setSelectedSong(song)}
                                isFavorite={favorites.includes(song._id)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th style={{ width: '60px' }}></th>
                                <th>Título</th>
                                <th>Artista</th>
                                <th>Álbum</th>
                                <th>Duración</th>
                                <th style={{ width: '120px' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSongs.map((song, index) => (
                                <tr 
                                    key={song._id}
                                    className={`animate__animated ${animateItems ? 'animate__fadeIn' : ''}`}
                                    style={{ 
                                        animationDelay: `${index * 0.03}s`,
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setSelectedSong(song)}
                                >
                                    <td className="align-middle">{index + 1}</td>
                                    <td>
                                        <div 
                                            className="cover-mini"
                                            style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '4px',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <img 
                                                src={song.coverImage || `https://placehold.co/200x200/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0))}`}
                                                alt="Cover" 
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = `https://placehold.co/200x200/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0) || 'M')}`;
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="align-middle">{decodeHTML(song.title)}</td>
                                    <td className="align-middle">{decodeHTML(song.artist)}</td>
                                    <td className="align-middle">{decodeHTML(song.album) || '-'}</td>
                                    <td className="align-middle year-duration-text">{song.duration || '--:--'}</td>
                                    <td className="align-middle">
                                        <button 
                                            className={`btn btn-sm ${favorites.includes(song._id) ? 'btn-danger' : 'btn-outline-danger'} me-1`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggleFavorite(song._id);
                                            }}
                                            title={favorites.includes(song._id) ? "Quitar de favoritos" : "Añadir a favoritos"}
                                        >
                                            <i className={`bi ${favorites.includes(song._id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('¿Estás seguro de que deseas eliminar esta canción?')) {
                                                    handleDelete(song._id);
                                                }
                                            }}
                                            title="Eliminar canción"
                                        >
                                            <i className="bi bi-trash"></i>
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