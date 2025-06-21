import React, { useEffect, useState } from 'react';
import '../../styles/Usuarios.css';
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { SlUserFollow } from "react-icons/sl";
import { BiSortAlt2 } from "react-icons/bi";

import api from '../../api/axios';
import FormularioUsuario from '../../components/FormularioUsuario';
import EditarUsuario from '../../components/EditarUsuario';
import AlertaModal from '../../components/AlertaModal';
import { MENSAJES_ERROR, MENSAJES_EXITO, MENSAJES_CONFIRMACION } from '../../utils/mensajes';

const USUARIOS_POR_PAGINA = 10;

const Usuarios = ({ terminoBusqueda }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const [columnaOrden, setColumnaOrden] = useState(null);
  const [ordenAscendente, setOrdenAscendente] = useState(true);
  const [filtroRol, setFiltroRol] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [alerta, setAlerta] = useState(null);

  const cargarUsuarios = async () => {
    try {
      const respuesta = await api.get('/usuarios');
      setUsuarios(respuesta.data.usuarios || []);
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      mostrarAlerta({
        mensaje: MENSAJES_ERROR.ERROR_GENERAL,
        tipo: 'error'
      });
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const mostrarAlerta = ({ mensaje, tipo = 'info', onConfirmar = null, onCancelar = null }) => {
    setAlerta({ mensaje, tipo, onConfirmar, onCancelar });
  };

  const cerrarAlerta = () => setAlerta(null);

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombreCompleto.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.identificacion.toLowerCase().includes(terminoBusqueda.toLowerCase());

    const coincideRol = filtroRol === '' || usuario.rol === filtroRol;
    const coincideEstado = filtroEstado === '' || usuario.estado === (filtroEstado === 'true');

    return coincideBusqueda && coincideRol && coincideEstado;
  });

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

  const totalPaginas = Math.ceil(usuariosOrdenados.length / USUARIOS_POR_PAGINA);
  const usuariosPagina = usuariosOrdenados.slice(
    (pagina - 1) * USUARIOS_POR_PAGINA,
    pagina * USUARIOS_POR_PAGINA
  );

  const manejarOrden = (columna) => {
    if (columna === columnaOrden) {
      setOrdenAscendente(!ordenAscendente);
    } else {
      setColumnaOrden(columna);
      setOrdenAscendente(true);
    }
  };

  const confirmarEliminar = (usuario) => {
    mostrarAlerta({
      mensaje: MENSAJES_CONFIRMACION.ELIMINAR_USUARIO(usuario.nombreCompleto),
      tipo: 'confirmar',
      onConfirmar: () => eliminarUsuario(usuario._id),
      onCancelar: cerrarAlerta
    });
  };

  const eliminarUsuario = async (id) => {
    try {
      await api.delete(`/usuarios/${id}`);
      cargarUsuarios();
      cerrarAlerta();
      mostrarAlerta({
        mensaje: MENSAJES_EXITO.USUARIO_ELIMINADO,
        tipo: 'success'
      });
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      cerrarAlerta();
      mostrarAlerta({
        mensaje: MENSAJES_ERROR.ELIMINACION_FALLIDA,
        tipo: 'error'
      });
    }
  };

  return (
    <div className="usuarios-container">
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
                <button className="btn-editar" onClick={() => setUsuarioEditar(usuario)}>
                  <FaRegEdit />
                </button>
                <button className="btn-eliminar" onClick={() => confirmarEliminar(usuario)}>
                  <RiDeleteBin5Fill />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="paginacion">
        <button onClick={() => setPagina(pagina - 1)} disabled={pagina === 1}>
          &laquo; Anterior
        </button>
        <span>
          {Math.min(pagina * USUARIOS_POR_PAGINA, usuarios.length)} de {usuarios.length}
        </span>
        <button onClick={() => setPagina(pagina + 1)} disabled={pagina * USUARIOS_POR_PAGINA >= usuarios.length}>
          Siguiente &raquo;
        </button>
      </div>

      {mostrarFormulario && (
        <FormularioUsuario
          onClose={() => setMostrarFormulario(false)}
          onUsuarioCreado={() => {
            cargarUsuarios();
            setMostrarFormulario(false);
            mostrarAlerta({
              mensaje: MENSAJES_EXITO.USUARIO_CREADO,
              tipo: 'success'
            });
          }}
        />
      )}

      {usuarioEditar && (
        <EditarUsuario
          usuario={usuarioEditar}
          onClose={() => setUsuarioEditar(null)}
          onUsuarioActualizado={() => {
            cargarUsuarios();
            setUsuarioEditar(null);
            mostrarAlerta({
              mensaje: MENSAJES_EXITO.USUARIO_ACTUALIZADO,
              tipo: 'success'
            });
          }}
        />
      )}

      {alerta && (
        <AlertaModal
          mensaje={alerta.mensaje}
          tipo={alerta.tipo}
          onConfirmar={alerta.onConfirmar}
          onCancelar={alerta.onCancelar}
          onCerrar={cerrarAlerta}
        />
      )}
    </div>
  );
};

export default Usuarios;
