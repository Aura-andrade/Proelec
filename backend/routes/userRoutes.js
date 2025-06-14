const express = require('express');
const router = express.Router();
const { 
    crearUsuario, 
    consultarUsuarios, 
    autocompletarUsuarios,
    editarUsuario,
    cambiarEstadoUsuario,
    eliminarUsuario
    
} = require('../controllers/userController');


router.post('/', crearUsuario); // Ruta para registrar un nuevo usuario
router.get('/', consultarUsuarios); // Ruta para listar, filtrar, paginar usuarios

router.put('/:id', editarUsuario); // Ruta para editar un usuario
router.put('/estado/:id', cambiarEstadoUsuario); // Ruta para cambiar el estado del usuario (habilitado/deshabilitado)
router.delete('/:id', eliminarUsuario); // Ruta para Elimina el usuario completamente
module.exports = router;






