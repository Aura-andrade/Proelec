import React, { useState, useEffect } from 'react';
import '../styles/FormularioUsuario.css';
import api from '../api/axios';

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

  const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const validar = () => {
    const nuevosErrores = {};

    if (!formulario.nombreCompleto) nuevosErrores.nombreCompleto = 'Campo obligatorio.';
    if (!formulario.cargo) nuevosErrores.cargo = 'Campo obligatorio.';
    if (!formulario.correo) {
      nuevosErrores.correo = 'Campo obligatorio.';
    } else if (!validarCorreo(formulario.correo)) {
      nuevosErrores.correo = 'Correo inválido.';
    }
    if (!formulario.rol) nuevosErrores.rol = 'Campo obligatorio.';
    if (!formulario.estado) nuevosErrores.estado = 'Campo obligatorio.';
    if (!formulario.proyectosAsignados) nuevosErrores.proyectosAsignados = 'Campo obligatorio.';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
    setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    if (!validar()) {
      setMensaje('Por favor corrige los errores en los campos.');
      return;
    }

    try {
      const usuarioActualizado = {
        ...formulario,
        estado: formulario.estado === 'true',
        proyectosAsignados: [formulario.proyectosAsignados]
      };

      const res = await api.put(`/usuarios/${usuario._id}`, usuarioActualizado);
      setMensaje(res.data.mensaje || 'Usuario actualizado.');
      onUsuarioActualizado();
    } catch (error) {
      const msg = error.response?.data?.mensaje?.toLowerCase() || '';
      const nuevosErrores = {};

      if (msg.includes('correo')) {
        nuevosErrores.correo = 'El correo ya está registrado por otro usuario.';
      }

      setErrores((prev) => ({ ...prev, ...nuevosErrores }));
      setMensaje('Corrige los errores en los campos.');
    }
  };

  const inputClass = (campo) =>
    errores[campo] ? 'input-error' : formulario[campo] ? 'input-ok' : '';

  return (
    <div className="modal-backdrop">
      <div className="modal-formulario">
        <h3 className="titulo-modal">Editar usuario</h3>
        <form onSubmit={handleSubmit} className="formulario-usuario">
          {/* Nombre */}
          <div className="campo">
            <label>
              Nombre completo <span className="requerido">*</span>
              {errores.nombreCompleto && <span className="error-label"> {errores.nombreCompleto}</span>}
            </label>
            <input
              name="nombreCompleto"
              value={formulario.nombreCompleto}
              onChange={handleChange}
              className={inputClass('nombreCompleto')}
            />
          </div>

          {/* Cargo */}
          <div className="campo">
            <label>
              Cargo <span className="requerido">*</span>
              {errores.cargo && <span className="error-label"> {errores.cargo}</span>}
            </label>
            <input
              name="cargo"
              value={formulario.cargo}
              onChange={handleChange}
              className={inputClass('cargo')}
            />
          </div>

          {/* Correo */}
          <div className="campo">
            <label>
              Correo electrónico <span className="requerido">*</span>
              {errores.correo && <span className="error-label"> {errores.correo}</span>}
            </label>
            <input
              name="correo"
              type="email"
              value={formulario.correo}
              onChange={handleChange}
              className={inputClass('correo')}
            />
          </div>

          {/* Rol */}
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

          {/* Estado */}
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

          {/* Proyecto */}
          <div className="campo">
            <label>
              Proyectos asignados <span className="requerido">*</span>
              {errores.proyectosAsignados && <span className="error-label"> {errores.proyectosAsignados}</span>}
            </label>
            <input
              name="proyectosAsignados"
              value={formulario.proyectosAsignados}
              onChange={handleChange}
              className={inputClass('proyectosAsignados')}
            />
          </div>

          {/* Mensaje */}
          {mensaje && <p className="mensaje">{mensaje}</p>}

          {/* Acciones */}
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
