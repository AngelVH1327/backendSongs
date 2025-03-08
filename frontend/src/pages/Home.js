import React from 'react';
import SongList from '../components/SongList';
import SongForm from '../components/SongForm';

const Home = () => {
    return (
        <div className="container mt-4">
            <h1 className="text-center text-primary">CRUD MUSICA</h1>
            <SongForm onSongAdded={() => window.location.reload()} />
            <SongList />
        </div>
    );
};

export default Home;
