import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../../Styles/ResultadoModelo.css";

const Resultado = () => {
  const [resultado, setResultado] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("resultado_prediccion");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setResultado(parsed.data);
      } catch (e) {
        console.error("Error al parsear los datos", e);
      }
    }
  }, []);

  if (!resultado) return <p>Cargando resultado...</p>;

  const {
    falla_predicha,
    top_3_probabilidades,
    todas_las_probabilidades,
    entrada_transformada,
    importancia_variables,
  } = resultado;

  const datosImportancia = Object.entries(importancia_variables).map(
    ([variable, importancia]) => ({
      variable,
      importancia: +(importancia * 100).toFixed(2),
    })
  );

  return (
    <div className="resultado-container">
      <h1 className="resultado-title">Resultado de la Predicción</h1>
      <h2 className="resultado-subtitle">Falla Predicha: {falla_predicha}</h2>

      <div className="resultado-seccion">
        <h3>Top 3 Fallas Probables</h3>
        <ul>
          {top_3_probabilidades.map((item, i) => (
            <li key={i}>
              {item.falla}: {item.probabilidad}%
            </li>
          ))}
        </ul>
      </div>

      <div className="resultado-seccion">
        <h3>Todas las Probabilidades</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={todas_las_probabilidades}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="falla" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="probabilidad" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="resultado-seccion">
        <h3>Impacto de las Variables en la predicción</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosImportancia}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="variable"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
            />
            <YAxis unit="%" />
            <Tooltip />
            <Bar dataKey="importancia" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="resultado-seccion">
        <h3>Datos Transformados para la predicción</h3>
        <div className="tabla-scroll">
          <table className="tabla-resultado">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(entrada_transformada).map(([key, value]) => (
                <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Resultado;
