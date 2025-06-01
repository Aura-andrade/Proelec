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
    enum: ['Administrador', 'coord. admon', 'Ejecutores de obra'],
    required: true
  },
  estado: {
    type: Boolean,
    default: true
  },
  proyectosAsignados: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proyecto'  // Más adelante se crea este modelo
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);
