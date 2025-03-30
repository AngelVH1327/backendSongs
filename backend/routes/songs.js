const express = require('express');
const router = express.Router();
const Song = require('../models/Song');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

// Validaciones para canciones
const songValidations = [
    // Título: requerido, entre 1 y 100 caracteres
    body('title')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('El título debe tener entre 1 y 100 caracteres')
        .isString()
        .withMessage('El título debe ser texto')
        .escape(),
    
    // Artista: requerido, entre 1 y 100 caracteres
    body('artist')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('El nombre del artista debe tener entre 1 y 100 caracteres')
        .isString()
        .withMessage('El nombre del artista debe ser texto')
        .escape(),
    
    // Álbum: opcional, máximo 100 caracteres
    body('album')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('El nombre del álbum no puede exceder 100 caracteres')
        .isString()
        .withMessage('El nombre del álbum debe ser texto')
        .escape(),
    
    // Género: opcional, debe ser texto, no números
    body('genre')
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage('El género no puede exceder 50 caracteres')
        .isString()
        .withMessage('El género debe ser texto')
        .custom(value => {
            // Verificar que no sea sólo números
            if (/^\d+$/.test(value)) {
                throw new Error('El género no puede ser sólo números');
            }
            return true;
        })
        .escape(),
    
    // Año: opcional, debe ser un número entre 1800 y el año actual
    body('year')
        .optional()
        .isInt({ min: 1800, max: new Date().getFullYear() })
        .withMessage(`El año debe ser un número entre 1800 y ${new Date().getFullYear()}`)
        .toInt(),
    
    // Duración: opcional, debe tener el formato "m:ss" o "mm:ss"
    body('duration')
        .optional()
        .trim()
        .matches(/^([0-9]|[1-9][0-9]):([0-5][0-9])$/)
        .withMessage('La duración debe tener el formato m:ss o mm:ss (ej: 3:45)')
];

// Crear una nueva canción
router.post('/', auth, songValidations, async (req, res) => {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newSong = new Song(req.body);
        await newSong.save();
        res.status(201).json(newSong);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener todas las canciones
router.get('/', async (req, res) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.json(songs);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener una canción por ID
router.get('/:id', async (req, res) => {
    try {
        const song = await Song.findById(req.params.id);
        if (!song) return res.status(404).json({ error: 'Canción no encontrada' });
        res.json(song);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar una canción por ID
router.put('/:id', auth, songValidations, async (req, res) => {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedSong) return res.status(404).json({ error: 'Canción no encontrada' });
        res.json(updatedSong);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar una canción por ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedSong = await Song.findByIdAndDelete(req.params.id);
        if (!deletedSong) return res.status(404).json({ error: 'Canción no encontrada' });
        res.json({ message: 'Canción eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
