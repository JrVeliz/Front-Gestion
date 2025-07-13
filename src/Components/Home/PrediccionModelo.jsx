// Mantenimiento.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnalizarMaquinaria, ObtenerMaquinarias } from "../../utils/services";
import "../../Styles/Mantenimiento.css";
import * as XLSX from "xlsx";

const camposIniciales = {
  id: "",
  tipo_maquinaria: "",
  tiempo_uso_horas: "",
  temperatura_motor: "",
  vibracion_general: "",
  presion_hidraulica: "",
  nivel_aceite_motor: "",
  nivel_combustible: "",
  rpm_motor: "",
  velocidad_avance: "",
  carga_trabajo: "",
  sensor_fugas: "",
  sensor_ruido: "",
  codigo_error: "",
  modo_operacion: "",
  tiempo_operacion_sesion: "",
  ultima_mantencion_dias: "",
  condiciones_terreno: "",
};

const PrediccionModelo = () => {
  const [maquinarias, setMaquinarias] = useState([]);
  const [maquinariaSeleccionada, setMaquinariaSeleccionada] = useState("");
  const [datosFormulario, setDatosFormulario] = useState(camposIniciales);
  const [error, setError] = useState("");
  const inputFileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaquinarias = async () => {
      try {
        const response = await ObtenerMaquinarias();
        if (response.status === "success") {
          setMaquinarias(response.data);
        } else {
          setError("No se pudo obtener la lista de maquinarias");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar maquinarias");
      }
    };

    fetchMaquinarias();
  }, []);

  const handleSelectMaquinaria = (e) => {
    const id = e.target.value;
    setMaquinariaSeleccionada(id);
    setDatosFormulario({
      id: id,
      tipo_maquinaria: "",
      tiempo_uso_horas: "",
      temperatura_motor: "",
      vibracion_general: "",
      presion_hidraulica: "",
      nivel_aceite_motor: "",
      nivel_combustible: "",
      rpm_motor: "",
      velocidad_avance: "",
      carga_trabajo: "",
      sensor_fugas: "",
      sensor_ruido: "",
      codigo_error: "",
      modo_operacion: "",
      tiempo_operacion_sesion: "",
      ultima_mantencion_dias: "",
      condiciones_terreno: "",
    });
    setError("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((prev) => ({ ...prev, [name]: value }));
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(hoja, { header: 1 });
        const headers = data[0];
        const valores = data[1];

        if (!valores || !headers) {
          setError("El archivo Excel no contiene datos válidos.");
          return;
        }

        const maquinariaActual = maquinarias.find(
          (m) => m.id.toString() === maquinariaSeleccionada
        );

        if (!maquinariaActual) {
          setError("Debe seleccionar una maquinaria antes de subir un Excel.");
          return;
        }

        if (valores[0] !== maquinariaActual.nombre) {
          setError(
            `El nombre de la maquinaria en el Excel (${valores[0]}) no coincide con la maquinaria seleccionada (${maquinariaActual.nombre}).`
          );
          return;
        }

        const parsed = {};
        headers.forEach((key, idx) => {
          parsed[key] = valores[idx];
        });

        setDatosFormulario({
          id: maquinariaSeleccionada,
          tipo_maquinaria: parsed.tipo_maquinaria || "",
          tiempo_uso_horas: parsed.tiempo_uso_horas || "",
          temperatura_motor: parsed.temperatura_motor || "",
          vibracion_general: parsed.vibracion_general || "",
          presion_hidraulica: parsed.presion_hidraulica || "",
          nivel_aceite_motor: parsed.nivel_aceite_motor || "",
          nivel_combustible: parsed.nivel_combustible || "",
          rpm_motor: parsed.rpm_motor || "",
          velocidad_avance: parsed.velocidad_avance || "",
          carga_trabajo: parsed.carga_trabajo || "",
          sensor_fugas: parsed.sensor_fugas ?? "",
          sensor_ruido: parsed.sensor_ruido || "",
          codigo_error: parsed.codigo_error || "",
          modo_operacion: parsed.modo_operacion || "",
          tiempo_operacion_sesion: parsed.tiempo_operacion_sesion || "",
          ultima_mantencion_dias: parsed.ultima_mantencion_dias || "",
          condiciones_terreno: parsed.condiciones_terreno || "",
        });

        setError("");
      } catch (error) {
        setError("Error al procesar el archivo Excel.");
      } finally {
        if (inputFileRef.current) inputFileRef.current.value = "";
      }
    };

    reader.readAsBinaryString(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
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
    } = datosFormulario;

    if (
      !id ||
      !tipo_maquinaria ||
      !tiempo_uso_horas ||
      !temperatura_motor ||
      !vibracion_general ||
      !presion_hidraulica ||
      !nivel_aceite_motor ||
      !nivel_combustible ||
      !rpm_motor ||
      !velocidad_avance ||
      !carga_trabajo ||
      !sensor_fugas ||
      !sensor_ruido ||
      !codigo_error ||
      !modo_operacion ||
      !tiempo_operacion_sesion ||
      !ultima_mantencion_dias ||
      !condiciones_terreno
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!maquinariaSeleccionada) {
      setError("Debe seleccionar una maquinaria");
      return;
    }

    try {
      const result = await AnalizarMaquinaria(
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
      );

      if (result && result["status"] === "success") {
        console.log(result);
        localStorage.setItem("resultado_prediccion", JSON.stringify(result));
        console.log("despues del localstorage");
        navigate("/resultado-modelo");
      } else {
        console.log(result);
        setError(result.message || "Error al analizar");
      }
    } catch (err) {
      console.error(err);
      setError("Error en el servidor");
    }
  };

  return (
    <div className="PrediccionModelo-container">
      <h1 className="mantenimiento-title">
        Mantenimiento Predictivo de Maquinaria
      </h1>
      {error && <p className="mantenimiento-error">{error}</p>}

      <form className="mantenimiento-form" onSubmit={handleSubmit}>
        <label htmlFor="maquinaria">Selecciona una maquinaria:</label>
        <select
          id="maquinaria"
          value={maquinariaSeleccionada}
          onChange={handleSelectMaquinaria}
        >
          <option value="">-- Seleccionar --</option>
          {maquinarias.map((maq) => (
            <option key={maq.id} value={maq.id}>
              {maq.nombre} - {maq.modelo}
            </option>
          ))}
        </select>

        {/* Subir Excel */}
        <div className="form-group">
          <label>Importar desde Excel (.xlsx):</label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleExcelUpload}
            ref={inputFileRef}
          />
        </div>

        {/* <div className="form-group">
            <label>Tipo de maquinaria</label>
            <input
              type="text"
              name="tipo_maquinaria"
              value={datosFormulario.tipo_maquinaria}
              onChange={handleInputChange}
            />
        </div> */}
        <div className="form-columns">
          <div className="form-group">
            <label>Tiempo de uso (horas)</label>
            <input
              type="number"
              name="tiempo_uso_horas"
              value={datosFormulario.tiempo_uso_horas}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Temperatura del motor</label>
            <input
              type="number"
              name="temperatura_motor"
              value={datosFormulario.temperatura_motor}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Vibración general</label>
            <input
              type="number"
              step="0.01"
              name="vibracion_general"
              value={datosFormulario.vibracion_general}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Presión hidráulica</label>
            <input
              type="number"
              name="presion_hidraulica"
              value={datosFormulario.presion_hidraulica}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Nivel de aceite del motor</label>
            <input
              type="number"
              name="nivel_aceite_motor"
              value={datosFormulario.nivel_aceite_motor}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Nivel de combustible</label>
            <input
              type="number"
              name="nivel_combustible"
              value={datosFormulario.nivel_combustible}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>RPM del motor</label>
            <input
              type="number"
              name="rpm_motor"
              value={datosFormulario.rpm_motor}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Velocidad de avance</label>
            <input
              type="number"
              step="0.1"
              name="velocidad_avance"
              value={datosFormulario.velocidad_avance}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Carga de trabajo</label>
            <input
              type="number"
              name="carga_trabajo"
              value={datosFormulario.carga_trabajo}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Sensor de fugas</label>
            <input
              type="number"
              name="sensor_fugas"
              value={datosFormulario.sensor_fugas}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Sensor de ruido</label>
            <input
              type="text"
              name="sensor_ruido"
              value={datosFormulario.sensor_ruido}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Código de error</label>
            <input
              type="text"
              name="codigo_error"
              value={datosFormulario.codigo_error}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Modo de operación</label>
            <input
              type="text"
              name="modo_operacion"
              value={datosFormulario.modo_operacion}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Tiempo de operación en sesión (min)</label>
            <input
              type="number"
              name="tiempo_operacion_sesion"
              value={datosFormulario.tiempo_operacion_sesion}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Días desde la última mantención</label>
            <input
              type="number"
              name="ultima_mantencion_dias"
              value={datosFormulario.ultima_mantencion_dias}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Condiciones del terreno</label>
            <input
              type="text"
              name="condiciones_terreno"
              value={datosFormulario.condiciones_terreno}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit">Analizar</button>
      </form>
    </div>
  );
};

export default PrediccionModelo;
