const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
  correo: {
    type: String,
    required: true
  },
  codigo: {
    type: String,
    required: true
  },
  vencimiento: {
    type: Date,
    required: true
  },
  creadoEn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
