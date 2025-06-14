import React, { useState } from 'react';
import '../styles/FormularioUsuario.css'; // Asegúrate de tener este CSS
import api from '../api/axios';

const FormularioUsuario = ({ onClose, onUsuarioCreado }) => {
  const [formulario, setFormulario] = useState({
    identificacion: '',
    nombreCompleto: '',
    cargo: '',
    correo: '',
    rol: '',
    estado: true,
    proyectosAsignados: []
  });

  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!formulario.identificacion || !formulario.nombreCompleto || !formulario.correo || !formulario.rol) {
      setMensaje('Todos los campos obligatorios deben ser llenados.');
      return;
    }

    try {
      const nuevoUsuario = {
        ...formulario,
        proyectosAsignados: ['Ninguno'] // Puedes ajustar esto luego
      };

      const res = await api.post('/usuarios', nuevoUsuario);
      setMensaje(res.data.mensaje || 'Usuario creado con éxito.');
      onUsuarioCreado(); // 🔁 Actualiza la lista y cierra modal
    } catch (error) {
      console.error('Error al crear usuario:', error);
      setMensaje(error.response?.data?.mensaje || 'Error inesperado.');
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-formulario">
        <h3>Crear nuevo usuario</h3>
        <form onSubmit={handleSubmit}>
          <label>Identificación*</label>
          <input type="text" name="identificacion" value={formulario.identificacion} onChange={handleChange} required />

          <label>Nombre completo*</label>
          <input type="text" name="nombreCompleto" value={formulario.nombreCompleto} onChange={handleChange} required />

          <label>Cargo</label>
          <input type="text" name="cargo" value={formulario.cargo} onChange={handleChange} />

          <label>Correo electrónico*</label>
          <input type="email" name="correo" value={formulario.correo} onChange={handleChange} required />

          <label>Rol*</label>
          <select name="rol" value={formulario.rol} onChange={handleChange} required>
            <option value="">Selecciona un rol</option>
            <option value="Administrador">Administrador</option>
            <option value="Coord. Admon">Coord. Admon</option>
            <option value="Ejecutor de obra">Ejecutor de obra</option>
          </select>

          <label>Estado</label>
          <select name="estado" value={formulario.estado} onChange={handleChange}>
            <option value={true}>Activo</option>
            <option value={false}>Inactivo</option>
          </select>

          <div className="botones-formulario">
            <button type="submit" className="btn-guardar">Guardar</button>
            <button type="button" className="btn-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>

        {mensaje && <p className="mensaje">{mensaje}</p>}
      </div>
    </div>
  );
};

export default FormularioUsuario;

