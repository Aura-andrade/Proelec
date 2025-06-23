const express = require('express');
const router = express.Router();

const {
  login,
  solicitarCodigoRecuperacion,
  verificarCodigo,
  restablecerContrasena
} = require('../controllers/authController');

// Ruta de inicio de sesión
router.post('/login', login);

// Solicitar código de recuperación
router.post('/recuperar', solicitarCodigoRecuperacion);

// Verificar el código ingresado
router.post('/verificar-codigo', verificarCodigo);

// Restablecer la contraseña
router.post('/restablecer-contrasena', restablecerContrasena);

module.exports = router;
