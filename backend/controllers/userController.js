const Usuario = require('../models/User'); // Importamos el modelo

// Función para registrar un nuevo usuario
const crearUsuario = async (req, res) => {
  try {
    const {
      identificacion,
      nombreCompleto,
      cargo,
      correo,
      rol,
      estado,
      proyectosAsignados
    } = req.body;

    // Verificar campos obligatorios
    if (
      !identificacion || !nombreCompleto || !cargo ||
      !correo || !rol || typeof estado === 'undefined' ||
      !proyectosAsignados || proyectosAsignados.length === 0
    ) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    // Verificar si el ID ya existe
    const existeID = await Usuario.findOne({ identificacion });
    if (existeID) {
      return res.status(400).json({ mensaje: 'ID ya fue registrado.' });
    }

    // Verificar si el correo ya existe
    const existeCorreo = await Usuario.findOne({ correo });
    if (existeCorreo) {
      return res.status(400).json({ mensaje: 'correo ya registrado.' });
    }

    // Crear el usuario
    const nuevoUsuario = new Usuario({
      identificacion,
      nombreCompleto,
      cargo,
      correo,
      rol,
      estado,
      proyectosAsignados
    });

    await nuevoUsuario.save(); // Guardar en MongoDB

    res.status(201).json({ mensaje: 'Usuario registrado con éxito.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario.' });
  }
};

module.exports = { crearUsuario };
