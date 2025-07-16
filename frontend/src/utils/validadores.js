import { MENSAJES_ERROR } from './mensajes';

/** === FUNCIONES UNITARIAS REUTILIZABLES === */

export function validarCorreo(correo) {
  if (!correo) return MENSAJES_ERROR.CORREO_OBLIGATORIO;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(correo)) return MENSAJES_ERROR.CORREO_INVALIDO;
  return '';
}

export function validarContrasenaSegura(contrasena) {
  const errores = [];

  if (!contrasena) {
    errores.push(MENSAJES_ERROR.CONTRASENA_NO_SEGURA);
    return errores;
  }

  if (contrasena.length < 8) {
    errores.push('Debe tener al menos 8 caracteres.');
  }
  if (!/[A-Z]/.test(contrasena)) {
    errores.push('Debe contener al menos una letra mayúscula.');
  }
  if (!/[a-z]/.test(contrasena)) {
    errores.push('Debe contener al menos una letra minúscula.');
  }
  if (!/[0-9]/.test(contrasena)) {
    errores.push('Debe contener al menos un número.');
  }
  if (!/[^A-Za-z0-9]/.test(contrasena)) {
    errores.push('Debe contener al menos un carácter especial.');
  }

  return errores;
}

export function validarIdentificacion(id) {
  if (!id) return MENSAJES_ERROR.ID_OBLIGATORIO;
  return '';
}

export function validarNombre(nombre) {
  if (!nombre) return MENSAJES_ERROR.NOMBRE_OBLIGATORIO;
  return '';
}

export function validarCargo(cargo) {
  if (!cargo) return MENSAJES_ERROR.CARGO_OBLIGATORIO;
  return '';
}

export function validarRol(rol) {
  if (!rol) return MENSAJES_ERROR.ROL_OBLIGATORIO;
  return '';
}

export function validarEstado(estado) {
  if (estado === '') return MENSAJES_ERROR.ESTADO_OBLIGATORIO;
  return '';
}

export function validarProyectos(proyecto) {
  if (!proyecto) return MENSAJES_ERROR.PROYECTOS_OBLIGATORIOS;
  return '';
}

/** === VALIDACIÓN COMPLETA: CREAR USUARIO === */
export function validarFormularioUsuario(datos) {
  const errores = {};

  const errorId = validarIdentificacion(datos.identificacion);
  if (errorId) errores.identificacion = errorId;

  const errorNombre = validarNombre(datos.nombreCompleto);
  if (errorNombre) errores.nombreCompleto = errorNombre;

  const errorCargo = validarCargo(datos.cargo);
  if (errorCargo) errores.cargo = errorCargo;

  const errorCorreo = validarCorreo(datos.correo);
  if (errorCorreo) errores.correo = errorCorreo;

  const errorRol = validarRol(datos.rol);
  if (errorRol) errores.rol = errorRol;

  const errorEstado = validarEstado(datos.estado);
  if (errorEstado) errores.estado = errorEstado;

  const errorProyectos = validarProyectos(datos.proyectosAsignados);
  if (errorProyectos) errores.proyectosAsignados = errorProyectos;

  return errores;
}

/** === VALIDACIÓN COMPLETA: EDITAR USUARIO (sin identificación) === */
export function validarFormularioEditarUsuario(datos) {
  const errores = {};

  const errorNombre = validarNombre(datos.nombreCompleto);
  if (errorNombre) errores.nombreCompleto = errorNombre;

  const errorCargo = validarCargo(datos.cargo);
  if (errorCargo) errores.cargo = errorCargo;

  const errorCorreo = validarCorreo(datos.correo);
  if (errorCorreo) errores.correo = errorCorreo;

  const errorRol = validarRol(datos.rol);
  if (errorRol) errores.rol = errorRol;

  const errorEstado = validarEstado(datos.estado);
  if (errorEstado) errores.estado = errorEstado;

  const errorProyectos = validarProyectos(datos.proyectosAsignados);
  if (errorProyectos) errores.proyectosAsignados = errorProyectos;

  return errores;
}

/** === VALIDACIÓN COMPLETA: RECUPERACIÓN DE CONTRASEÑA === */
export function validarFormularioRecuperacion({ correo, codigo }) {
  const errores = {};

  const errorCorreo = validarCorreo(correo);
  if (errorCorreo) errores.correo = errorCorreo;

  if (!codigo) {
    errores.codigo = MENSAJES_ERROR.CODIGO_OBLIGATORIO;
  }

  return errores;
}

/** === VALIDACIÓN COMPLETA: CAMBIO DE CONTRASEÑA NUEVA === */
export function validarFormularioContrasenaNueva({ contrasena, confirmar }) {
  const errores = {};

  const erroresSeguridad = validarContrasenaSegura(contrasena);
  if (erroresSeguridad.length > 0) {
    errores.contrasena = erroresSeguridad.join(' ');
  }

  if (!confirmar || contrasena !== confirmar) {
    errores.confirmar = MENSAJES_ERROR.CONTRASENA_NO_COINCIDE;
  }

  return errores;
}

export function validarCodigoRecuperacion(codigo) {
  if (!codigo || typeof codigo !== 'string' || codigo.trim().length === 0) {
    return MENSAJES_ERROR.CODIGO_OBLIGATORIO;
  }
  return '';
}
