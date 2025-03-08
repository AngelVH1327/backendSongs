import React, { useEffect, useState } from 'react';
import { getSongs, deleteSong } from '../api';

const SongList = () => {
    const [songs, setSongs] = useState([]);

    useEffect(() => {
        fetchSongs();
    }, []);

    const fetchSongs = async () => {
        const data = await getSongs();
        setSongs(data);
    };

    const handleDelete = async (id) => {
        await deleteSong(id);
        fetchSongs();
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center">Lista de Canciones</h2>
            <table className="table table-striped table-hover shadow">
                <thead className="table-dark">
                    <tr>
                        <th>Título</th>
                        <th>Artista</th>
                        <th>Álbum</th>
                        <th>Género</th>
                        <th>Año</th>
                        <th>Duración</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {songs.map(song => (
                        <tr key={song._id}>
                            <td>{song.title}</td>
                            <td>{song.artist}</td>
                            <td>{song.album}</td>
                            <td>{song.genre}</td>
                            <td>{song.year}</td>
                            <td>{song.duration}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(song._id)}>🗑️ Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SongList;
