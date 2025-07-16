import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RutaProtegida = ({ rolesPermitidos = [] }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Si no hay token o está vacío, redirige al login
  if (!token || token === 'undefined' || token === 'null') {
    return <Navigate to="/" replace />;
  }

  // Si el rol no está permitido
  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rol)) {
    // Opcional: limpiar sesión si hay token no autorizado
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuario');
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado y con rol permitido
  return <Outlet />;
};

export default RutaProtegida;
