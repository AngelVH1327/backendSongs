const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');

// Middleware personalizados
const securityMiddleware = require('./middleware/security');

dotenv.config(); // Cargar variables de entorno
const app = express();
const port = process.env.PORT || 5000;

// Middlewares de seguridad
app.use(helmet()); // Protege configurando headers HTTP
app.use(xss()); // Previene ataques XSS sanitizando entrada
app.use(mongoSanitize()); // Previene inyecciones NoSQL

// Middlewares básicos
app.use(express.json()); // Para manejar datos JSON en las solicitudes
app.use(cors());
app.use(securityMiddleware); // Nuestro middleware personalizado de seguridad

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => console.error('❌ Error al conectar a MongoDB:', err));

// Importar rutas
const songRoutes = require('./routes/songs');
const authRoutes = require('./routes/auth');
const favoriteRoutes = require('./routes/favorites');

// Definir rutas
app.use('/api/songs', songRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de canciones! 🎵');
});

// Limitar solicitudes para prevenir ataques de fuerza bruta
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100, // Máximo 100 solicitudes
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.',
});
app.use(limiter);

// Middleware para errores no capturados
app.use((err, req, res, next) => {
  console.error('Error no capturado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});