import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import './Login.css';
import { FaUserLock } from 'react-icons/fa';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import RecuperarContrasenaModal from "./RecuperarContrasenaModal";
import RestablecerContrasenaModal from "./RestablecerContrasenaModal";
import NuevaContrasenaModal from "./NuevaContrasenaModal";
import AlertaModal from '../../components/AlertaModal';

const Login = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [recordarme, setRecordarme] = useState(false);

  const [mostrarModalRecuperar, setMostrarModalRecuperar] = useState(false);
  const [mostrarModalRestablecer, setMostrarModalRestablecer] = useState(false);
  const [mostrarModalNueva, setMostrarModalNueva] = useState(false);
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const [alerta, setAlerta] = useState(null);

  const navigate = useNavigate();

  const abrirModalRecuperar = () => {
    setMostrarModalRecuperar(true);
  };

  const cerrarModales = () => {
    setMostrarModalRecuperar(false);
    setMostrarModalRestablecer(false);
    setMostrarModalNueva(false);
  };

  const avanzarARestablecer = (correo) => {
    setCorreoRecuperacion(correo);
    setMostrarModalRecuperar(false);
    setMostrarModalRestablecer(true);
  };

  const avanzarANueva = () => {
    setMostrarModalRestablecer(false);
    setMostrarModalNueva(true);
  };

  const manejarLogin = async (e) => {
    e.preventDefault();

    if (!identificacion || !contrasena) {
      setAlerta({ tipo: 'error', mensaje: 'Por favor, completa ambos campos.' });
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        identificacion,
        contrasena
      });

      // Guardar token y datos de usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('usuario', JSON.stringify(response.data.usuario));

      // Redireccionar al módulo de usuarios
      navigate('/usuarios');
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || 'Error al iniciar sesión.';
      setAlerta({ tipo: 'error', mensaje });
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-left">
        <img src={logo} alt="Logo ProElec" className="logo" />
        <h1 className="titulo">ProElec</h1>
        <p className="eslogan">Transformando la gestión de proyectos eléctricos</p>
      </div>

      <div className="login-right">
        <form className="login-form" onSubmit={manejarLogin}>
          <FaUserLock className="icono-login" />
          <h1>Iniciar Sesión</h1>

          <div className="form-group">
            <label>Identificación</label>
            <input
              type="text"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
            />
          </div>

          <div className="form-group recordarme">
            <input
              type="checkbox"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
              id="recordarme"
            />
            <label htmlFor="recordarme">Re<span style={{ display: "none" }}>-</span>cordarme</label>
          </div>

          <button type="submit" className="btn-login">Ingresar</button>

          <div className="forgot-link">
            <a href="#" onClick={abrirModalRecuperar}>¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>

      {/* Modales de recuperación de contraseña */}
      {mostrarModalRecuperar && (
        <RecuperarContrasenaModal
          onClose={cerrarModales}
          onCodigoEnviado={avanzarARestablecer}
        />
      )}

      {mostrarModalRestablecer && (
        <RestablecerContrasenaModal
          correo={correoRecuperacion}
          onClose={cerrarModales}
          onCodigoVerificado={avanzarANueva}
        />
      )}

      {mostrarModalNueva && (
        <NuevaContrasenaModal
          correo={correoRecuperacion}
          onClose={cerrarModales}
        />
      )}

      {/* Alerta de error */}
      {alerta && (
        <AlertaModal
          tipo={alerta.tipo}
          mensaje={alerta.mensaje}
          onCerrar={() => setAlerta(null)}
        />
      )}
    </div>
  );
};

export default Login;
