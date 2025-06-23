const jwt = require('jsonwebtoken');
const MENSAJES = require('../utils/mensajes');

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ mensaje: MENSAJES.AUTH.TOKEN_NO_PROPORCIONADO });
  }

  try {
    const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'clave_secreta');
    req.usuario = decodificado;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: MENSAJES.AUTH.TOKEN_INVALIDO });
  }
};

// ✅ NUEVO: middleware para verificar si el usuario tiene uno de los roles permitidos
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    const rolUsuario = req.usuario?.rol;
    if (!rolUsuario || !rolesPermitidos.includes(rolUsuario)) {
      return res.status(403).json({ mensaje: MENSAJES.AUTH.ROL_NO_AUTORIZADO });
    }
    next();
  };
};

module.exports = {
  verificarToken,
  verificarRol
};
