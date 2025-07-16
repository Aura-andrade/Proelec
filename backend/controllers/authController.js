const Usuario = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const PasswordReset = require('../models/PasswordReset');
const enviarCorreo = require('../utils/emailSender');
const MENSAJES = require('../utils/mensajes');
const { generarCadenaAleatoria } = require('../utils/generador');

// LOGIN
const login = async (req, res) => {
  try {
    const { identificacion, contrasena } = req.body;

    if (!identificacion || !contrasena) {
      return res.status(400).json({ mensaje: MENSAJES.USUARIO.CAMPOS_OBLIGATORIOS });
    }

    const usuario = await Usuario.findOne({ identificacion }).select('+contraseña');
    if (!usuario) {
      return res.status(404).json({ mensaje: MENSAJES.AUTH.USUARIO_NO_ENCONTRADO });
    }

    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contraseña);
    if (!contrasenaValida) {
      return res.status(401).json({ mensaje: MENSAJES.AUTH.CONTRASENA_INCORRECTA });
    }

    if (!usuario.estado) {
      return res.status(403).json({ mensaje: MENSAJES.AUTH.USUARIO_INHABILITADO });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'clave_secreta',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      nombre: usuario.nombreCompleto,
      rol: usuario.rol,
      primerInicio: usuario.primerInicio
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ mensaje: MENSAJES.GENERAL.ERROR_INTERNO });
  }
};

// CAMBIAR CONTRASEÑA desde perfil
const cambiarContrasena = async (req, res) => {
  try {
    const { identificacion, contrasenaActual, nuevaContrasena } = req.body;

    if (!identificacion || !contrasenaActual || !nuevaContrasena) {
      return res.status(400).json({ mensaje: MENSAJES.USUARIO.CAMPOS_OBLIGATORIOS });
    }

    const usuario = await Usuario.findOne({ identificacion }).select('+contraseña');
    if (!usuario) {
      return res.status(404).json({ mensaje: MENSAJES.AUTH.USUARIO_NO_ENCONTRADO });
    }

    const esValida = await bcrypt.compare(contrasenaActual, usuario.contraseña);
    if (!esValida) {
      return res.status(401).json({ mensaje: MENSAJES.AUTH.CONTRASENA_INCORRECTA });
    }

    usuario.contraseña = await bcrypt.hash(nuevaContrasena, 10);
    await usuario.save();

    res.json({ mensaje: MENSAJES.AUTH.CONTRASENA_ACTUALIZADA });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: MENSAJES.AUTH.ERROR_ACTUALIZAR_CONTRASENA });
  }
};

// Solicitar código
const solicitarCodigoRecuperacion = async (req, res) => {
  try {
    const { correo } = req.body;

    if (!correo) {
      return res.status(400).json({ mensaje: MENSAJES.AUTH.CORREO_OBLIGATORIO });
    }

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: MENSAJES.AUTH.CORREO_NO_REGISTRADO });
    }

    const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000);
    const intentosRecientes = await PasswordReset.countDocuments({
      correo,
      creadoEn: { $gte: haceUnaHora }
    });

    if (intentosRecientes >= 5) {
      return res.status(429).json({ mensaje: MENSAJES.AUTH.INTENTOS_EXCEDIDOS });
    }

    const codigo = generarCadenaAleatoria(6);
    const vencimiento = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordReset.deleteMany({ correo });

    const nuevoReset = new PasswordReset({ correo, codigo, vencimiento });
    await nuevoReset.save();

    await enviarCorreo(
      correo,
      'Código de recuperación - ProElec',
      `
        <p>Hola,</p>
        <p>Has solicitado recuperar tu contraseña en <strong>ProElec</strong>.</p>
        <p>Este es tu código de recuperación:</p>
        <h2>${codigo}</h2>
        <p>Este código tiene una validez de 10 minutos.</p>
        <p>Si no solicitaste este código, por favor ignora este mensaje.</p>
        <p>Gracias,<br>Equipo ProElec</p>
      `
    );

    return res.json({ mensaje: MENSAJES.AUTH.CODIGO_ENVIADO });
  } catch (error) {
    console.error('Error al solicitar código de recuperación:', error);
    res.status(500).json({ mensaje: MENSAJES.AUTH.ERROR_SOLICITUD });
  }
};

// Verificar código
const verificarCodigo = async (req, res) => {
  try {
    const { correo, codigo } = req.body;

    if (!correo || !codigo) {
      return res.status(400).json({ mensaje: MENSAJES.AUTH.CODIGO_OBLIGATORIO });
    }

    const ahora = new Date();

    const reset = await PasswordReset.findOne({
      correo,
      codigo,
      vencimiento: { $gte: ahora }
    }).sort({ creadoEn: -1 });

    if (!reset) {
      return res.status(400).json({ mensaje: MENSAJES.AUTH.CODIGO_INVALIDO });
    }

    return res.json({
      ok: true,
      mensaje: MENSAJES.AUTH.CODIGO_VALIDO
    });
  } catch (error) {
    console.error('Error al verificar código:', error);
    return res.status(500).json({ mensaje: MENSAJES.AUTH.ERROR_VERIFICACION });
  }
};

// Restablecer contraseña
const restablecerContrasena = async (req, res) => {
  try {
    const { correo, codigo, nuevaContrasena } = req.body;

    if (!correo || !codigo || !nuevaContrasena) {
      return res.status(400).json({ mensaje: MENSAJES.USUARIO.CAMPOS_OBLIGATORIOS });
    }

    const reset = await PasswordReset.findOne({ correo, codigo });

    if (!reset || reset.vencimiento < new Date()) {
      return res.status(400).json({ mensaje: MENSAJES.AUTH.CODIGO_INVALIDO });
    }

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(404).json({ mensaje: MENSAJES.AUTH.CORREO_NO_REGISTRADO });
    }

    usuario.contraseña = await bcrypt.hash(nuevaContrasena, 10);
    usuario.primerInicio = false;
    await usuario.save();

    await PasswordReset.deleteMany({ correo });

    res.json({ mensaje: MENSAJES.AUTH.CONTRASENA_ACTUALIZADA });
  } catch (error) {
    console.error('Error al restablecer contraseña:', error);
    res.status(500).json({ mensaje: MENSAJES.AUTH.ERROR_RESTABLECER });
  }
};

module.exports = {
  login,
  cambiarContrasena,
  solicitarCodigoRecuperacion,
  verificarCodigo,
  restablecerContrasena,
};
