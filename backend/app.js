const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // Carga el archivo .env

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((error) => console.error('❌ Error conectando a MongoDB:', error));

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Montar rutas (después de middlewares)
app.use('/api/usuarios', userRoutes);
app.use('/api/auth', authRoutes); // Rutas de autenticación

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
