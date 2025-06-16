import React, { useState } from 'react';
import '../styles/FormularioUsuario.css';
import api from '../api/axios';
import AlertaModal from './AlertaModal';

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

  const validarCorreo = (correo) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  const validar = () => {
    const nuevosErrores = {};

    if (!formulario.identificacion) nuevosErrores.identificacion = 'Campo obligatorio.';
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

    if (!validar()) {
      setAlerta({ mensaje: 'Por favor completa todos los campos obligatorios.', tipo: 'error' });
      return;
    }

    try {
      const nuevoUsuario = {
        ...formulario,
        estado: formulario.estado === 'true',
        proyectosAsignados: [formulario.proyectosAsignados]
      };

      const res = await api.post('/usuarios', nuevoUsuario);
      onUsuarioCreado(); // Recarga
    } catch (error) {
      if (error.response?.data?.errores) {
        setErrores(error.response.data.errores);
        setAlerta({ mensaje: 'Corrige los errores en los campos marcados.', tipo: 'error' });
      } else {
        const msg = error.response?.data?.mensaje?.toLowerCase() || '';
        const nuevosErrores = {};
        if (msg.includes('correo')) nuevosErrores.correo = 'Correo ya registrado.';
        if (msg.includes('id')) nuevosErrores.identificacion = 'ID ya fue registrado.';
        setErrores((prev) => ({ ...prev, ...nuevosErrores }));
        setAlerta({ mensaje: 'Verifica los errores marcados en rojo.', tipo: 'error' });
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
          {[
            { label: "Identificación", name: "identificacion" },
            { label: "Nombre completo", name: "nombreCompleto" },
            { label: "Cargo", name: "cargo" },
            { label: "Correo electrónico", name: "correo", type: "email" },
            { label: "Proyectos asignados", name: "proyectosAsignados" }
          ].map(({ label, name, type = "text" }) => (
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
