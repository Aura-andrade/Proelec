const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  identificacion: {
    type: Number,
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
  // proyectosAsignados:cuando cree el modulo de proyectos pasa a: mongoose.Schema.Types.ObjectId, // ref: 'Proyecto'  // Más adelante se crea este modelo
  
  proyectosAsignados: {
  type: [String], // array de strings
  default: []
},
  contraseña: {
    type: String,
    required: true,
    select: false // para que no se incluya por defecto al hacer consultas
  },
  primerInicio:{
    type: Boolean,
    default: true // Para saber si ya cambió su contraseña por defecto
    },
}, {
  timestamps: true
});

module.exports = mongoose.model('Usuario', usuarioSchema);
