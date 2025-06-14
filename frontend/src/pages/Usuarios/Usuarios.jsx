import React, { useEffect, useState } from 'react';
import '../../styles/Usuarios.css';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { SlUserFollow } from "react-icons/sl";
import { BiSortAlt2 } from "react-icons/bi";
import api from '../../api/axios';
import FormularioUsuario from '../../components/FormularioUsuario';

const USUARIOS_POR_PAGINA = 10;

const Usuarios = ({ terminoBusqueda }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [columnaOrden, setColumnaOrden] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Función para recargar usuarios desde el backend
  const cargarUsuarios = async () => {
    try {
      const respuesta = await api.get('/usuarios');
      setUsuarios(respuesta.data.usuarios || []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Filtrado por búsqueda, rol y estado
  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombreCompleto.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.identificacion.toLowerCase().includes(terminoBusqueda.toLowerCase());
    const coincideRol = filtroRol === '' || usuario.rol === filtroRol;
    const coincideEstado = filtroEstado === '' || usuario.estado === (filtroEstado === 'true');
    return coincideBusqueda && coincideRol && coincideEstado;
  });

  // Ordenamiento
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

  // Paginación
  const totalPaginas = Math.ceil(usuariosOrdenados.length / USUARIOS_POR_PAGINA);
  const usuariosPagina = usuariosOrdenados.slice(
    (pagina - 1) * USUARIOS_POR_PAGINA,
    pagina * USUARIOS_POR_PAGINA
  );

  const handleAnterior = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const handleSiguiente = () => {
    if (pagina * USUARIOS_POR_PAGINA < usuarios.length) setPagina(pagina + 1);
  };

  const manejarOrden = (columna) => {
    if (columna === columnaOrden) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setColumnaOrden(columna);
      setOrdenAscendente(true);
    }
  };

  return (
    <div className="usuarios-container">
      {/* Controles superiores */}
      <div className="controles-usuarios">
        <select value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
          <option value="">todos los roles</option>
          <option value="Administrador">Administrador</option>
          <option value="Coord. Admon">Coord. Admon</option>
          <option value="Ejecutor de obra">Ejecutor de obra</option>
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="">todos los estados</option>
          <option value="true">Activo</option>
          <option value="false">Inactivo</option>
        </select>
        <button className="btn-crear" onClick={() => setMostrarFormulario(true)}>
          <SlUserFollow /> Crear Usuario
        </button>
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
          <button onClick={handleSiguiente} disabled={pagina * USUARIOS_POR_PAGINA >= usuarios.length}>
            Siguiente &raquo;
          </button>
        </div>
      </div>

      {/* Formulario Modal */}
      {mostrarFormulario && (
        <FormularioUsuario
          onClose={() => setMostrarFormulario(false)}
          onUsuarioCreado={() => {
            cargarUsuarios();
            setMostrarFormulario(false);
          }}
        />
      )}
    </div>
  );
};

export default Usuarios;
