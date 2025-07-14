import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/SideBar.css";

const Sidebar = () => {
  const [active, setActive] = useState("home");
  const navigate = useNavigate();

  const menuItems = [
    { id: "home", label: "Inicio", path: "/administrar-modelo" },
    {
      id: "registro-maquinaria",
      label: "Registro de Maquinarias",
      path: "/registro-maquinaria",
    },
    {
      id: "prediccion-modelo",
      label: "Mantenimiento predictivo",
      path: "/prediccion-modelo",
    },
    {
      id: "historial",
      label: "Historial Predicciones",
      path: "/historial-predicciones",
    },
  ];

    const handleLogout = () => {
    localStorage.removeItem('currentUser');
    
    navigate('/login');
  };
  
  const handleClick = (item) => {
    setActive(item.id);
    navigate(item.path);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Sistema SMPMA-2025</h2>
      <ul className="menu-list">
        {menuItems.map((item) => (
          <li
            key={item.id}
            className={`menu-item ${active === item.id ? "active" : ""}`}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </li>
        ))}
      </ul>
  <button className="logout-button" onClick={handleLogout}>
    Cerrar sesión
  </button>
    </div>
  );
};

export default Sidebar;
