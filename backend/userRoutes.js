const express = require('express');
const router = express.Router();
const { crearUsuario } = require('../controllers/userController');

// Ruta para registrar un nuevo usuario
router.post('/', crearUsuario);

module.exports = router;
