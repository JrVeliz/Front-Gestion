// import React, { useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import LoginComponent from "./Components/auth/Login.jsx";
import Signup from "./Components/auth/Signup.jsx";
import RegistroMaquinarias from "./Components/Home/RegistroMaquinarias.jsx";
import Sidebar from "./Components/SideBar.jsx";
import PrediccionModelo from "./Components/Home/PrediccionModelo.jsx";
import AdministrarModelo from "./Components/Home/AdministrarModelo.jsx";
import HistorialPredicciones from "./Components/Home/HistorialPredicciones.jsx";
import FormularioCorrectivo from "./Components/Home/FormularioCorrectivo.jsx";
import ResultadoModelo from "./Components/Home/ResultadoModelo.jsx";

function App() {
  const Layout = ({ children }) => {
    const location = useLocation();
    const rutasConMenu = [
      "/home",
      "/registro-maquinaria",
      "/prediccion-modelo",
      "/reportes",
      "/administrar-modelo",
      "/historial-predicciones",
      "/resultado-modelo",
      "/crear-formulario",
    ];

    const mostrarMenu = rutasConMenu.includes(location.pathname);

    return (
      <div>
        {mostrarMenu && <Sidebar />}
        <div
          style={{ marginLeft: mostrarMenu ? "220px" : "0", padding: "20px" }}
        >
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route
                  path="administrar-modelo"
                  element={<AdministrarModelo />}
                />
                <Route
                  path="historial-predicciones"
                  element={<HistorialPredicciones />}
                />
                <Route
                  path="registro-maquinaria"
                  element={<RegistroMaquinarias />}
                />
                <Route
                  path="prediccion-modelo"
                  element={<PrediccionModelo />}
                />
                <Route
                  path="historial-prediccion"
                  element={<PrediccionModelo />}
                />
                <Route path="/resultado-modelo" element={<ResultadoModelo />} />
                <Route
                  path="/crear-formulario"
                  element={<FormularioCorrectivo />}
                />
                <Route
                  path="*"
                  element={<Navigate to="/administrar-modelo" />}
                />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
