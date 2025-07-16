import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import './Login.css';
import { FaUserLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

import RecuperarContrasenaModal from './RecuperarContrasenaModal';
import RestablecerContrasenaModal from './RestablecerContrasenaModal';
import NuevaContrasenaModal from './NuevaContrasenaModal';

import { MENSAJES_ERROR } from '../../utils/mensajes';

const Login = () => {
  const [identificacion, setIdentificacion] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [recordarme, setRecordarme] = useState(false);

  const [errorIdentificacion, setErrorIdentificacion] = useState('');
  const [errorContrasena, setErrorContrasena] = useState('');

  const [mostrarModal, setMostrarModal] = useState('');
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const [codigoVerificado, setCodigoVerificado] = useState('');

  const navigate = useNavigate();

  // ✅ Cargar identificación guardada si existía
  useEffect(() => {
    const identificacionGuardada = localStorage.getItem('recordarIdentificacion');
    if (identificacionGuardada) {
      setIdentificacion(identificacionGuardada);
      setRecordarme(true);
    }
  }, []);

  const manejarLogin = async (e) => {
    e.preventDefault();

    setErrorIdentificacion('');
    setErrorContrasena('');

    if (!identificacion || !contrasena) {
      if (!identificacion) setErrorIdentificacion(MENSAJES_ERROR.CAMPO_REQUERIDO);
      if (!contrasena) setErrorContrasena(MENSAJES_ERROR.CAMPO_REQUERIDO);
      return;
    }

    try {
      const response = await api.post('/auth/login', { identificacion, contrasena });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('rol', response.data.rol);
      localStorage.setItem(
        'usuario',
        JSON.stringify({
          nombre: response.data.nombre,
          rol: response.data.rol,
          primerInicio: response.data.primerInicio,
        })
      );

      // ✅ Guardar solo la identificación si se marcó "Recordarme"
      if (recordarme) {
        localStorage.setItem('recordarIdentificacion', identificacion);
      } else {
        localStorage.removeItem('recordarIdentificacion');
      }

      const rolesPermitidos = ['Administrador', 'Coord. Admon'];
      if (rolesPermitidos.includes(response.data.rol)) {
        navigate('/usuarios');
      } else {
        setErrorIdentificacion(MENSAJES_ERROR.ROL_NO_AUTORIZADO);
      }
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || '';
      if (mensaje.includes('usuario no encontrado')) {
        setErrorIdentificacion(MENSAJES_ERROR.USUARIO_NO_ENCONTRADO);
      } else if (mensaje.includes('contraseña incorrecta')) {
        setErrorContrasena(MENSAJES_ERROR.CONTRASENA_INCORRECTA);
      } else {
        setErrorContrasena(MENSAJES_ERROR.ERROR_LOGIN);
      }
    }
  };

  const toggleMostrarContrasena = () => setMostrarContrasena(!mostrarContrasena);

  const cerrarModales = () => setMostrarModal('');
  const avanzarARestablecer = (correo) => {
    setCorreoRecuperacion(correo);
    setMostrarModal('restablecer');
  };
  const avanzarANueva = (codigo) => {
    setCodigoVerificado(codigo);
    setMostrarModal('nueva');
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
          <h1>Iniciar sesión</h1>

          <div className="form-group">
            <label htmlFor="identificacion">Identificación</label>
            <input
              id="identificacion"
              name="identificacion"
              type="text"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              className={errorIdentificacion ? 'input-error' : ''}
              autoComplete="username"
            />
            {errorIdentificacion && <p className="mensaje-error">{errorIdentificacion}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <div className="campo-password">
              <input
                id="contrasena"
                name="contrasena"
                type={mostrarContrasena ? 'text' : 'password'}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className={errorContrasena ? 'input-error' : ''}
                autoComplete="current-password"
              />
              <span className="icono-ojito" onClick={toggleMostrarContrasena}>
                {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errorContrasena && <p className="mensaje-error">{errorContrasena}</p>}
          </div>

          <div className="form-group recordarme">
            <input
              type="checkbox"
              checked={recordarme}
              onChange={(e) => setRecordarme(e.target.checked)}
              id="recordarme"
            />
            <label htmlFor="recordarme">Recordarme</label>
          </div>

          <button type="submit" className="btn-login">Ingresar</button>

          <div className="forgot-link">
            <a href="#" onClick={() => setMostrarModal('recuperar')}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
      </div>

      {mostrarModal === 'recuperar' && (
        <RecuperarContrasenaModal onClose={cerrarModales} onCodigoEnviado={avanzarARestablecer} />
      )}
      {mostrarModal === 'restablecer' && (
        <RestablecerContrasenaModal
          correo={correoRecuperacion}
          onClose={cerrarModales}
          onCodigoVerificado={avanzarANueva}
        />
      )}
      {mostrarModal === 'nueva' && (
        <NuevaContrasenaModal
          correo={correoRecuperacion}
          codigo={codigoVerificado}
          onClose={cerrarModales}
        />
      )}
    </div>
  );
};

export default Login;
