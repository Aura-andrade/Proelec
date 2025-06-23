import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const RutaProtegida = ({ rolesPermitidos }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Si no hay token, redirige a login
  if (!token) return <Navigate to="/" replace />;

  // Si hay token pero el rol no está permitido, redirige al login
  if (rolesPermitidos && !rolesPermitidos.includes(rol)) {
    return <Navigate to="/" replace />;
  }

  // Autenticado y con rol permitido
  return <Outlet />;
};

export default RutaProtegida;
