import React, { useEffect, useState, useContext } from 'react';
import { getSongs, deleteSong } from '../api';
import AuthContext from '../context/AuthContext';
import SearchBar from './SearchBar';
import SongCard from './SongCard';
import SongDetails from './SongDetails';

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
            if (selectedSong && selectedSong._id === id) {
                setSelectedSong(null);
            }
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
            <h2 className="text-center mb-4">Biblioteca de Música</h2>
            
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
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
                />
            )}
            
            {filteredSongs.length === 0 ? (
                <div className="card bg-dark text-white text-center p-5">
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
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {filteredSongs.map(song => (
                        <div className="col" key={song._id}>
                            <SongCard 
                                song={song} 
                                onClick={() => setSelectedSong(song)}
                                isFavorite={favorites.includes(song._id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SongList;