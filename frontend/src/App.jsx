import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RutaProtegida from "./utils/Routes/RutaProtegida"; // ✅ nuevo
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Usuarios from "./pages/Usuarios/Usuarios";
import Login from "./pages/Login/Login";
import './App.css';

function App() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Login />} />

      {/* Ruta protegida solo para Administradores */}
      <Route
        path="/usuarios"
        element={<RutaProtegida rolesPermitidos={['Administrador']}> 
          <div className="app-container">
            <Sidebar />
            <main className="main">
              <Header
                titulo="Módulo de Usuarios"
                terminoBusqueda={terminoBusqueda}
                setTerminoBusqueda={setTerminoBusqueda}
              />
              <Usuarios terminoBusqueda={terminoBusqueda} />
            </main>
          </div>
        </RutaProtegida>}
      />
    </Routes>
  );
}

export default App;
