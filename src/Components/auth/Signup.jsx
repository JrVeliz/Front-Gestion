import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignupServices } from "../../utils/services";
import "../../Styles/Login.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, email, password } = formData;

    if (!nombre || !email || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    try {
      const result = await SignupServices(nombre, email, password);

      if (result && result.success) {
        navigate("/");
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
      <h2>Registro de Usuario</h2>

      <input
        type="text"
        name="nombre"
        id="nombre"
        placeholder="Nombre"
        value={formData.nombre}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="email"
        id="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        id="password"
        placeholder="Contraseña"
        value={formData.password}
        onChange={handleChange}
        required
      />

      <div className="mb-4">
        <button type="submit">Registrarse</button>
      </div>

      <div className="mb-4">
        <Link to="/" className="text-gray-500 hover:underline cursor-pointer">
          Iniciar Sesión
        </Link>
      </div>

      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </form>
  );
};

export default Signup;
