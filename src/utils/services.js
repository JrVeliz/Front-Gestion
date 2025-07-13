export const loginAuth = async (Email, Password) => {
  console.log(Email, Password);
  try {
    const res = await fetch("http://127.0.0.1:8000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: Email,
        password: Password,
      }),
    });

    const data = await res.json();
    console.log("Desde services: ", data);
    return data;
  } catch (error) {
    console.log("error al buscar el usuario registrado: " + error);
  }
};

export const SignupServices = async (nombre, email, password) => {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/register-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const RegistroMaquinaria = async (nombre, modelo, descripcion) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/registrar-maquinaria",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre, modelo, descripcion }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

export const ObtenerMaquinarias = async () => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/obtener-maquinarias",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener maquinarias:", error);
    throw error;
  }
};

export const AnalizarMaquinaria = async (
  id,
  tipo_maquinaria,
  tiempo_uso_horas,
  temperatura_motor,
  vibracion_general,
  presion_hidraulica,
  nivel_aceite_motor,
  nivel_combustible,
  rpm_motor,
  velocidad_avance,
  carga_trabajo,
  sensor_fugas,
  sensor_ruido,
  codigo_error,
  modo_operacion,
  tiempo_operacion_sesion,
  ultima_mantencion_dias,
  condiciones_terreno
) => {
  try {
    const response = await fetch(
      "http://127.0.0.1:8000/api/predecir_falla",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          tipo_maquinaria,
          tiempo_uso_horas,
          temperatura_motor,
          vibracion_general,
          presion_hidraulica,
          nivel_aceite_motor,
          nivel_combustible,
          rpm_motor,
          velocidad_avance,
          carga_trabajo,
          sensor_fugas,
          sensor_ruido,
          codigo_error,
          modo_operacion,
          tiempo_operacion_sesion,
          ultima_mantencion_dias,
          condiciones_terreno,
        }),
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};
