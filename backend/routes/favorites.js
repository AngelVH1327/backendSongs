const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Song = require('../models/Song');
const auth = require('../middleware/auth');

// Obtener canciones favoritas del usuario
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favoriteSongs');
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        res.json(user.favoriteSongs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Agregar canción a favoritos
router.post('/:songId', auth, async (req, res) => {
    try {
        const songId = req.params.songId;
        
        // Verificar si la canción existe
        const song = await Song.findById(songId);
        if (!song) {
            return res.status(404).json({ msg: 'Canción no encontrada' });
        }
        
        // Verificar si el usuario existe
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        // Verificar si la canción ya está en favoritos
        if (user.favoriteSongs.includes(songId)) {
            return res.status(400).json({ msg: 'La canción ya está en favoritos' });
        }
        
        // Agregar a favoritos
        user.favoriteSongs.push(songId);
        await user.save();
        
        res.json(user.favoriteSongs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Eliminar canción de favoritos
router.delete('/:songId', auth, async (req, res) => {
    try {
        const songId = req.params.songId;
        
        // Verificar si el usuario existe
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        // Verificar si la canción está en favoritos
        const index = user.favoriteSongs.indexOf(songId);
        if (index === -1) {
            return res.status(400).json({ msg: 'La canción no está en favoritos' });
        }
        
        // Eliminar de favoritos
        user.favoriteSongs.splice(index, 1);
        await user.save();
        
        res.json(user.favoriteSongs);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;