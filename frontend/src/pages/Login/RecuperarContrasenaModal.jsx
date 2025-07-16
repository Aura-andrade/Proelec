import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import api from '../../api/axios';
import { MENSAJES_ERROR, MENSAJES_EXITO } from '../../utils/mensajes';
import { validarCorreo } from '../../utils/validadores';
import '../../styles/Modales.css';

const RecuperarContrasenaModal = ({ onClose, onCodigoEnviado }) => {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setMensaje('');
    setError('');

    const errorValidacion = validarCorreo(correo);
    if (errorValidacion) {
      setError(errorValidacion);
      return;
    }

    try {
      const response = await api.post('/auth/recuperar', { correo });

      if (response.status === 200) {
        setMensaje(MENSAJES_EXITO.CODIGO_ENVIADO);
        setTimeout(() => onCodigoEnviado(correo), 500);
      } else {
        setError(MENSAJES_ERROR.ERROR_SOLICITUD);
      }
    } catch (err) {
      if (err.response?.data?.mensaje === MENSAJES_ERROR.CORREO_NO_REGISTRADO) {
        setError(MENSAJES_ERROR.CORREO_NO_REGISTRADO);
      } else if (err.response?.data?.mensaje === MENSAJES_ERROR.INTENTOS_EXCEDIDOS) {
        setError(MENSAJES_ERROR.INTENTOS_EXCEDIDOS);
      } else {
        setError(MENSAJES_ERROR.ERROR_SOLICITUD);
      }
    }
  };

  const cerrarFondo = (e) => {
    if (e.target.classList.contains('modal-backdrop')) onClose();
  };

  const inputClass = correo
    ? error
      ? 'input-error'
      : 'input-ok'
    : '';

  return (
    <div className="modal-backdrop" onClick={cerrarFondo}>
      <div className="modal-formulario">
        <button className="cerrar-modal" type="button" onClick={onClose}>
          <IoMdClose size={20} />
        </button>

        <h2 className="titulo-modal">RECUPERAR CONTRASEÑA</h2>
        <p className="descripcion-modal">
          Introduce tu correo electrónico registrado
        </p>

        <form autoComplete="off">
          <input
            type="email"
            name="correo-recuperacion"
            id="correo"
            autoComplete="off"
            placeholder="ejemplo@dominio.com"
            value={correo}
            onChange={(e) => {
              setCorreo(e.target.value);
              setError('');
              setMensaje('');
            }}
            className={inputClass}
          />
          {error && <p className="mensaje-error">{error}</p>}
          {mensaje && <p className="mensaje-exito">{mensaje}</p>}

          <button
            type="button"
            className="btn-enviar"
            id="btn-evitar-autocompletar"
            onClick={handleSubmit}
          >
            Enviar código
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecuperarContrasenaModal;
