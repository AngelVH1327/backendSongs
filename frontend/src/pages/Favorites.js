import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';
import SongDetails from '../components/SongDetails';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSong, setSelectedSong] = useState(null);
    
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
            
            // Cerrar el modal si está abierto
            if (selectedSong && selectedSong._id === id) {
                setSelectedSong(null);
            }
        } else {
            setError('Error al eliminar de favoritos');
        }
    };
    
    // Filtrar favoritos según la búsqueda
    const filteredFavorites = favorites.filter(song => {
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
            
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            
            {selectedSong && (
                <SongDetails 
                    song={selectedSong} 
                    onClose={() => setSelectedSong(null)}
                    isFavorite={true}
                    onToggleFavorite={handleRemoveFavorite}
                    onDelete={() => {}} // No permitimos eliminar, solo quitar de favoritos
                />
            )}
            
            {filteredFavorites.length === 0 ? (
                <div className="card bg-dark text-white text-center p-5">
                    <h3 className="mb-3">
                        {searchTerm ? 'No se encontraron canciones favoritas' : 'No tienes canciones favoritas'}
                    </h3>
                    <p className="lead">
                        {searchTerm 
                            ? 'Intenta con otros términos de búsqueda'
                            : 'Agrega canciones a tus favoritos para verlas aquí'
                        }
                    </p>
                </div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {filteredFavorites.map(song => (
                        <div className="col" key={song._id}>
                            <SongCard 
                                song={song} 
                                onClick={() => setSelectedSong(song)}
                                isFavorite={true}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;