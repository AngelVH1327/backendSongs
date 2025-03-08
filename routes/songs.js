const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

router.post(
    '/',
    [
        body('title').trim().isLength({ min: 1 }).escape(),
        body('artist').trim().isLength({ min: 1 }).escape(),
        body('album').trim().optional().escape(),
        body('genre').trim().optional().escape(),
        body('year').isNumeric().optional(),
        body('duration').trim().optional().matches(/^\d{1,2}:\d{2}$/), // Formato mm:ss
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const newSong = new Song(req.body);
            await newSong.save();
            res.status(201).json(newSong);
        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
);

// Crear una nueva canción
router.post('/', async (req, res) => {
    try {
        const newSong = new Song(req.body);
        await newSong.save();
        res.status(201).json(newSong);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Obtener todas las canciones
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Obtener una canción por ID
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ error: 'Canción no encontrada' });
        res.json(song);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar una canción por ID
router.put('/:id', async (req, res) => {
    try {
        const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSong) return res.status(404).json({ error: 'Canción no encontrada' });
        res.json(updatedSong);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Eliminar una canción por ID
router.delete('/:id', async (req, res) => {
    const secretKey = req.headers['x-api-key']; // Pedimos una clave secreta en los headers
    if (secretKey !== process.env.API_SECRET) {
        return res.status(403).json({ error: 'Acceso denegado' });
    }

    try {
        const deletedSong = await Song.findByIdAndDelete(req.params.id);
        if (!deletedSong) return res.status(404).json({ error: 'Canción no encontrada' });
        res.json({ message: 'Canción eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


module.exports = router;
