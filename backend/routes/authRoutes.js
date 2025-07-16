const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');


const {
  login,
  solicitarCodigoRecuperacion,
  verificarCodigo,
  restablecerContrasena,
  cambiarContrasena
} = require('../controllers/authController');

// Ruta de inicio de sesión
router.post('/login', login);

// Solicitar código de recuperación
router.post('/recuperar', solicitarCodigoRecuperacion);

// Verificar el código ingresado
router.post('/verificar-codigo', verificarCodigo);

// Restablecer la contraseña
router.post('/restablecer-contrasena', restablecerContrasena);

// Cambiar contraseña

router.put('/cambiar-contrasena', verificarToken, authController.cambiarContrasena);

module.exports = router;
