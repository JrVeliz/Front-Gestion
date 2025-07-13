import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RegistroMaquinaria } from "../../utils/services";
import "../../Styles/Login.css";

const RegistroMaquinarias = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    modelo: "",
    descripcion: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, modelo, descripcion } = formData;

    if (!nombre || !modelo || !descripcion) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const result = await RegistroMaquinaria(nombre, modelo, descripcion);

      if (result && result.success) {
        console.log("Maquinaria registrada");
      } else {
        setError(result.message || "Error al registrar");
      }
    } catch (err) {
      console.error(err);
      setError("Error en el servidor");
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit} noValidate>
      <h2>Registro de Maquinaria</h2>

      <input
        type="text"
        name="nombre"
        id="nombre"
        placeholder="Nombre de la maquinaria"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="modelo"
        id="modelo"
        placeholder="Modelo de la maquinaria"
        value={formData.modelo}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="descripcion"
        id="descripcion"
        placeholder="Descripción de la maquinaria"
        value={formData.descripcion}
        onChange={handleChange}
        required
      />
      <div className="mb-4">
        <button type="submit">Registrar maquinaria</button>
      </div>

      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </form>
  );
};

export default RegistroMaquinarias;
