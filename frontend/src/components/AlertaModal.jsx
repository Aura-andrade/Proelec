import React from 'react';
import '../styles/AlertaModal.css';

const AlertaModal = ({ mensaje, tipo, onConfirmar, onCancelar, onCerrar }) => {
  return (
    <div className="modal-alerta-backdrop">
      <div className="modal-alerta">
        <p className={`mensaje-${tipo}`}>{mensaje}</p>

        {tipo === 'confirmar' ? (
          <div className="botones-alerta">
            <button onClick={() => {
              if (onConfirmar) onConfirmar();
            }} className="btn-si">Sí</button>
            <button onClick={() => {
              if (onCancelar) onCancelar();
            }} className="btn-no">No</button>
          </div>
        ) : (
          <div className="botones-alerta">
            <button onClick={onCerrar} className="btn-cerrar">Cerrar</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertaModal;
