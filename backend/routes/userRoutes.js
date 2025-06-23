const express = require('express');
const router = express.Router();

const {
  crearUsuario,
  listarUsuarios,
  editarUsuario,
  eliminarUsuario,
  cambiarEstadoUsuario,
  autocompletarUsuarios
} = require('../controllers/userController');

const { verificarToken, verificarRol } = require('../middlewares/authMiddleware');

// Crear usuario - solo para Administrador o Coordinador
router.post('/', verificarToken, verificarRol('Administrador', 'Coordinador'), crearUsuario);

// Obtener usuarios - acceso para todos los roles autenticados
router.get('/', verificarToken, listarUsuarios);

// Editar usuario
router.put('/:id', verificarToken, verificarRol('Administrador', 'Coordinador'), editarUsuario);

// Eliminar usuario
router.delete('/:id', verificarToken, verificarRol('Administrador'), eliminarUsuario);

// Cambiar estado (inhabilitar/reactivar)
router.patch('/:id/estado', verificarToken, verificarRol('Administrador', 'Coordinador'), cambiarEstadoUsuario);

// Autocompletar búsqueda
router.get('/autocompletar/busqueda', verificarToken, autocompletarUsuarios);

module.exports = router;
