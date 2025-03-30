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
            className="card bg-dark text-white h-100 song-card overflow-hidden border-0 shadow-sm" 
            onClick={onClick}
            style={{ 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                borderRadius: '12px',
            }}
            onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.3)';
            }}
            onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
            }}
        >
            <div className="position-relative">
                <div className="cover-container" style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden' }}>
                    <img 
                        src={coverImage} 
                        className="card-img-top position-absolute top-0 start-0 w-100 h-100" 
                        alt={`Portada de ${decodeHTML(song.title)}`} 
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = `https://placehold.co/300x300/1DB954/FFFFFF?text=${encodeURIComponent(song.title.charAt(0) || 'M')}`;
                        }}
                    />
                </div>
                {isFavorite && (
                    <span 
                        className="position-absolute top-0 end-0 m-2 badge"
                        style={{ 
                            fontSize: '1.2rem',
                            background: 'none',
                            filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.7))'
                        }}
                    >
                        ❤️
                    </span>
                )}
            </div>
            <div className="card-body">
                <h5 className="card-title text-truncate fw-bold mb-1" title={decodeHTML(song.title)}>
                    {decodeHTML(song.title)}
                </h5>
                <p className="card-text text-truncate text-success mb-0" title={decodeHTML(song.artist)}>
                    {decodeHTML(song.artist)}
                </p>
            </div>
            <div className="card-footer d-flex justify-content-between align-items-center bg-dark border-secondary">
                <small className="text-muted">{song.year || '---'}</small>
                <small className="text-muted">{song.duration || '--:--'}</small>
            </div>
        </div>
    );
};

export default SongCard;