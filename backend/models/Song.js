const mongoose = require('mongoose');

// Definir el esquema del modelo de Canción con validaciones
const songSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [100, 'El título no puede exceder los 100 caracteres']
    },
    artist: { 
        type: String, 
        required: [true, 'El artista es obligatorio'],
        trim: true,
        maxlength: [100, 'El nombre del artista no puede exceder los 100 caracteres']
    },
    album: { 
        type: String,
        trim: true,
        maxlength: [100, 'El nombre del álbum no puede exceder los 100 caracteres']
    },
    genre: { 
        type: String,
        trim: true,
        maxlength: [50, 'El género no puede exceder los 50 caracteres'],
        validate: {
            validator: function(v) {
                return !(/^\d+$/.test(v)); // No puede ser solo números
            },
            message: props => 'El género no puede ser solo números'
        }
    },
    year: { 
        type: Number,
        min: [1800, 'El año no puede ser menor a 1800'],
        max: [new Date().getFullYear(), `El año no puede ser mayor a ${new Date().getFullYear()}`],
        validate: {
            validator: function(v) {
                return Number.isInteger(v);
            },
            message: props => 'El año debe ser un número entero'
        }
    },
    duration: { 
        type: String,
        validate: {
            validator: function(v) {
                return /^([0-9]|[1-9][0-9]):([0-5][0-9])$/.test(v);
            },
            message: props => 'El formato de duración debe ser m:ss o mm:ss (ej: 3:45)'
        }
    },
    coverImage: {
        type: String,
        default: 'default-cover.jpg'
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Crear el modelo
const Song = mongoose.model('Song', songSchema);

module.exports = Song;