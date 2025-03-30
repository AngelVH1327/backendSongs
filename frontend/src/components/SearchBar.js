import React from 'react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="search-container mb-4">
      <div className="input-group">
        <span className="input-group-text bg-dark text-success">
          <i className="bi bi-search"></i>
        </span>
        <input
          type="text"
          className="form-control bg-dark text-white"
          placeholder="Buscar canciones por título, artista o álbum..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            className="btn btn-outline-secondary bg-dark text-white"
            type="button"
            onClick={() => setSearchTerm('')}
          >
            <i className="bi bi-x-circle"></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;