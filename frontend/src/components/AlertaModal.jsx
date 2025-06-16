import React from 'react';
import '../styles/AlertaModal.css';

const AlertaModal = ({ mensaje, tipo, mostrar, onClose, onConfirmar }) => {
  if (!mostrar) return null;

  return (
    <div className="modal-alerta-backdrop">
      <div className="modal-alerta">
        <p className={`mensaje-${tipo}`}>{mensaje}</p>

        {tipo === 'confirmar' && (
          <div className="botones-alerta">
            <button onClick={() => onConfirmar(true)} className="btn-si">Sí</button>
            <button onClick={() => onConfirmar(false)} className="btn-no">No</button>
          </div>
        )}

        {tipo !== 'confirmar' && (
          <div className="botones-alerta">
            <button onClick={onClose} className="btn-cerrar">Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertaModal;
