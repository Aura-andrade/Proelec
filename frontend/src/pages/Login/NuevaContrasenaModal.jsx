import React, { useState } from 'react';
import api from '../../api/axios';
import { validarContrasenaSegura } from '../../utils/validadores';
import { IoMdClose } from 'react-icons/io';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import AlertaModal from '../../components/AlertaModal';
import '../../styles/Modales.css';
import { MENSAJES_ERROR, MENSAJES_EXITO } from '../../utils/mensajes';

const NuevaContrasenaModal = ({ correo, codigo, onClose }) => {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [errores, setErrores] = useState({});
  const [alerta, setAlerta] = useState(null);

  const toggleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresTemp = {};

    if (!nuevaContrasena || !confirmarContrasena) {
      erroresTemp.general = MENSAJES_ERROR.CAMPOS_INCOMPLETOS;
    }

    if (nuevaContrasena !== confirmarContrasena) {
      erroresTemp.confirmar = MENSAJES_ERROR.CONTRASENA_NO_COINCIDE;
    }

    const erroresValidacion = validarContrasenaSegura(nuevaContrasena);
    if (erroresValidacion.length > 0) {
      erroresTemp.contrasena = erroresValidacion;
    }

    if (Object.keys(erroresTemp).length > 0) {
      setErrores(erroresTemp);
      return;
    }

    try {
      await api.post('/auth/restablecer-contrasena', {
        correo,
        codigo,
        nuevaContrasena
      });

      setAlerta({ mensaje: MENSAJES_EXITO.CONTRASENA_ACTUALIZADA, tipo: 'success' });
      setTimeout(onClose, 2000);
    } catch (err) {
      setAlerta({ mensaje: MENSAJES_ERROR.ERROR_ACTUALIZAR_CONTRASENA, tipo: 'error' });
    }
  };

  const requisitos = [
    { id: 'longitud', texto: 'Mínimo 8 caracteres', cumple: nuevaContrasena.length >= 8 },
    { id: 'mayuscula', texto: 'Al menos una letra mayúscula', cumple: /[A-Z]/.test(nuevaContrasena) },
    { id: 'minuscula', texto: 'Al menos una letra minúscula', cumple: /[a-z]/.test(nuevaContrasena) },
    { id: 'numero', texto: 'Al menos un número', cumple: /\d/.test(nuevaContrasena) },
    { id: 'especial', texto: 'Al menos un carácter especial (!@#$%^&*)', cumple: /[!@#$%^&*]/.test(nuevaContrasena) }
  ];

  const getInputClass = (condicion, tocado = true) => {
    if (!tocado) return '';
    return condicion ? 'input-ok' : 'input-error';
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-formulario">
        <button className="cerrar-modal" onClick={onClose}>
          <IoMdClose size={20} />
        </button>

        <h2 className="titulo-modal">Nueva contraseña</h2>

        <form onSubmit={handleSubmit} autoComplete="off">
          <label htmlFor="nuevaContrasena">Nueva contraseña</label>
          <div className="campo-password">
            <input
              id="nuevaContrasena"
              type={mostrarContrasena ? 'text' : 'password'}
              value={nuevaContrasena}
              onChange={(e) => {
                setNuevaContrasena(e.target.value);
                setErrores({});
              }}
              className={nuevaContrasena ? getInputClass(requisitos.every(r => r.cumple)) : ''}
            />
            <span className="icono-ojito" onClick={toggleMostrarContrasena}>
              {mostrarContrasena ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <ul className="requisitos-lista">
            {requisitos.map((req) => (
              <li
                key={req.id}
                className={
                  nuevaContrasena.length === 0
                    ? 'gris'
                    : req.cumple ? 'cumplido' : 'no-cumplido'
                }
              >
                {req.texto}
              </li>
            ))}
          </ul>

          {errores.contrasena &&
            errores.contrasena.map((msg, i) => (
              <p key={i} className="mensaje-error">{msg}</p>
            ))}

          <label htmlFor="confirmarContrasena">Confirmar contraseña</label>
          <input
            id="confirmarContrasena"
            type={mostrarContrasena ? 'text' : 'password'}
            value={confirmarContrasena}
            onChange={(e) => {
              setConfirmarContrasena(e.target.value);
              setErrores({});
            }}
            className={
              confirmarContrasena
                ? getInputClass(confirmarContrasena === nuevaContrasena)
                : ''
            }
          />
          {errores.confirmar && <p className="mensaje-error">{errores.confirmar}</p>}
          {errores.general && <p className="mensaje-error">{errores.general}</p>}

          <div className="boton-centro">
            <button type="submit" className="btn-enviar">Actualizar</button>
          </div>
        </form>

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

export default NuevaContrasenaModal;
