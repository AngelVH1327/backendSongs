import React from 'react';

// Función para decodificar entidades HTML
const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const SongDetails = ({ song, onClose, isFavorite, onToggleFavorite, onDelete }) => {
    // Asignar una imagen de portada por defecto si no hay una
    const coverImage = song.coverImage || `https://placehold.co/400x400/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0))}`;
    
    return (
        <div className="modal-backdrop show" style={{ display: 'block', background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
            <div 
                className="modal-dialog modal-lg modal-dialog-centered" 
                onClick={e => e.stopPropagation()}
                style={{ cursor: 'default' }}
            >
                <div className="modal-content bg-dark text-white">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title">Detalles de la canción</h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>
                    
                    <div className="modal-body">
                        <div className="row">
                            <div className="col-md-5 text-center mb-3">
                                <img 
                                    src={coverImage} 
                                    alt={`Portada de ${decodeHTML(song.title)}`} 
                                    className="img-fluid rounded mb-3"
                                    style={{ maxHeight: '300px', objectFit: 'cover' }}
                                />
                                <div className="d-flex justify-content-center gap-2">
                                    <button 
                                        className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'}`}
                                        onClick={() => onToggleFavorite(song._id)}
                                    >
                                        {isFavorite ? '❤️ Favorito' : '🤍 Añadir a favoritos'}
                                    </button>
                                    <button 
                                        className="btn btn-outline-danger"
                                        onClick={() => {
                                            if (window.confirm('¿Estás seguro de que deseas eliminar esta canción?')) {
                                                onDelete(song._id);
                                            }
                                        }}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                            
                            <div className="col-md-7">
                                <h2>{decodeHTML(song.title)}</h2>
                                <h4 className="text-secondary mb-4">{decodeHTML(song.artist)}</h4>
                                
                                <div className="song-details">
                                    <div className="row mb-2">
                                        <div className="col-4 text-secondary">Álbum:</div>
                                        <div className="col-8">{decodeHTML(song.album) || 'Sin álbum'}</div>
                                    </div>
                                    
                                    <div className="row mb-2">
                                        <div className="col-4 text-secondary">Género:</div>
                                        <div className="col-8">{decodeHTML(song.genre) || 'Sin género'}</div>
                                    </div>
                                    
                                    <div className="row mb-2">
                                        <div className="col-4 text-secondary">Año:</div>
                                        <div className="col-8">{song.year || 'Desconocido'}</div>
                                    </div>
                                    
                                    <div className="row mb-2">
                                        <div className="col-4 text-secondary">Duración:</div>
                                        <div className="col-8">{song.duration || '--:--'}</div>
                                    </div>
                                    
                                    <div className="row mb-2">
                                        <div className="col-4 text-secondary">Añadido:</div>
                                        <div className="col-8">
                                            {new Date(song.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-footer border-secondary">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongDetails;