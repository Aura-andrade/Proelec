import React, { useState } from 'react';
import PerfilMenu from './PerfilMenu';
import CambiarContrasenaModal from './CambiarContrasenaModal';
import '../styles/Header.css';

const Header = ({ titulo, terminoBusqueda, setTerminoBusqueda }) => {
  const [mostrarModalCambio, setMostrarModalCambio] = useState(false);

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');

    const recordarme = localStorage.getItem('recordarme');
    if (!recordarme) {
      localStorage.removeItem('recordarIdentificacion');
    }
    localStorage.removeItem('recordarme');

    window.location.href = '/';
  };

  const handleCambiarContrasena = () => {
    setMostrarModalCambio(true);
  };

  const cerrarModalCambio = () => {
    setMostrarModalCambio(false);
  };

  return (
    <header className="header">
      <h2 className="titulo-header">{titulo}</h2>

      <div className="barra-Busqueda">
        <input
          type="text"
          placeholder="Buscar por nombre o ID"
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
      </div>

      <div className="perfil-header">
        <PerfilMenu
          onCerrarSesion={handleCerrarSesion}
          onCambiarContrasena={handleCambiarContrasena}
        />
      </div>

      {mostrarModalCambio && (
        <CambiarContrasenaModal onClose={cerrarModalCambio} />
      )}
    </header>

  );
};

export default Header;
