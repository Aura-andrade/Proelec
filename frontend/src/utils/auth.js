// Decodifica un token JWT y retorna el payload (datos del usuario)
export function decodificarToken(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload;
  } catch (error) {
    console.error("Error al decodificar el token", error);
    return null;
  }
}
