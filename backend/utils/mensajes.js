// utils/mensajes.js

module.exports = {
  USUARIO: {
    NO_ENCONTRADO: 'Usuario no encontrado.',
    YA_EXISTE_ID: 'La identificación ya fue registrada.',
    YA_EXISTE_CORREO: 'El correo ya fue registrado.',
    CAMPOS_OBLIGATORIOS: 'Todos los campos son obligatorios.',
    CORREO_DUPLICADO: 'El correo ya está registrado por otro usuario.',
    CAMBIO_ESTADO_OK: (estado) => `Usuario ${estado ? 'activado' : 'inhabilitado'} correctamente.`,
    ELIMINADO: 'Usuario eliminado permanentemente.',
    ERROR_REGISTRO: 'Error al registrar usuario.',
    ERROR_ACTUALIZACION: 'Error al actualizar usuario.',
    ERROR_ESTADO: 'Error al cambiar el estado del usuario.',
    ERROR_ELIMINAR: 'Error al eliminar usuario.',
    TERMINO_OBLIGATORIO: 'Debe enviar un término de búsqueda.',
    ERROR_AUTOCOMPLETAR: 'Error al autocompletar usuarios.',
    ERROR_LISTAR: 'Error al obtener usuarios.',
  }
};
