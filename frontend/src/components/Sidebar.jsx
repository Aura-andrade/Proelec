// Importamos lo necesario desde React
import React from "react";

// Importamos los íconos desde react-icons (FontAwesome)
import { FaHome, FaBuilding, FaUser, FaDonate } from "react-icons/fa";

// Importamos los estilos del sidebar
import "../styles/Sidebar.css";

// Importamos la imagen del logo
import logo from "../assets/logo.png";

// Definimos el componente Sidebar
function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar-logo sidebar-logo-top">
        <img src={logo} alt="Logo ProElec" />
        <p><strong>ProElec</strong></p>
      </div>
      <ul className="menu">
        <li>
          <FaHome />
          <span>Inicio</span>
        </li>
        <li>
          <FaBuilding />
          <span>Proyectos</span>
        </li>
        <li>
          <FaUser />
          <span>Usuarios</span>
        </li>
        <li>
          <FaDonate />
          <span>Retegarantías</span>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
