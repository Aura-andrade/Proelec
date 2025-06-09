import React from 'react';
import '../../styles/ListadoUsuarios.css'; // Importamos los estilos
import { FaRegEdit, FaUserCog } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";


const ListadoUsuarios = () => {
  return (
    <div className="contenido-principal">
      <div className="barra-superior">
        <div className="espacio-perfil">
          <FaUserCog size={35} color="#444" />
       </div>
    </div>
      <h1>Listado de Usuarios</h1>

      <div className="filtros">
        <input type="text" placeholder="Buscar por nombre o ID" />
        <select>
          <option value="">Todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="coord. admon">Coord. Admon</option>
          <option value="Ejecutores de obra">Ejecutores de Obra</option>
        </select>
        <select>
          <option value="">Todos los estados</option>
          <option value="true">Activo</option>
          <option value="false">Inhabilitado</option>
        </select>
      </div>

      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Identificacion</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Aquí luego se llenarán dinámicamente los usuarios */}
          <tr>
            <td>Ejemplo Usuario con apellido</td>
            <td>123456789</td>
            <td>ejemplo1549@correo.com</td>
            <td>Administrador</td>
            <td className="activo">Activo</td>
            <td>
              <button className="btn-editar"><FaRegEdit/></button>
              <button className="btn-eliminar"><RiDeleteBin5Fill/></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ListadoUsuarios;
