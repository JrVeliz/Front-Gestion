import React, { useState } from "react";
import * as XLSX from "xlsx";
import "../../Styles/AdministrarModelo.css";
import {
  EntrenarModelo,
  RegistrarDatosEntrenamiento,
} from "../../utils/services";

const campos = [
  "tipo_maquinaria",
  "tiempo_uso_horas",
  "temperatura_motor",
  "vibracion_general",
  "presion_hidraulica",
  "nivel_aceite_motor",
  "nivel_combustible",
  "rpm_motor",
  "velocidad_avance",
  "carga_trabajo",
  "sensor_fugas",
  "sensor_ruido",
  "codigo_error",
  "modo_operacion",
  "tiempo_operacion_sesion",
  "ultima_mantencion_dias",
  "condiciones_terreno",
  "falla_reportada",
];
const etiquetasCampos = {
  tipo_maquinaria: "Tipo de maquinaria",
  tiempo_uso_horas: "Tiempo de uso (horas)",
  temperatura_motor: "Temperatura del motor",
  vibracion_general: "Vibración general",
  presion_hidraulica: "Presión hidráulica",
  nivel_aceite_motor: "Nivel de aceite del motor",
  nivel_combustible: "Nivel de combustible",
  rpm_motor: "RPM del motor",
  velocidad_avance: "Velocidad de avance",
  carga_trabajo: "Carga de trabajo",
  sensor_fugas: "Sensor de fugas",
  sensor_ruido: "Sensor de ruido",
  codigo_error: "Código de error",
  modo_operacion: "Modo de operación",
  tiempo_operacion_sesion: "Tiempo de operación por sesión",
  ultima_mantencion_dias: "Días desde la última mantención",
  condiciones_terreno: "Condiciones del terreno",
  falla_reportada: "Falla reportada",
};

