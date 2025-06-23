const MENSAJES= {
  USUARIO: {
    ID_OBLIGATORIO: 'La identificación es obligatoria.',
    NOMBRE_OBLIGATORIO: 'El nombre completo es obligatorio.',
    CARGO_OBLIGATORIO: 'El cargo es obligatorio.',
    CORREO_OBLIGATORIO: 'El correo es obligatorio.',
    CORREO_INVALIDO: 'El correo no tiene un formato válido.',
    ROL_OBLIGATORIO: 'El rol es obligatorio.',
    ESTADO_OBLIGATORIO: 'El estado es obligatorio.',
    PROYECTOS_OBLIGATORIOS: 'Debe asignar al menos un proyecto.',
    YA_EXISTE_ID: 'La identificación ya fue registrada.',
    YA_EXISTE_CORREO: 'El correo ya fue registrado.',
    CORREO_DUPLICADO: 'El correo ya está registrado por otro usuario.',
    CAMPOS_OBLIGATORIOS: 'Todos los campos son obligatorios.',
    ERROR_REGISTRO: 'Error al registrar usuario.',
    ERROR_ACTUALIZACION: 'Error al actualizar usuario.',
    ERROR_ESTADO: 'Error al cambiar el estado del usuario.',
    ERROR_ELIMINAR: 'Error al eliminar usuario.',
    NO_ENCONTRADO: 'Usuario no encontrado.',
    ELIMINADO: 'Usuario eliminado permanentemente.',
    CREADO: 'Usuario creado con éxito. La contraseña ha sido enviada por correo.',
    CAMBIO_ESTADO_OK: (estado) => `Usuario ${estado ? 'activado' : 'inhabilitado'} correctamente.`,
    TERMINO_OBLIGATORIO: 'Debe enviar un término de búsqueda.',
    ERROR_AUTOCOMPLETAR: 'Error al autocompletar usuarios.',
    ERROR_LISTAR: 'Error al obtener usuarios.',
    CONTRASENA_NO_SEGURA: 'La contraseña no cumple con los requisitos de seguridad.',
  },

  AUTH: {
    CORREO_OBLIGATORIO: 'El correo es obligatorio.',
    CORREO_NO_REGISTRADO: 'El correo ingresado no está registrado.',
    INTENTOS_EXCEDIDOS: 'Se han alcanzado los intentos máximos. Intenta de nuevo más tarde.',
    ERROR_SOLICITUD: 'Hubo un error al procesar la solicitud. Intenta de nuevo.',
    CODIGO_ENVIADO: 'Se ha enviado un código de recuperación a tu correo electrónico.',
    CODIGO_VALIDO: 'Código verificado correctamente.',
    CODIGO_INVALIDO: 'El código ingresado no es válido o ha expirado.',
    CONTRASENA_ACTUALIZADA: 'Tu contraseña ha sido actualizada con éxito.',
    ERROR_ACTUALIZAR_CONTRASENA: 'No se pudo actualizar la contraseña. Intenta de nuevo.',
    TOKEN_NO_PROPORCIONADO: 'Token no proporcionado.',
    TOKEN_INVALIDO: 'Token inválido o expirado.',
    ROL_NO_AUTORIZADO: 'No tienes permisos para realizar esta acción.'
  }
};

module.exports = MENSAJES;