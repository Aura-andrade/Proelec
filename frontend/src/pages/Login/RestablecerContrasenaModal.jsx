import React, { useState } from 'react';
import api from '../../api/axios';

const RestablecerContrasenaModal = ({ correo, onVerificarCodigo, onCancelar }) => {
  const [codigo, setCodigo] = useState('');
  const [error, setError] = useState('');

  const manejarVerificacion = async () => {
    if (!codigo.trim()) {
      return setError('Debes ingresar el código enviado a tu correo.');
    }

    try {
      await api.post('/auth/verificar-codigo', { correo, codigo });
      onVerificarCodigo(codigo);
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al verificar el código.';
      setError(mensaje);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Verificar Código</h2>
        <p>Introduce el código de recuperación enviado a <strong>{correo}</strong></p>

        <input
          type="text"
          placeholder="Código de verificación"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}

        <div className="modal-buttons">
          <button className="btn-cancelar" onClick={onCancelar}>Cancelar</button>
          <button className="btn-enviar" onClick={manejarVerificacion}>Verificar</button>
        </div>
      </div>
    </div>
  );
};

export default RestablecerContrasenaModal;
