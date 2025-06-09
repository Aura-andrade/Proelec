import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ListadoUsuarios from "./pages/usuarios/ListadoUsuarios";
import './App.css';

function App() {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  const toggleSidebar = () => {
    setSidebarAbierto(!sidebarAbierto);
  };

  return (
    <div className="app-container">
      <Sidebar abierto={sidebarAbierto} setAbierto={setSidebarAbierto} toggleSidebar={toggleSidebar} />
      <main className={`contenido-principal ${sidebarAbierto ? '' : 'expandido'}`}>
        <ListadoUsuarios />
      </main>
    </div>
  );
}

export default App;
