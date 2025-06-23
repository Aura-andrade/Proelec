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
  ERROR_GENERAL: 'Verifica los errores marcados en rojo.',
  CONTRASENA_NO_SEGURA: 'La contraseña no cumple con los requisitos de seguridad.',

  // Autenticación
  CORREO_NO_REGISTRADO: 'El correo ingresado no está registrado.',
  INTENTOS_EXCEDIDOS: 'Se han alcanzado los intentos máximos. Intenta de nuevo más tarde.',
  ERROR_SOLICITUD: 'Hubo un error al procesar la solicitud. Intenta de nuevo.',
  CODIGO_INVALIDO: 'El código ingresado no es válido o ha expirado.',
  ERROR_ACTUALIZAR_CONTRASENA: 'No se pudo actualizar la contraseña. Intenta de nuevo.'
};

export const MENSAJES_EXITO = {
  USUARIO_CREADO: 'Usuario creado con éxito. La contraseña ha sido enviada por correo.',
  USUARIO_ACTUALIZADO: 'Usuario actualizado correctamente.',
  USUARIO_ELIMINADO: 'Usuario eliminado correctamente.',
  CODIGO_ENVIADO: 'Se ha enviado un código de recuperación a tu correo electrónico.',
  CODIGO_VALIDO: 'Código verificado correctamente.',
  CONTRASENA_ACTUALIZADA: 'Tu contraseña ha sido actualizada con éxito.'
};

export const MENSAJES_CONFIRMACION = {
  ELIMINAR_USUARIO: (nombre) => `¿Está seguro de eliminar a ${nombre}?`
};
