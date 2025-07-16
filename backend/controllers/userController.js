const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const enviarCorreo = require('../utils/emailSender');
const MENSAJES = require('../utils/mensajes');
const { generarCadenaAleatoria } = require('../utils/generador');
const { validarContrasena } = require('../utils/validadores');

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

    if (!identificacion) errores.identificacion = MENSAJES.USUARIO.ID_OBLIGATORIO;
    if (!nombreCompleto) errores.nombreCompleto = MENSAJES.USUARIO.NOMBRE_OBLIGATORIO;
    if (!cargo) errores.cargo = MENSAJES.USUARIO.CARGO_OBLIGATORIO;
    if (!correo) errores.correo = MENSAJES.USUARIO.CORREO_OBLIGATORIO;
    if (!rol) errores.rol = MENSAJES.USUARIO.ROL_OBLIGATORIO;
    if (typeof estado === 'undefined') errores.estado = MENSAJES.USUARIO.ESTADO_OBLIGATORIO;
    if (!proyectosAsignados || proyectosAsignados.length === 0) {
      errores.proyectosAsignados = MENSAJES.USUARIO.PROYECTOS_OBLIGATORIOS;
    }

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

    const contraseñaGenerada = generarCadenaAleatoria();

    const erroresContrasena = validarContrasena(contraseñaGenerada);
    if (erroresContrasena.length > 0) {
      return res.status(400).json({
        mensaje: MENSAJES.USUARIO.CONTRASENA_NO_SEGURA,
        errores: erroresContrasena
      });
    }

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
      mensaje: MENSAJES.USUARIO.CREADO
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_REGISTRO });
  }
};

const listarUsuarios = async (req, res) => {
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
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_LISTAR });
  }
};

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
    if (!nombreCompleto || !cargo || !correo || !rol || typeof estado === 'undefined' || !Array.isArray(proyectosAsignados) || proyectosAsignados.length === 0) {
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

    res.json({ mensaje: MENSAJES.USUARIO.ACTUALIZADO });
  } catch (error) {
    console.error('Error al editar usuario:', error);
    res.status(500).json({ mensaje: MENSAJES.USUARIO.ERROR_ACTUALIZACION });
  }
};

const cambiarEstadoUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (typeof estado === 'undefined') {
      return res.status(400).json({ mensaje: MENSAJES.USUARIO.ESTADO_OBLIGATORIO });
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
  listarUsuarios,
  autocompletarUsuarios,
  editarUsuario,
  cambiarEstadoUsuario,
  eliminarUsuario
};

