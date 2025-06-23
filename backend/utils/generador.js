const generarCadenaAleatoria = (longitud = 10) => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let cadena = '';
  for (let i = 0; i < longitud; i++) {
    cadena += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return cadena;
};

module.exports = {
  generarCadenaAleatoria
};
