import React from 'react';

const SortSelector = ({ currentSort, onSortChange }) => {
  return (
    <div className="sort-container d-flex align-items-center">
      <span className="text-white-50 me-2 sort-label">
        <i className="bi bi-sort-alpha-down me-1"></i>
        Ordenar por:
      </span>
      <div className="btn-group sort-buttons">
        <button 
          className={`btn btn-sm ${currentSort === 'title' ? 'btn-success' : 'btn-dark'}`}
          onClick={() => onSortChange('title')}
        >
          Título
        </button>
        <button 
          className={`btn btn-sm ${currentSort === 'artist' ? 'btn-success' : 'btn-dark'}`}
          onClick={() => onSortChange('artist')}
        >
          Artista
        </button>
        <button 
          className={`btn btn-sm ${currentSort === 'album' ? 'btn-success' : 'btn-dark'}`}
          onClick={() => onSortChange('album')}
        >
          Álbum
        </button>
      </div>
    </div>
  );
};

export default SortSelector;