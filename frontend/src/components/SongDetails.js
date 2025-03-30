import React, { useEffect, useState } from 'react';
import EditSongForm from './EditSongForm';

// Función para decodificar entidades HTML
const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const SongDetails = ({ song, onClose, isFavorite, onToggleFavorite, onDelete, onSongUpdated }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    
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
    
    const handleEdit = () => {
        setShowEditForm(true);
    };
    
    const handleUpdateSuccess = () => {
        setShowEditForm(false);
        if (onSongUpdated) {
            onSongUpdated();
        }
    };

    if (showEditForm) {
        return <EditSongForm 
            song={song} 
            onClose={() => setShowEditForm(false)} 
            onSongUpdated={handleUpdateSuccess} 
        />;
    }
    
    return (
        <div 
            className="modal-backdrop show fixed-top fixed-bottom d-flex align-items-center justify-content-center" 
            style={{ 
                display: 'flex', 
                background: 'rgba(0,0,0,0.85)', 
                backdropFilter: 'blur(8px)',
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
                    transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55)',
                    transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)',
                    opacity: isVisible ? 1 : 0,
                    maxWidth: '800px',
                    width: '100%',
                    margin: '0 auto'
                }}
            >
                <div className="modal-content bg-dark text-white border-0 shadow-lg" 
                    style={{ 
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }}
                >
                    <div className="modal-header border-secondary position-relative py-3">
                        <h5 className="modal-title">
                            <i className="bi bi-music-note-beamed me-2 text-success"></i>
                            Detalles de la canción
                        </h5>
                        <button 
                            type="button" 
                            className="btn-close btn-close-white" 
                            onClick={handleClose}
                            aria-label="Cerrar"
                        ></button>
                    </div>
                    
                    <div className="modal-body p-4">
                        <div className="row g-4">
                            <div className="col-md-5 text-center mb-3">
                                <div 
                                    className="position-relative cover-art-container"
                                    style={{ overflow: 'hidden', borderRadius: '12px' }}
                                    onMouseEnter={() => setIsHovering(true)}
                                    onMouseLeave={() => setIsHovering(false)}
                                >
                                    <img 
                                        src={coverImage} 
                                        alt={`Portada de ${decodeHTML(song.title)}`} 
                                        className="img-fluid rounded shadow-sm"
                                        style={{ 
                                            width: '100%',
                                            aspectRatio: '1/1',
                                            objectFit: 'cover',
                                            transition: 'all 0.5s ease',
                                            transform: isHovering ? 'scale(1.08)' : 'scale(1)',
                                            filter: isHovering ? 'brightness(0.7)' : 'brightness(1)',
                                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `https://placehold.co/400x400/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0) || 'M')}`;
                                        }}
                                    />
                                    {isHovering && (
                                        <div 
                                            className="cover-overlay d-flex justify-content-center align-items-center"
                                            style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                background: 'rgba(0,0,0,0.3)',
                                                opacity: isHovering ? 1 : 0,
                                                transition: 'opacity 0.3s ease',
                                                zIndex: 1
                                            }}
                                        >
                                            <button 
                                                className="btn btn-success btn-lg rounded-circle pulse-animation"
                                                style={{
                                                    width: '60px',
                                                    height: '60px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <i className="bi bi-play-fill fs-2"></i>
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-center gap-2 mt-4">
                                    <button 
                                        className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} px-3 py-2`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggleFavorite(song._id);
                                        }}
                                    >
                                        <i className={`bi ${isFavorite ? 'bi-heart-fill' : 'bi-heart'} me-2`}></i>
                                        {isFavorite ? 'Favorito' : 'Añadir a favoritos'}
                                    </button>
                                    <div className="dropdown">
                                        <button 
                                            className="btn btn-dark border-secondary px-3 py-2 dropdown-toggle"
                                            type="button"
                                            data-bs-toggle="dropdown"
                                            aria-expanded="false"
                                        >
                                            <i className="bi bi-three-dots-vertical"></i>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-dark">
                                            <li>
                                                <button 
                                                    className="dropdown-item" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit();
                                                    }}
                                                >
                                                    <i className="bi bi-pencil-square me-2"></i>
                                                    Editar
                                                </button>
                                            </li>
                                            <li>
                                                <button 
                                                    className="dropdown-item text-danger" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (window.confirm('¿Estás seguro de que deseas eliminar esta canción?')) {
                                                            onDelete(song._id);
                                                            handleClose();
                                                        }
                                                    }}
                                                >
                                                    <i className="bi bi-trash me-2"></i>
                                                    Eliminar
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-7">
                                <h2 className="display-5 fw-bold song-title-animation">{decodeHTML(song.title)}</h2>
                                <h4 className="text-success mb-4">{decodeHTML(song.artist)}</h4>
                                
                                <div className="song-details">
                                    <div className="row mb-3 py-2 border-bottom border-secondary detail-row">
                                        <div className="col-4 text-secondary">
                                            <i className="bi bi-disc me-2"></i>Álbum:
                                        </div>
                                        <div className="col-8 fw-bold">{decodeHTML(song.album) || 'Sin álbum'}</div>
                                    </div>
                                    
                                    <div className="row mb-3 py-2 border-bottom border-secondary detail-row">
                                        <div className="col-4 text-secondary">
                                            <i className="bi bi-music-note me-2"></i>Género:
                                        </div>
                                        <div className="col-8 fw-bold">{decodeHTML(song.genre) || 'Sin género'}</div>
                                    </div>
                                    
                                    <div className="row mb-3 py-2 border-bottom border-secondary detail-row">
                                        <div className="col-4 text-secondary">
                                            <i className="bi bi-calendar-event me-2"></i>Año:
                                        </div>
                                        <div className="col-8 fw-bold">{song.year || 'Desconocido'}</div>
                                    </div>
                                    
                                    <div className="row mb-3 py-2 border-bottom border-secondary detail-row">
                                        <div className="col-4 text-secondary">
                                            <i className="bi bi-clock me-2"></i>Duración:
                                        </div>
                                        <div className="col-8 fw-bold">{song.duration || '--:--'}</div>
                                    </div>
                                    
                                    <div className="row mb-3 py-2 detail-row">
                                        <div className="col-4 text-secondary">
                                            <i className="bi bi-calendar-plus me-2"></i>Añadido:
                                        </div>
                                        <div className="col-8 fw-bold">
                                            {new Date(song.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="modal-footer border-secondary">
                        <button 
                            type="button" 
                            className="btn btn-secondary px-4 me-2" 
                            onClick={handleClose}
                        >
                            <i className="bi bi-x-lg me-2"></i>
                            Cerrar
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-success px-4" 
                            onClick={handleEdit}
                        >
                            <i className="bi bi-pencil-square me-2"></i>
                            Editar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SongDetails;