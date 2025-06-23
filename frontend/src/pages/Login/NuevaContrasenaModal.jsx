import React, { useState } from 'react';
import api from '../../api/axios';
import { validarContrasenaSegura } from '../../utils/validadores';
import AlertaModal from "../../components/AlertaModal";

const NuevaContrasenaModal = ({ correo, onClose }) => {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [errores, setErrores] = useState([]);
  const [alerta, setAlerta] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores([]);

    if (!nuevaContrasena || !confirmarContrasena) {
      setErrores(['Ambos campos son obligatorios.']);
      return;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      setErrores(['Las contraseñas no coinciden.']);
      return;
    }

    const erroresValidacion = validarContrasenaSegura(nuevaContrasena);
    if (erroresValidacion.length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    try {
      await api.post('/auth/restablecer-contrasena', {
        correo,
        codigo: 'manual',
        nuevaContrasena
      });

      setAlerta({ mensaje: 'Tu contraseña ha sido actualizada con éxito.', tipo: 'exito' });
      setTimeout(onClose, 2000);
    } catch (error) {
      console.error(error);
      setAlerta({ mensaje: 'Error al actualizar la contraseña.', tipo: 'error' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Establecer nueva contraseña</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nueva contraseña</label>
            <input
              type="password"
              value={nuevaContrasena}
              onChange={(e) => setNuevaContrasena(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={confirmarContrasena}
              onChange={(e) => setConfirmarContrasena(e.target.value)}
              required
            />
          </div>

          {errores.length > 0 && (
            <ul className="error-msg">
              {errores.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          )}

          <div className="modal-buttons">
            <button type="submit" className="btn-enviar">Actualizar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>

        {alerta && (
          <AlertaModal
            mensaje={alerta.mensaje}
            tipo={alerta.tipo}
            onCerrar={() => setAlerta(null)}
          />
        )}
      </div>
    </div>
  );
};

export default NuevaContrasenaModal;
