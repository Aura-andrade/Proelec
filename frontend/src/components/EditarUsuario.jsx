import React, { useState, useEffect } from 'react';
import '../styles/FormularioUsuario.css';
import api from '../api/axios';
import { MENSAJES_ERROR, MENSAJES_EXITO } from '../utils/mensajes';
import { validarFormularioEditarUsuario } from '../utils/validadores';

const EditarUsuario = ({ usuario, onClose, onUsuarioActualizado }) => {
  const [formulario, setFormulario] = useState({
    nombreCompleto: '',
    cargo: '',
    correo: '',
    rol: '',
    estado: 'true',
    proyectosAsignados: ''
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (usuario) {
      setFormulario({
        nombreCompleto: usuario.nombreCompleto || '',
        cargo: usuario.cargo || '',
        correo: usuario.correo || '',
        rol: usuario.rol || '',
        estado: usuario.estado?.toString() || 'true',
        proyectosAsignados: usuario.proyectosAsignados?.[0] || ''
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
    setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    const nuevosErrores = validarFormularioEditarUsuario(formulario);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      setMensaje(MENSAJES_ERROR.ERRORES_DE_CAMPO);
      return;
    }

    try {
      const usuarioActualizado = {
        ...formulario,
        estado: formulario.estado === 'true',
        proyectosAsignados: [formulario.proyectosAsignados]
      };

      const res = await api.put(`/usuarios/${usuario._id}`, usuarioActualizado);
      setMensaje(res.data.mensaje || MENSAJES_EXITO.USUARIO_ACTUALIZADO);
      onUsuarioActualizado();
    } catch (error) {
      const msg = error.response?.data?.mensaje?.toLowerCase() || '';
      const nuevosErrores = {};

      if (msg.includes('correo')) {
        nuevosErrores.correo = MENSAJES_ERROR.CORREO_REPETIDO;
      }

      setErrores((prev) => ({ ...prev, ...nuevosErrores }));
      setMensaje(MENSAJES_ERROR.ERRORES_DE_CAMPO);
    }
  };

  const inputClass = (campo) =>
    errores[campo] ? 'input-error' : formulario[campo] ? 'input-ok' : '';

  return (
    <div className="modal-backdrop">
      <div className="modal-formulario">
        <h3 className="titulo-modal">Editar usuario</h3>
        <form onSubmit={handleSubmit} className="formulario-usuario">
          {[{ label: 'Nombre completo', name: 'nombreCompleto' },
            { label: 'Cargo', name: 'cargo' },
            { label: 'Correo electrónico', name: 'correo', type: 'email' },
            { label: 'Proyectos asignados', name: 'proyectosAsignados' }].map(({ label, name, type = 'text' }) => (
            <div className="campo" key={name}>
              <label>
                {label} <span className="requerido">*</span>
                {errores[name] && <span className="error-label"> {errores[name]}</span>}
              </label>
              <input
                name={name}
                type={type}
                value={formulario[name]}
                onChange={handleChange}
                className={inputClass(name)}
              />
            </div>
          ))}

          <div className="campo">
            <label>
              Rol <span className="requerido">*</span>
              {errores.rol && <span className="error-label"> {errores.rol}</span>}
            </label>
            <select
              name="rol"
              value={formulario.rol}
              onChange={handleChange}
              className={inputClass('rol')}
            >
              <option value="">Selecciona un rol</option>
              <option value="Administrador">Administrador</option>
              <option value="Coord. Admon">Coordinador Admon</option>
              <option value="Ejecutor de obra">Ejecutor de obra</option>
            </select>
          </div>

          <div className="campo">
            <label>
              Estado <span className="requerido">*</span>
              {errores.estado && <span className="error-label"> {errores.estado}</span>}
            </label>
            <select
              name="estado"
              value={formulario.estado}
              onChange={handleChange}
              className={inputClass('estado')}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          {mensaje && <p className="mensaje">{mensaje}</p>}

          <div className="acciones-formulario">
            <button type="submit" className="btn-guardar">Guardar cambios</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>

        <p className="leyenda-requeridos">
          Los campos marcados <span className="requerido">*</span> son obligatorios.
        </p>
      </div>
    </div>
  );
};

export default EditarUsuario;
