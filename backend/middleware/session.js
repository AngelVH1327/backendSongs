const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para validar sesiones activas
module.exports = async function(req, res, next) {
    try {
        // Obtener token del header
        const token = req.header('x-auth-token');

        // Verificar si no hay token
        if (!token) {
            return res.status(401).json({ msg: 'No hay token, sesión inválida' });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_temporal');
        
        // Verificar que el usuario aún existe en la base de datos
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(401).json({ msg: 'Usuario no encontrado, sesión inválida' });
        }

        // Verificar que el token no ha expirado (aunque JWT ya hace esta verificación)
        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < now) {
            return res.status(401).json({ msg: 'Sesión expirada, inicie sesión nuevamente' });
        }

        // Todo está en orden, guardar usuario en request
        req.user = decoded.user;
        next();
    } catch (err) {
        console.error('Error en validación de sesión:', err.message);
        
        // Mensajes de error específicos
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ msg: 'Sesión expirada, inicie sesión nuevamente' });
        } else if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ msg: 'Token inválido' });
        }
        
        res.status(401).json({ msg: 'Error de sesión no identificado' });
    }
};