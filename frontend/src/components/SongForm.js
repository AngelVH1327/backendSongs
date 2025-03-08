import React, { useState } from 'react';
import { createSong } from '../api';

const SongForm = ({ onSongAdded }) => {
    const [song, setSong] = useState({
        title: '', artist: '', album: '', genre: '', year: '', duration: '',
    });
    
    const sanitizeInput = (input) => {
        return input.replace(/<\/?[^>]+(>|$)/g, ""); // Elimina etiquetas HTML y JavaScript
    };

    const handleChange = (e) => {
        setSong({ ...song, [e.target.name]: sanitizeInput(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createSong(song);
        onSongAdded();
        setSong({ title: '', artist: '', album: '', genre: '', year: '', duration: '' });
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Agregar Canción</h2>
            <form className="card p-3 shadow" onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-md-6">
                        <label className="form-label">Título</label>
                        <input type="text" name="title" className="form-control" onChange={handleChange} value={song.title} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Artista</label>
                        <input type="text" name="artist" className="form-control" onChange={handleChange} value={song.artist} required />
                    </div>
                    <div className="col-md-6 mt-2">
                        <label className="form-label">Álbum</label>
                        <input type="text" name="album" className="form-control" onChange={handleChange} value={song.album} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <label className="form-label">Género</label>
                        <input type="text" name="genre" className="form-control" onChange={handleChange} value={song.genre} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <label className="form-label">Año</label>
                        <input type="number" name="year" className="form-control" onChange={handleChange} value={song.year} />
                    </div>
                    <div className="col-md-6 mt-2">
                        <label className="form-label">Duración</label>
                        <input type="text" name="duration" className="form-control" placeholder="Ej: 3:45" onChange={handleChange} value={song.duration} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary mt-3">Agregar Canción</button>
            </form>
        </div>
    );
};

export default SongForm;
