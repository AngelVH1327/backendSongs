const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const sessionMiddleware = require('../middleware/session');
const bcrypt = require('bcryptjs');

// Función para validar contraseñas fuertes
const isStrongPassword = (password) => {
    // Debe tener al menos 8 caracteres
    if (password.length < 8) return false;
    
    // Debe tener al menos una mayúscula, una minúscula, un número y un caracter especial
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
};

// Validaciones de registro
const registerValidations = [
    // Validar username
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('El nombre de usuario debe tener entre 3 y 30 caracteres')
        .isAlphanumeric()
        .withMessage('El nombre de usuario solo puede contener letras y números')
        .escape(),
    
    // Validar email
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail()
        .custom(async (email) => {
            const user = await User.findOne({ email });
            if (user) {
                throw new Error('Este email ya está en uso');
            }
            return true;
        }),
    
    // Validar contraseña
    body('password')
        .isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres')
        .custom((value) => {
            if (!isStrongPassword(value)) {
                throw new Error('La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales');
            }
            return true;
        })
];

// Validaciones de login
const loginValidations = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Debe ser un email válido')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('La contraseña es requerida')
];

// Ruta para el registro de nuevos usuarios
router.post('/register', registerValidations, async (req, res) => {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        // Verificar si el usuario ya existe
        let user = await User.findOne({ 
            $or: [
                { email: email },
                { username: username }
            ] 
        });
        
        if (user) {
            return res.status(400).json({ msg: 'El usuario o email ya existe' });
        }

        // Crear nuevo usuario
        user = new User({
            username,
            email,
            password
        });

        // Guardar usuario en la base de datos
        await user.save();

        // Generar JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_temporal',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token,
                    username: user.username,
                    message: 'Usuario registrado exitosamente'
                });
            }
        );
        
        // Registrar actividad
        console.log(`Nuevo usuario registrado: ${username} (${email}) en ${new Date().toISOString()}`);
        
    } catch (error) {
        console.error('Error en registro:', error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para el login de usuarios
router.post('/login', loginValidations, async (req, res) => {
    // Verificar errores de validación
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Verificar si el usuario existe
        let user = await User.findOne({ email });
        if (!user) {
            // Por seguridad, no especificar qué está mal (email o contraseña)
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Registrar intento fallido (para prevenir ataques de fuerza bruta)
            console.log(`Intento de login fallido para: ${email} en ${new Date().toISOString()}`);
            
            // Por seguridad, no especificar qué está mal (email o contraseña)
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        // Generar JWT
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET || 'secret_temporal',
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    token, 
                    username: user.username,
                    message: 'Inicio de sesión exitoso'
                });
            }
        );
        
        // Registrar inicio de sesión exitoso
        console.log(`Login exitoso: ${user.username} (${email}) en ${new Date().toISOString()}`);
        
    } catch (error) {
        console.error('Error en login:', error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para obtener el usuario actual
router.get('/me', sessionMiddleware, async (req, res) => {
    try {
        // El middleware ya verificó el token, solo buscamos el usuario
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error('Error al obtener usuario:', error.message);
        res.status(500).send('Error en el servidor');
    }
});

// Ruta para cerrar sesión (solo para registro)
router.post('/logout', sessionMiddleware, (req, res) => {
    try {
        // En JWT no existe realmente un "logout" del lado del servidor
        // ya que los tokens son stateless, pero podemos registrarlo
        console.log(`Logout: Usuario ${req.user.id} cerró sesión en ${new Date().toISOString()}`);
        res.json({ msg: 'Sesión cerrada exitosamente' });
    } catch (error) {
        console.error('Error en logout:', error.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;