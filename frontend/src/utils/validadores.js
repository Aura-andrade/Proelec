export function validarContrasenaSegura(contrasena) {
  const errores = [];

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
