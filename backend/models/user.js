const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  identificacion: {
    type: String,
    required: true,
    unique: true
  },
  nombreCompleto: {
    type: String,
    required: true
  },
  cargo: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    unique: true  
  },
  rol: {
    type: String,
    enum: ['Administrador', 'Coord. Admon', 'Ejecutor de obra'],
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  },
  proyectosAsignados: {
    type: [String],
    default: []
  },
  contraseña: {
    type: String,
    required: true,
    select: false
  },
  requiereCambioContrasena: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);
