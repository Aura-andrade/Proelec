import React, { useState } from 'react';
import '../styles/FormularioUsuario.css';
import api from '../api/axios';
import AlertaModal from './AlertaModal';
import { MENSAJES_ERROR, MENSAJES_EXITO } from '../utils/mensajes';

const FormularioUsuario = ({ onClose, onUsuarioCreado }) => {
  const [formulario, setFormulario] = useState({
    identificacion: '',
    nombreCompleto: '',
    cargo: '',
    correo: '',
    rol: '',
    estado: 'true',
    proyectosAsignados: ''
  });

  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(null);

  const validarCorreo = (correo) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.identificacion) nuevosErrores.identificacion = MENSAJES_ERROR.ID_OBLIGATORIO;
    if (!formulario.nombreCompleto) nuevosErrores.nombreCompleto = MENSAJES_ERROR.NOMBRE_OBLIGATORIO;
    if (!formulario.cargo) nuevosErrores.cargo = MENSAJES_ERROR.CARGO_OBLIGATORIO;
    if (!formulario.correo) {
      nuevosErrores.correo = MENSAJES_ERROR.CORREO_OBLIGATORIO;
    } else if (!validarCorreo(formulario.correo)) {
      nuevosErrores.correo = MENSAJES_ERROR.CORREO_INVALIDO;
    }
    if (!formulario.rol) nuevosErrores.rol = MENSAJES_ERROR.ROL_OBLIGATORIO;
    if (!formulario.estado) nuevosErrores.estado = MENSAJES_ERROR.ESTADO_OBLIGATORIO;
    if (!formulario.proyectosAsignados) nuevosErrores.proyectosAsignados = MENSAJES_ERROR.PROYECTOS_OBLIGATORIOS;

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
    if (!validar()) {
      setAlerta({ mensaje: MENSAJES_ERROR.CAMPOS_INCOMPLETOS, tipo: 'error' });
      return;
    }

    try {
      const nuevoUsuario = {
        ...formulario,
        estado: formulario.estado === 'true',
        proyectosAsignados: [formulario.proyectosAsignados]
      };

      await api.post('/usuarios', nuevoUsuario);
      onUsuarioCreado();
    } catch (error) {
      if (error.response?.data?.errores) {
        setErrores(error.response.data.errores);
        setAlerta({ mensaje: MENSAJES_ERROR.ERRORES_DE_CAMPO, tipo: 'error' });
      } else {
        const msg = error.response?.data?.mensaje?.toLowerCase() || '';
        const nuevosErrores = {};
        if (msg.includes('correo')) nuevosErrores.correo = MENSAJES_ERROR.CORREO_REPETIDO;
        if (msg.includes('id')) nuevosErrores.identificacion = MENSAJES_ERROR.ID_REPETIDO;
        setErrores((prev) => ({ ...prev, ...nuevosErrores }));
        setAlerta({ mensaje: MENSAJES_ERROR.ERROR_GENERAL, tipo: 'error' });
      }
    }
  };

  const inputClass = (campo) =>
    errores[campo] ? 'input-error' : formulario[campo] ? 'input-ok' : '';

  return (
    <div className="modal-backdrop">
      <div className="modal-formulario">
        <h3 className="titulo-modal">Crear nuevo usuario</h3>
        <form onSubmit={handleSubmit} className="formulario-usuario">
          {[{ label: 'Identificación', name: 'identificacion' },
            { label: 'Nombre completo', name: 'nombreCompleto' },
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
            <select name="rol" value={formulario.rol} onChange={handleChange} className={inputClass('rol')}>
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
            <select name="estado" value={formulario.estado} onChange={handleChange} className={inputClass('estado')}>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div className="acciones-formulario">
            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>

        <p className="leyenda-requeridos">
          Los campos marcados <span className="requerido">*</span> son obligatorios.
        </p>

        {alerta && (
          <AlertaModal
            mensaje={alerta.mensaje}
            tipo={alerta.tipo}
            onCerrar={() => setAlerta(null)}
          />
        )}
      </div>
    </div>
  );
};

export default FormularioUsuario;
