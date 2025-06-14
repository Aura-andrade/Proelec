import React, { useState } from 'react';
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Usuarios from "./pages/Usuarios/Usuarios";
import './App.css';

function App() {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  return (
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
  );
}

export default App;
