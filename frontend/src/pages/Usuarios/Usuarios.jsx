import React, { useEffect, useState } from 'react';
import '../../styles/Usuarios.css';
import Header from '../../components/Header';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { SlUserFollow } from "react-icons/sl";
import { BiSortAlt2 } from "react-icons/bi";
import api from '../../api/axios'; // Asegúrate que este archivo exista

const USUARIOS_POR_PAGINA = 10;

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]); // Estado para usuarios reales
  const [pagina, setPagina] = useState(1);

  const [columnaOrden, setColumnaOrden] = useState(null); // nombreCompleto, rol, estado
const [ordenAscendente, setOrdenAscendente] = useState(true);

const [terminoBusqueda, setTerminoBusqueda] = useState('');

// 1. Filtrar por término de búsqueda
const usuariosFiltrados = usuarios.filter(usuario =>
  usuario.nombreCompleto.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
  usuario.identificacion.toLowerCase().includes(terminoBusqueda.toLowerCase())
);

// 2. Ordenar si hay columna seleccionada
const usuariosOrdenados = [...usuariosFiltrados];
if (columnaOrden) {
  usuariosOrdenados.sort((a, b) => {
    const valorA = a[columnaOrden]?.toString().toLowerCase() || '';
    const valorB = b[columnaOrden]?.toString().toLowerCase() || '';
    if (valorA < valorB) return ordenAscendente ? -1 : 1;
    if (valorA > valorB) return ordenAscendente ? 1 : -1;
    return 0;
  });
}

// 3. Calcular total de páginas con los datos filtrados
const totalPaginas = Math.ceil(usuariosOrdenados.length / USUARIOS_POR_PAGINA);

// 4. Aplicar paginación
const usuariosPagina = usuariosOrdenados.slice(
  (pagina - 1) * USUARIOS_POR_PAGINA,
  pagina * USUARIOS_POR_PAGINA
);

  const handleAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const handleSiguiente = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  // Cargar los usuarios desde el backend al montar el componente
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const respuesta = await api.get('/usuarios'); // Debes tener esta ruta en tu backend
        setUsuarios(respuesta.data.usuarios || []); // Ajusta si tu backend devuelve otro formato
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    obtenerUsuarios();
  }, []);

  const manejarOrden = (columna) => {
  if (columna === columnaOrden) {
    // Si ya está ordenando por esta columna, invertimos el orden
    setOrdenAscendente(!ordenAscendente);
  } else {
    // Si es una columna nueva, la establecemos y por defecto ascendente
    setColumnaOrden(columna);
    setOrdenAscendente(true);
  }
};


  return (
    <div className="usuarios-container">
  
      {/* Controles superiores */}
      <div className="controles-usuarios">
        <select>
          <option value="">todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Coord. Admon">Coord. Admon</option>
          <option value="Ejecutor">Ejecutor de obra</option>
        </select>
        <select>
          <option value="">todos los estados</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <button className="btn-crear"><SlUserFollow />  Crear Usuario</button>
      </div>

      {/* Tabla de usuarios */}
      <table className="tabla-usuarios">
        <thead>
          <tr>
            <th>
              Nombre <BiSortAlt2 className="icono-orden" onClick={() => manejarOrden("nombreCompleto")} />
            </th>
            <th>Identificación</th>
            <th>Correo</th>
            <th>
              Rol <BiSortAlt2 className="icono-orden" onClick={() => manejarOrden("rol")} />
            </th>
            <th>
              Estado <BiSortAlt2 className="icono-orden" onClick={() => manejarOrden("estado")} />
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosPagina.map((usuario, idx) => (
            <tr key={usuario._id || idx}>
              <td>{usuario.nombreCompleto}</td>
              <td>{usuario.identificacion}</td>
              <td>{usuario.correo}</td>
              <td>{usuario.rol}</td>
              <td className={usuario.estado ? "activo" : "inactivo"}>
                {usuario.estado ? "Activo" : "Inactivo"}
              </td>
              <td>
                <button className="btn-editar"><FaRegEdit /></button>
                <button className="btn-eliminar"><RiDeleteBin5Fill /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="paginacion">
        <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
          <button onClick={handleAnterior} disabled={pagina === 1}>
            &laquo; Anterior
          </button>
          <span style={{ margin: "0 12px" }}>
            {Math.min(pagina * USUARIOS_POR_PAGINA, usuarios.length)} de {usuarios.length}
          </span>

          <button onClick={handleSiguiente} disabled={pagina === totalPaginas}>
            Siguiente &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Usuarios;
