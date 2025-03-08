const mongoose = require('mongoose');

// Definir el esquema del modelo de Canción
const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String },
    genre: { type: String },
    year: { type: Number },
    duration: { type: String }, // Ejemplo: "3:45"
    createdAt: { type: Date, default: Date.now }
});

// Crear el modelo
const Song = mongoose.model('Song', songSchema);

module.exports = Song;
