import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container mb-4">
      <div className="input-group">
        <span className="input-group-text">
          <i className="bi bi-search text-success"></i>
        </span>
        <input
          type="text"
          className="form-control"
          placeholder="Buscar canciones por título, artista o álbum..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Buscar canciones"
        />
        {searchTerm && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => setSearchTerm('')}
            aria-label="Limpiar búsqueda"
          >
            <i className="bi bi-x-circle text-white"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;