import React, { useState, useEffect, useRef } from 'react';
import { IoMdClose } from 'react-icons/io';
import api from '../../api/axios';
import '../../styles/Modales.css';
import AlertaModal from '../../components/AlertaModal';
import { MENSAJES_ERROR, MENSAJES_EXITO } from '../../utils/mensajes';

const RestablecerContrasenaModal = ({ correo, onClose, onCodigoVerificado }) => {
  const [codigo, setCodigo] = useState('');
  const [errores, setErrores] = useState('');
  const [alerta, setAlerta] = useState(null);
  const [tiempoRestante, setTiempoRestante] = useState(0);
  const [puedeReenviar, setPuedeReenviar] = useState(false);
  const [reenviando, setReenviando] = useState(false);
  const [esperaReenvio, setEsperaReenvio] = useState(60);

  const intervaloRef = useRef(null);
  const reenvioRef = useRef(null);

  // Calcula la expiración inicial al montar
  useEffect(() => {
    const expiracionGuardada = localStorage.getItem(`expiracion_${correo}`);
    const expiracion = expiracionGuardada ? new Date(expiracionGuardada) : new Date(Date.now() + 10 * 60 * 1000);
    localStorage.setItem(`expiracion_${correo}`, expiracion.toISOString());

    actualizarTemporizador(expiracion);
    iniciarTemporizadores(expiracion);

    return () => {
      clearInterval(intervaloRef.current);
      clearInterval(reenvioRef.current);
    };
  }, []);

  const iniciarTemporizadores = (expiracion) => {
    intervaloRef.current = setInterval(() => {
      actualizarTemporizador(expiracion);
    }, 1000);

    reenvioRef.current = setTimeout(() => {
      setPuedeReenviar(true);
    }, 60 * 1000);
  };

  const actualizarTemporizador = (expiracion) => {
    const ahora = new Date();
    const restante = Math.max(0, Math.floor((new Date(expiracion) - ahora) / 1000));
    setTiempoRestante(restante);
  };

  const formatoTiempo = (segundos) => {
    const min = Math.floor(segundos / 60);
    const seg = segundos % 60;
    return `${min.toString().padStart(2, '0')}:${seg.toString().padStart(2, '0')}`;
  };

  const manejarReenvioCodigo = async () => {
    if (reenviando) return;

    try {
      setReenviando(true);
      await api.post('/auth/recuperar', { correo });

      const nuevaExpiracion = new Date(Date.now() + 10 * 60 * 1000);
      localStorage.setItem(`expiracion_${correo}`, nuevaExpiracion.toISOString());

      setTiempoRestante(600);
      setPuedeReenviar(false);
      clearInterval(intervaloRef.current);
      clearTimeout(reenvioRef.current);
      iniciarTemporizadores(nuevaExpiracion);

      setAlerta({ tipo: 'success', mensaje: MENSAJES_EXITO.CODIGO_ENVIADO });
    } catch (error) {
      setAlerta({
        tipo: 'error',
        mensaje: error.response?.data?.mensaje || MENSAJES_ERROR.ERROR_SOLICITUD,
      });
    } finally {
      setReenviando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!codigo) {
      setErrores(MENSAJES_ERROR.CODIGO_OBLIGATORIO);
      return;
    }

    try {
      const response = await api.post('/auth/verificar-codigo', { correo, codigo });
      if (response.data.ok) {
        setErrores('');
        onCodigoVerificado(codigo);
      }
    } catch (error) {
      const mensaje = error.response?.data?.mensaje || MENSAJES_ERROR.CODIGO_INVALIDO;
      setErrores(mensaje);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-formulario">
        <button className="cerrar-modal" onClick={onClose}>
          <IoMdClose size={20} />
        </button>

        <h2 className="titulo-modal">Verifica tu código</h2>
        <p className="descripcion-modal">
          Ingresa el código que enviamos a <strong>{correo}</strong>.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={codigo}
            onChange={(e) => {
              setCodigo(e.target.value);
              setErrores('');
            }}
            placeholder="Código de recuperación"
            className={errores ? 'input-error' : ''}
          />
          {errores && <p className="mensaje-error">{errores}</p>}

          <p className="ayuda-modal">
            Tiempo restante: <strong>{formatoTiempo(tiempoRestante)}</strong>
          </p>

          {tiempoRestante > 0 ? (
            <p className="ayuda-modal">
              ¿No recibiste el código?{' '}
              <span
                className="enlace-reenvio"
                onClick={puedeReenviar ? manejarReenvioCodigo : null}
                style={{
                  color: puedeReenviar ? '#1e40af' : 'gray',
                  cursor: puedeReenviar ? 'pointer' : 'default',
                }}
              >
                {reenviando ? 'Enviando...' : 'Enviar nuevo código'}
              </span>
            </p>
          ) : (
            <p className="mensaje-error">
              El código ha caducado.{' '}
              <span
                className="enlace-reenvio"
                onClick={manejarReenvioCodigo}
                style={{ color: '#1e40af', cursor: 'pointer' }}
              >
                Solicita uno nuevo
              </span>
            </p>
          )}

          <div className="boton-centro">
            <button type="submit" className="btn-enviar">
              Verificar
            </button>
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

export default RestablecerContrasenaModal;
