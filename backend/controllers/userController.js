const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const enviarCorreo = require('../utils/emailSender');
const MENSAJES = require('../utils/mensajes');

// Función para generar una contraseña aleatoria
const generarContraseña = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let contraseña = '';
  for (let i = 0; i < 10; i++) {
    contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return contraseña;
};

// Crear un nuevo usuario
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

    const errores = {};

    if (!identificacion) errores.identificacion = 'La identificación es obligatoria.';
    if (!nombreCompleto) errores.nombreCompleto = 'El nombre completo es obligatorio.';
    if (!cargo) errores.cargo = 'El cargo es obligatorio.';
    if (!correo) errores.correo = 'El correo es obligatorio.';
    if (!rol) errores.rol = 'El rol es obligatorio.';
    if (typeof estado === 'undefined') errores.estado = 'El estado es obligatorio.';
    if (!proyectosAsignados || proyectosAsignados.length === 0) errores.proyectosAsignados = 'Debe asignar al menos un proyecto.';

    if (identificacion) {
      const existeID = await Usuario.findOne({ identificacion });
      if (existeID) errores.identificacion = MENSAJES.USUARIO.YA_EXISTE_ID;
    }

    if (correo) {
      const existeCorreo = await Usuario.findOne({ correo });
      if (existeCorreo) errores.correo = MENSAJES.USUARIO.YA_EXISTE_CORREO;
    }

    if (Object.keys(errores).length > 0) {
      return res.status(400).json({ errores });
    }

    const contraseñaGenerada = generarContraseña();
    const contraseñaEncriptada = await bcrypt.hash(contraseñaGenerada, 10);

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

    return res.status(201).json({
      mensaje: 'Usuario creado con éxito. La contraseña ha sido enviada por correo.'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_REGISTRO });
  }
};

// Consultar usuarios con filtros, paginación y búsqueda
const consultarUsuarios = async (req, res) => {
  try {
    const {
      busqueda = '',
      rol,
      estado,
      ordenar = 'asc',
      pagina = 1,
      limite = 10
    } = req.query;

    const regex = new RegExp(busqueda, 'i');
    const filtros = {};

    if (busqueda.trim() !== '') {
      filtros.$or = [
        { nombreCompleto: regex },
        { identificacion: regex }
      ];
    }

    if (rol) filtros.rol = rol;
    if (estado !== undefined) filtros.estado = estado === 'true';

    const skip = (parseInt(pagina) - 1) * parseInt(limite);
    const orden = ordenar === 'desc' ? -1 : 1;

    const usuarios = await Usuario.find(filtros)
      .sort({ nombreCompleto: orden })
      .skip(skip)
      .limit(parseInt(limite))
      .select('-contraseña');

    const total = await Usuario.countDocuments(filtros);

    res.json({
      total,
      pagina: parseInt(pagina),
      totalPaginas: Math.ceil(total / limite),
      usuarios
    });

  } catch (error) {
    console.error('Error al consultar usuarios:', error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_LISTAR });
  }
};

// Autocompletar usuarios
const autocompletarUsuarios = async (req, res) => {
  try {
    const termino = req.query.termino?.toString() || '';

    if (!termino.trim()) {
      return res.status(400).json({ mensaje: MENSAJES.USUARIO.TERMINO_OBLIGATORIO });
    }

    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
      $or: [
        { nombreCompleto: regex },
        { identificacion: regex }
      ]
    })
      .select('nombreCompleto identificacion')
      .limit(10);

    res.json(usuarios);

  } catch (error) {
    console.error('Error en autocompletar:', error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_AUTOCOMPLETAR });
  }
};

// Editar usuario
const editarUsuario = async (req, res) => {
  const { id } = req.params;
  const {
    nombreCompleto,
    cargo,
    correo,
    rol,
    estado,
    proyectosAsignados
  } = req.body;

  try {
    if (
      !nombreCompleto || !cargo || !correo ||
      !rol || typeof estado === 'undefined' ||
      !Array.isArray(proyectosAsignados) || proyectosAsignados.length === 0
    ) {
      return res.status(400).json({ mensaje: MENSAJES.USUARIO.CAMPOS_OBLIGATORIOS });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: MENSAJES.USUARIO.NO_ENCONTRADO });
    }

    if (usuario.correo !== correo) {
      const correoExistente = await Usuario.findOne({ correo });
      if (correoExistente) {
        return res.status(400).json({ mensaje: MENSAJES.USUARIO.CORREO_DUPLICADO });
      }
    }

    usuario.nombreCompleto = nombreCompleto;
    usuario.cargo = cargo;
    usuario.correo = correo;
    usuario.rol = rol;
    usuario.estado = estado;
    usuario.proyectosAsignados = proyectosAsignados;

    await usuario.save();

    res.json({ mensaje: 'Usuario actualizado correctamente.' });

  } catch (error) {
    console.error('Error al editar usuario:', error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_ACTUALIZACION });
  }
};

// Cambiar estado (habilitar/inhabilitar)
const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (typeof estado === 'undefined') {
      return res.status(400).json({ mensaje: 'Debe proporcionar el nuevo estado (true o false).' });
    }

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: MENSAJES.USUARIO.NO_ENCONTRADO });
    }

    usuario.estado = estado;
    await usuario.save();

    res.json({ mensaje: MENSAJES.USUARIO.CAMBIO_ESTADO_OK(estado) });

  } catch (error) {
    console.error('Error al cambiar el estado:', error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_ESTADO });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ mensaje: MENSAJES.USUARIO.NO_ENCONTRADO });
    }

    await Usuario.findByIdAndDelete(id);

    res.json({ mensaje: MENSAJES.USUARIO.ELIMINADO });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_ELIMINAR });
  }
};

module.exports = {
  crearUsuario,
  consultarUsuarios,
  autocompletarUsuarios,
  editarUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario
};
