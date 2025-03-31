import React, { useState } from 'react';
import SongList from '../components/SongList';
import SongForm from '../components/SongForm';

const Home = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    const handleSongAdded = () => {
        // Incrementar para forzar la actualización de la lista
        setRefreshTrigger(prev => prev + 1);
    };
    
    return (
        <div className="container-fluid px-4 py-3">
            <div className="row mb-4">
                <div className="col-12">
                    <h1 className="text-center text-white mb-0">
                        <span className="text-success"><i className="bi bi-music-note"></i></span> MusicApp
                    </h1>
                    <p className="text-center text-secondary">Tu biblioteca musical personalizada</p>
                </div>
            </div>
            
            <div className="row">
                <div className="col-12">
                    <SongForm onSongAdded={handleSongAdded} />
                </div>
            </div>
            
            <div className="row">
                <div className="col-12">
                    <SongList key={refreshTrigger} />
                </div>
            </div>
        </div>
    );
};

export default Home;
