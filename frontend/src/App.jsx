import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Usuarios from "./pages/Usuarios/Usuarios";
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main">
        <Header titulo="Módulo de Usuarios" onBuscar={(valor) => setTerminoBusqueda(valor)} />
        <Usuarios />
      </main>
    </div>
  );
}

export default App;
