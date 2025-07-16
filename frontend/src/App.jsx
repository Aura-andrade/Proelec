import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RutaProtegida from './utils/routes/RutaProtegida';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Usuarios from './pages/Usuarios/Usuarios';
import Login from './pages/Login/Login';
import './App.css';

function App() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<Login />} />

      {/* Rutas protegidas */}
      <Route element={<RutaProtegida rolesPermitidos={['Administrador', 'Coord. Admon']} />}>
        <Route
          path="/usuarios"
          element={
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
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
