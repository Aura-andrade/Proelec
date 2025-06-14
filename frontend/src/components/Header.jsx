import React from 'react';
import { FaUserCog } from "react-icons/fa";
import '../styles/Header.css';

const Header = ({ titulo, terminoBusqueda, setTerminoBusqueda,}) => {
  return (
    <header className="header">
      <h2>{titulo}</h2>
      <div className="busqueda-perfil">
        <input
          type="text"
          placeholder="Buscar por nombre o ID"
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        
        />
        <FaUserCog className="icono-perfil" />
      </div>
     
    </header>
  );
};

export default Header;