const RegistroMaquinaria = () => {
  // data siempre con arreglo de registros
  const [modo, setModo] = useState("uno");
  const [data, setData] = useState({ registros: [{}] });
  const [error, setError] = useState("");

  // Editar registro único (modo "uno") en el índice 0
  const handleChangeUnico = (campo, valor) => {
    setData((prev) => {
      const nuevosRegistros = [...prev.registros];
      nuevosRegistros[0] = { ...nuevosRegistros[0], [campo]: valor };
      return { registros: nuevosRegistros };
    });
  };

  // Cargar Excel (modo "varios")
  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const registros = XLSX.utils.sheet_to_json(ws);
      setData({ registros });
    };
    reader.readAsBinaryString(file);
  };

  // Editar celda (modo varios)
  const handleEditarCelda = (index, campo, valor) => {
    setData((prev) => {
      const nuevosRegistros = [...prev.registros];
      nuevosRegistros[index] = { ...nuevosRegistros[index], [campo]: valor };
      return { registros: nuevosRegistros };
    });
  };

  // Agregar fila vacía
  const agregarFila = () => {
    const filaVacia = {};
    campos.forEach((c) => (filaVacia[c] = ""));
    setData((prev) => ({ registros: [...prev.registros, filaVacia] }));
  };

  // Eliminar fila
  const eliminarFila = (index) => {
    setData((prev) => {
      const nuevosRegistros = prev.registros.filter((_, i) => i !== index);
      return { registros: nuevosRegistros.length ? nuevosRegistros : [{}] };
    });
  };

  // Cambiar modo: si cambia a "uno", mantenemos solo primer registro o uno vacío si no hay
  const cambiarModo = (nuevoModo) => {
    setError(""); // reset error
    setModo(nuevoModo);
    if (nuevoModo === "uno") {
      setData((prev) => ({
        registros: prev.registros.length > 0 ? [prev.registros[0]] : [{}],
      }));
    } else {
      // si modo varios y no hay registros, iniciar con arreglo vacío
      setData((prev) => ({
        registros: prev.registros.length > 0 ? prev.registros : [],
      }));
    }
  };

  // Ejemplo función enviar
  const handleEnviar = async (e) => {
    setError(""); // reset error

    const registros = data.registros || [];

    // Verifica si hay al menos un registro con todos los campos llenos
    const tieneRegistroCompleto = registros.some((registro) =>
      campos.every((campo) => {
        const valor = registro[campo];
        return (
          valor !== undefined &&
          valor !== null &&
          valor.toString().trim() !== ""
        );
      })
    );

    if (!tieneRegistroCompleto) {
      setError(
        "Error: Debe haber al menos un registro con todos los campos llenos."
      );
      console.log("falta data");
      return;
    }

    try {
      const result = await RegistrarDatosEntrenamiento(registros);

      if (result && result["status"] === "success") {
        console.log("Casos guardados correctamente", result);

        // Limpiar campos después de enviar con éxito
        // Manteniendo la estructura de 'data' con registros: [{}] para modo uno o [] para varios
        if (modo === "uno") {
          setData({ registros: [{}] });
        } else {
          setData({ registros: [] });
        }
      } else {
        console.log(result);
        setError(result.message || "Error al analizar");
      }
    } catch (err) {
      console.error(err);
      setError("Error en el servidor");
    }

    console.log("Datos a enviar:", data);
  };

  const handleEntrenarModelo = async () => {
    setError("");
    try {
      const result = await EntrenarModelo(); // <- tu función del backend

      if (result.status === "success") {
        console.log("Modelo reentrenado correctamente", result);
        alert("Modelo reentrenado correctamente.");
      } else {
        console.log(result);
        setError(result.message || "Error al reentrenar el modelo.");
      }
    } catch (err) {
      console.error(err);
      setError("Error en el servidor al reentrenar el modelo.");
    }
  };

  return (
  <div className="adminmodelo-container">
      <h2 className="adminmodelo-title">Registro de Datos de Maquinaria</h2>

      <div className="adminmodelo-modo-selector">
        <button
          onClick={() => cambiarModo("uno")}
          className={modo === "uno" ? "active" : ""}
        >
          Subir un registro
        </button>
        <button
          onClick={() => cambiarModo("varios")}
          className={modo === "varios" ? "active" : ""}
        >
          Subir varios registros (Excel)
        </button>
      </div>

      {modo === "uno" && (
        <div className="adminmodelo-form-grid">
          {campos.map((campo) => (
            <div className="adminmodelo-form-group" key={campo}>
              <label>{etiquetasCampos[campo] || campo}</label>
              <input
                type="text"
                value={data.registros[0][campo] || ""}
                onChange={(e) => handleChangeUnico(campo, e.target.value)}
              />
            </div>
          ))}
        </div>
      )}

      {modo === "varios" && (
        <div style={{ marginTop: "20px" }}>
          <input type="file" accept=".xlsx, .xls" onChange={handleExcelUpload} />

          {data.registros.length > 0 && (
            <>
              <div className="adminmodelo-table-container">
                <table className="adminmodelo-table">
                  <thead>
                    <tr>
                      {campos.map((campo) => (
                        <th key={campo}>{campo}</th>
                      ))}
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.registros.map((fila, i) => (
                      <tr key={i}>
                        {campos.map((campo) => (
                          <td key={campo}>
                            <input
                              type="text"
                              value={fila[campo] || ""}
                              onChange={(e) => handleEditarCelda(i, campo, e.target.value)}
                            />
                          </td>
                        ))}
                        <td style={{ textAlign: "center" }}>
                          <button
                            onClick={() => eliminarFila(i)}
                            style={{ color: "red", cursor: "pointer" }}
                          >
                            ❌
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="adminmodelo-agregar-fila">
                <button onClick={agregarFila}>➕ Agregar fila</button>
              </div>
            </>
          )}
        </div>
      )}

      <div className="adminmodelo-acciones">
        <button onClick={handleEnviar}>Enviar datos</button>
        <button onClick={handleEntrenarModelo}>Reentrenar modelo</button>
        {error && <p className="adminmodelo-error">{error}</p>}
      </div>
    </div>
  );
};

export default RegistroMaquinaria;
