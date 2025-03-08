const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

dotenv.config(); // Cargar variables de entorno
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json()); // Para manejar datos JSON en las solicitudes
app.use(cors());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)

.then(() => console.log('✅ Conectado a MongoDB'))
.catch((err) => console.error('❌ Error al conectar a MongoDB:', err));


const songRoutes = require('./routes/songs');
app.use('/api/songs', songRoutes);

// Ruta básica de prueba
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de canciones! 🎵');
});

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 100, // Máximo 100 solicitudes
  message: 'Demasiadas solicitudes desde esta IP, intenta más tarde.',
});
app.use(limiter);
// Iniciar el servidor

app.listen(port, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${port}`);
});
