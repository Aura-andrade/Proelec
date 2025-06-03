const Usuario = require('../models/User'); // Importamos el modelo
const bcrypt = require('bcryptjs');
const enviarCorreo = require('../utils/emailSender');


// Función para registrar un nuevo usuario

const generarContraseña = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let contraseña = '';
  for (let i = 0; i < 10; i++) {
    contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return contraseña;
};

const crearUsuario = async (req, res) => {

  console.log(req.body); // TEMPORAL: para verificar los datos
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

    const contraseñaGenerada = generarContraseña();

    console.log("Contraseña generada para el nuevo usuario:", contraseñaGenerada); // se puede eliminar en producción

    const contraseñaEncriptada = await bcrypt.hash(contraseñaGenerada, 10);


    // Crear el usuario
    const nuevoUsuario = new Usuario({
      identificacion,
      nombreCompleto,
      cargo,
      correo,
      rol,
      estado,
      proyectosAsignados,
      contraseña: contraseñaEncriptada
    });

    await nuevoUsuario.save();

// Enviar correo con la contraseña generada
    await enviarCorreo(
  correo,
  'Acceso al sistema ProElec',
  `
  <p>Hola ${nombreCompleto},</p>
  <p>Tu cuenta en el sistema <strong>ProElec</strong> ha sido creada exitosamente.</p>
  <p>Tu contraseña temporal es:</p>
  <h3>${contraseñaGenerada}</h3>
  <p>Por favor, inicia sesión y cámbiala al primer ingreso.</p>
  <p>Gracias,<br>Equipo de desarrollo ProElec</p>
  `
);

return res.status(201).json({ mensaje: "Usuario creado con éxito. La contraseña ha sido enviada por correo." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al registrar usuario.' });
  }
};

module.exports = { crearUsuario };

