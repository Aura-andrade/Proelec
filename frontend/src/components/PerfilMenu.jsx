import React, { useState, useRef, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import "../styles/PerfilMenu.css";


const PerfilMenu = ({ onCerrarSesion, onCambiarContrasena }) => {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);

  // Cerrar el menú si se hace clic fuera
  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMostrarMenu(false);
      }
    };
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  return (
    <div className="perfil-menu" ref={menuRef}>
      <FaUserCircle className="icono-perfil" onClick={() => setMostrarMenu(!mostrarMenu)} />

      {mostrarMenu && (
        <ul className="menu-desplegable">
          <li onClick={() => {
            onCambiarContrasena();
            setMostrarMenu(false);
          }}>Cambiar contraseña</li>

          <li onClick={() => {
            onCerrarSesion();
            setMostrarMenu(false);
          }}>Cerrar sesión</li>
        </ul>
      )}
    </div>
  );
};

export default PerfilMenu;
