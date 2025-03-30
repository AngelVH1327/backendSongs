import React, { useEffect, useState } from 'react';

// Función para decodificar entidades HTML
const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const SongDetails = ({ song, onClose, isFavorite, onToggleFavorite, onDelete }) => {
    const [isVisible, setIsVisible] = useState(false);
    
    // Asignar una imagen de portada por defecto si no hay una
    const coverImage = song.coverImage || `https://placehold.co/400x400/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0))}`;
    
    useEffect(() => {
        // Al montar el componente, iniciamos la animación después de un breve delay
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 50);
        
        // Agregar clase al body para evitar scroll
        document.body.classList.add('overflow-hidden');
        
        return () => {
            clearTimeout(timer);
            // Remover clase al desmontar
            document.body.classList.remove('overflow-hidden');
        };
    }, []);
    
    const handleClose = () => {
        setIsVisible(false);
        // Esperamos a que termine la animación antes de llamar a onClose
        setTimeout(onClose, 300);
    };
    
    return (
        <div 
            className="modal-backdrop show fixed-top fixed-bottom d-flex align-items-center justify-content-center" 
            style={{ 
                display: 'flex', 
                background: 'rgba(0,0,0,0.85)', 
                transition: 'opacity 0.3s ease-in-out',
                opacity: isVisible ? 1 : 0,
                zIndex: 1050
            }} 
            onClick={handleClose}
        >
            <div 
                className="modal-dialog modal-lg modal-dialog-centered" 
                onClick={e => e.stopPropagation()}
                style={{ 
                    cursor: 'default',
                    transition: 'all 0.3s ease-in-out',
                    transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
                    opacity: isVisible ? 1 : 0,
                    maxWidth: '800px',
                    width: '100%',
                    margin: '0 auto'
                }}
            >
                <div className="modal-content bg-dark text-white border-0 shadow-lg">
                    <div className="modal-header border-secondary">
                        <h5 className="modal-title">Detalles de la canción</h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={handleClose}
                            aria-label="Cerrar"
                        ></button>
                    </div>
                    
                    <div className="modal-body">
                        <div className="row g-4">
                            <div className="col-md-5 text-center mb-3">
                                <div className="position-relative">
                                    <img 
                                        src={coverImage} 
                                        alt={`Portada de ${decodeHTML(song.title)}`} 
                                        className="img-fluid rounded shadow-sm"
                                        style={{ 
                                            width: '100%',
                                            aspectRatio: '1/1',
                                            objectFit: 'cover',
                                            transition: 'transform 0.2s',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                        }}
                                        onMouseOver={(e) => e.target.style.transform = 'scale(1.03)'}
                                        onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://placehold.co/400x400/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0) || 'M')}`;
                                        }}
                                    />
                                </div>
                                <div className="d-flex justify-content-center gap-2 mt-4">
                                    <button 
                                        className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} btn-lg py-2 px-4`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleFavorite(song._id);
                                        }}
                                    >
                                        {isFavorite ? '❤️ Favorito' : '🤍 Añadir a favoritos'}
                                    </button>
                                    <button 
                                        className="btn btn-outline-danger btn-lg py-2 px-4"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm('¿Estás seguro de que deseas eliminar esta canción?')) {
                                                onDelete(song._id);
                                                handleClose();
                                            }
                                        }}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                            
                            <div className="col-md-7">
                                <h2 className="display-5 fw-bold">{decodeHTML(song.title)}</h2>
                                <h4 className="text-success mb-4">{decodeHTML(song.artist)}</h4>
                                
                                <div className="song-details">
                                    <div className="row mb-3 py-2 border-bottom border-secondary">
                                        <div className="col-4 text-secondary">Álbum:</div>
                                        <div className="col-8 fw-bold">{decodeHTML(song.album) || 'Sin álbum'}</div>
                                    </div>
                                    
                                    <div className="row mb-3 py-2 border-bottom border-secondary">
                                        <div className="col-4 text-secondary">Género:</div>
                                        <div className="col-8 fw-bold">{decodeHTML(song.genre) || 'Sin género'}</div>
                                    </div>
                                    
                                    <div className="row mb-3 py-2 border-bottom border-secondary">
                                        <div className="col-4 text-secondary">Año:</div>
                                        <div className="col-8 fw-bold">{song.year || 'Desconocido'}</div>
                                    </div>
                                    
                                    <div className="row mb-3 py-2 border-bottom border-secondary">
                                        <div className="col-4 text-secondary">Duración:</div>
                                        <div className="col-8 fw-bold">{song.duration || '--:--'}</div>
                                    </div>
                                    
                                    <div className="row mb-3 py-2">
                                        <div className="col-4 text-secondary">Añadido:</div>
                                        <div className="col-8 fw-bold">
                                            {new Date(song.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-footer border-secondary">
                        <button type="button" className="btn btn-secondary px-4" onClick={handleClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongDetails;