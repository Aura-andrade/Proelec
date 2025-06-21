import React from 'react';
import '../styles/AlertaModal.css';
import { FiInfo, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const AlertaModal = ({ mensaje, tipo = 'info', onConfirmar, onCancelar, onCerrar }) => {
  const renderIcono = () => {
    switch (tipo) {
      case 'success':
        return <FiCheckCircle style={{ color: '#2e7d32', fontSize: '1.4rem' }} />;
      case 'error':
        return <FiAlertTriangle style={{ color: '#c62828', fontSize: '1.4rem' }} />;
      case 'confirmar':
        return <FiAlertTriangle style={{ color: '#162941', fontSize: '1.4rem' }} />;
      default:
        return <FiInfo style={{ color: '#0288d1', fontSize: '1.4rem' }} />;
    }
  };

  const renderBotones = () => {
    if (tipo === 'confirmar') {
      return (
        <div className="botones-alerta">
          <button onClick={onConfirmar} className="btn-si">Sí</button>
          <button onClick={onCancelar || onCerrar} className="btn-no">No</button>
        </div>
      );
    }

    return (
      <div className="botones-alerta">
        <button onClick={onCerrar} className="btn-cerrar">Cerrar</button>
      </div>
    );
  };

  return (
    <div className="modal-alerta-backdrop">
      <div className="modal-alerta">
        <p className={`mensaje-${tipo}`}>
          {renderIcono()} <span style={{ marginLeft: '8px' }}>{mensaje}</span>
        </p>
        {renderBotones()}
      </div>
    </div>
  );
};

export default AlertaModal;
