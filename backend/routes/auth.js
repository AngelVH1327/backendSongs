const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// Ruta para el registro de nuevos usuarios
router.post('/register',
    [
        body('username').trim().isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres'),
        body('email').isEmail().withMessage('El email debe ser válido'),
        body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    ],
    async (req, res) => {
        // Verificar errores de validación
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            // Verificar si el usuario ya existe
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: 'El usuario ya existe' });
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
                    res.json({ token });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Error en el servidor');
        }
    });

// Ruta para el login de usuarios
router.post('/login',
    [
        body('email').isEmail().withMessage('Ingresa un email válido'),
        body('password').exists().withMessage('La contraseña es requerida')
    ],
    async (req, res) => {
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
                return res.status(400).json({ msg: 'Credenciales inválidas' });
            }

            // Verificar contraseña
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
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
                    res.json({ token, username: user.username });
                }
            );
        } catch (error) {
            console.error(error.message);
            res.status(500).send('Error en el servidor');
        }
    });

// Ruta para obtener el usuario actual
router.get('/me', async (req, res) => {
    try {
        // Verificar token y extraer id del usuario
        const token = req.header('x-auth-token');
        
        if (!token) {
            return res.status(401).json({ msg: 'No hay token, autorización denegada' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_temporal');
        const user = await User.findById(decoded.user.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;