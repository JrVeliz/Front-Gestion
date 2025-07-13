import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginAuth } from "../../utils/services";
import "../../Styles/Login.css";
const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const usuarioEncontrado = await loginAuth(
        formData.email,
        formData.password
      );
      console.log(usuarioEncontrado);
      if (usuarioEncontrado) {
        localStorage.setItem("currentUser", JSON.stringify(usuarioEncontrado));
        navigate("/home");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.log(error);
      setError("Error en el servidor");
    }
  };

  return (
    <form className="login-form" onSubmit={handleLogin} noValidate>
      <h2>Bienvenido, Login</h2>

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
        <button type="submit">Login</button>
      </div>
      <div className="mb-4">
        <Link
          to="/signup"
          className="text-gray-500 hover:underline cursor-pointer"
        >
          Registrar nueva cuenta
        </Link>
      </div>
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </form>
  );
};

export default Login;
