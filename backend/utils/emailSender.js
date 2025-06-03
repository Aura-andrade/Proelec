// utils/emailSender.js
const nodemailer = require('nodemailer');

const enviarCorreo = async (destinatario, asunto, mensajeHTML) => {
  // Configura el servicio de correo (usaremos Gmail como ejemplo)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.CORREO_APP,    // Tu correo
      pass: process.env.CLAVE_CORREO   // Contraseña de aplicación o clave SMTP
    },
    tls: {
    rejectUnauthorized: false  // Acepta certificados no verificados. Cuando pases a producción, debo quitar la línea tls: { rejectUnauthorized: false } y alojar el sistema en un servidor con certificado válido.
    }
  });

  // Define el contenido del mensaje
  const mailOptions = {
    from: `"ProElec - Sistema de Gestión" <${process.env.CORREO_APP}>`,
    to: destinatario,
    subject: asunto,
    html: mensajeHTML
  };

  // Envía el correo
  await transporter.sendMail(mailOptions);
};

module.exports = enviarCorreo;
