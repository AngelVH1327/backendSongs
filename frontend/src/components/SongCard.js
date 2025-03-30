import React from 'react';

// Función para decodificar entidades HTML
const decodeHTML = (html) => {
    if (!html) return '';
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
};

const SongCard = ({ song, onClick, isFavorite }) => {
    // Asignar una imagen de portada por defecto si no hay una
    const coverImage = song.coverImage || `https://placehold.co/300x300/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0))}`;
    
    return (
        <div 
            className="card bg-dark text-white h-100 song-card" 
            onClick={onClick}
            style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
            <div className="position-relative">
                <img 
                    src={coverImage} 
                    className="card-img-top" 
                    alt={`Portada de ${decodeHTML(song.title)}`} 
                    style={{ height: '200px', objectFit: 'cover' }}
                />
                {isFavorite && (
                    <span 
                        className="position-absolute top-0 end-0 m-2 badge bg-danger"
                        style={{ fontSize: '1.2rem' }}
                    >
                        ❤️
                    </span>
                )}
            </div>
            <div className="card-body">
                <h5 className="card-title text-truncate" title={decodeHTML(song.title)}>
                    {decodeHTML(song.title)}
                </h5>
                <p className="card-text text-truncate text-secondary" title={decodeHTML(song.artist)}>
                    {decodeHTML(song.artist)}
                </p>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center">
                <small className="text-muted">{song.year || 'Sin año'}</small>
                <small className="text-muted">{song.duration || '--:--'}</small>
            </div>
        </div>
    );
};

export default SongCard;