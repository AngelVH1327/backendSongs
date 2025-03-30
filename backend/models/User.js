const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definir el esquema del modelo de Usuario
const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        minlength: 3
    },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
    },
    password: { 
        type: String, 
        required: true,
        minlength: 6
    },
    favoriteSongs: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Song' 
    }],
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Método para verificar contraseña
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Crear el modelo
const User = mongoose.model('User', userSchema);

module.exports = User;