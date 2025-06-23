import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import api from '../../api/axios';

const RecuperarContrasenaModal = ({ onClose, onCodigoEnviado }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    if (!correo.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }

    try {
      setCargando(true);
      const respuesta = await api.post('/auth/recuperar', { correo });
      setMensaje(respuesta.data.mensaje);
      onCodigoEnviado(correo);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al enviar el código.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="cerrar-modal" onClick={onClose}>
          <IoMdClose size={20} />
        </button>
        <h2 className="titulo-modal">RECUPERAR CONTRASEÑA</h2>
        <p className="descripcion-modal">
          Introduce tu correo electrónico para restablecer la contraseña
        </p>

        <form onSubmit={manejarEnvio}>
          <input
            type="email"
            placeholder="Dirección de correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
          />

          <p className="ayuda-modal">
            Este correo debe coincidir con el registrado en el sistema.
          </p>

          {mensaje && <p className="mensaje-exito">{mensaje}</p>}
          {error && <p className="mensaje-error">{error}</p>}

          <button type="submit" className="btn-enviar" disabled={cargando}>
            {cargando ? 'Enviando...' : 'Enviar código'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarContrasenaModal;
