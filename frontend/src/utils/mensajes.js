export const MENSAJES_ERROR = {
  ID_OBLIGATORIO: 'La identificación es obligatoria.',
  NOMBRE_OBLIGATORIO: 'El nombre completo es obligatorio.',
  CARGO_OBLIGATORIO: 'El cargo es obligatorio.',
  CORREO_OBLIGATORIO: 'El correo es obligatorio.',
  CORREO_INVALIDO: 'El correo no tiene un formato válido.',
  ROL_OBLIGATORIO: 'El rol es obligatorio.',
  ESTADO_OBLIGATORIO: 'El estado es obligatorio.',
  PROYECTOS_OBLIGATORIOS: 'Debe asignar al menos un proyecto.',
  CORREO_REPETIDO: 'El correo ya fue registrado.',
  ID_REPETIDO: 'La identificación ya fue registrada.',
  CAMPOS_INCOMPLETOS: 'Por favor completa todos los campos obligatorios.',
  ERRORES_DE_CAMPO: 'Corrige los errores en los campos marcados.',
  ERROR_GENERAL: 'Verifica los errores marcados en rojo.'
};

export const MENSAJES_EXITO = {
  USUARIO_CREADO: 'Usuario creado con éxito. La contraseña ha sido enviada por correo.',
  USUARIO_ACTUALIZADO: 'Usuario actualizado correctamente.',
  USUARIO_ELIMINADO: 'Usuario eliminado correctamente.'
};

export const MENSAJES_CONFIRMACION = {
  ELIMINAR_USUARIO: (nombre) => `¿Está seguro de eliminar a ${nombre}?`
};
