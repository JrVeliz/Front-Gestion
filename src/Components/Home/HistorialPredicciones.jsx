import React, { useState, useEffect } from "react";
import { ObtenerPredicciones } from "../../utils/services";
import "../../Styles/HistorialPredicciones.css";

const columnas = [
  { key: "nombre_maquinaria", label: "Nombre Maquinaria" },
  { key: "fecha_prediccion", label: "Fecha Predicción" },
  { key: "resultado_prediccion", label: "Resultado Predicción" },
  { key: "confianza", label: "Confianza" },
  { key: "modelo", label: "Modelo" },
];

const FILAS_POR_PAGINA = 10;

const HistorialPredicciones = () => {
  const [predicciones, setPredicciones] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState({ columna: null, ascendente: true });
  const [paginaActual, setPaginaActual] = useState(1);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPredicciones = async () => {
      try {
        const response = await ObtenerPredicciones();
        if (response.status === "success") {
          const data = response.data.map((item) => ({
            ...item,
            fecha_prediccion: item.fecha_prediccion.split("T")[0],
          }));
          setPredicciones(data);
          setError(null);
        } else {
          setError("No se pudo obtener el historial");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar el historial");
      }
    };
    fetchPredicciones();
  }, []);

  const camposBusqueda = ["nombre_maquinaria", "resultado_prediccion", "modelo"];

  const datosFiltrados = predicciones.filter((item) =>
    camposBusqueda.some((key) =>
      item[key].toString().toLowerCase().includes(busqueda.toLowerCase())
    )
  );

  const ordenarDatos = (datos, columnaKey, ascendente) => {
    return [...datos].sort((a, b) => {
      let valA = a[columnaKey];
      let valB = b[columnaKey];

      if (columnaKey === "confianza") {
        valA = Number(valA);
        valB = Number(valB);
      }

      if (valA < valB) return ascendente ? -1 : 1;
      if (valA > valB) return ascendente ? 1 : -1;
      return 0;
    });
  };

  const datosOrdenados =
    orden.columna !== null
      ? ordenarDatos(datosFiltrados, orden.columna, orden.ascendente)
      : datosFiltrados;

  // Cálculo para paginar datos
  const totalPaginas = Math.ceil(datosOrdenados.length / FILAS_POR_PAGINA);
  const indiceInicio = (paginaActual - 1) * FILAS_POR_PAGINA;
  const indiceFin = indiceInicio + FILAS_POR_PAGINA;
  const datosPaginados = datosOrdenados.slice(indiceInicio, indiceFin);

  const manejarOrden = (columnaKey) => {
    if (orden.columna === columnaKey) {
      setOrden({ columna: columnaKey, ascendente: !orden.ascendente });
    } else {
      setOrden({ columna: columnaKey, ascendente: true });
    }
    setPaginaActual(1); // Resetea a la página 1 al cambiar orden
  };

  const manejarPaginaAnterior = () => {
    setPaginaActual((prev) => Math.max(prev - 1, 1));
  };

  const manejarPaginaSiguiente = () => {
    setPaginaActual((prev) => Math.min(prev + 1, totalPaginas));
  };

  return (
    <div className="historial-predicciones">
      <h2 className="titulo">Historial de Predicciones</h2>

      <input
        type="text"
        placeholder="Buscar maquinaria, falla o modelo..."
        value={busqueda}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setPaginaActual(1); // Reset paginación cuando filtras
        }}
        className="buscador"
      />

      {error && <p className="error">{error}</p>}

      <table className="tabla-predicciones">
        <thead>
          <tr>
            {columnas.map(({ key, label }) => (
              <th
                key={key}
                onClick={() => manejarOrden(key)}
                className="columna-ordenable"
              >
                {label}
                {orden.columna === key && (
                  <span className="icono-orden">
                    {orden.ascendente ? " ▲" : " ▼"}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {datosPaginados.length === 0 ? (
            <tr>
              <td colSpan={columnas.length} className="sin-resultados">
                No se encontraron resultados
              </td>
            </tr>
          ) : (
            datosPaginados.map((prediccion) => (
              <tr key={prediccion.prediccion_id}>
                <td>{prediccion.nombre_maquinaria}</td>
                <td>{prediccion.fecha_prediccion}</td>
                <td>{prediccion.resultado_prediccion}</td>
                <td>{prediccion.confianza}</td>
                <td>{prediccion.modelo}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="paginacion">
        <button
          onClick={manejarPaginaAnterior}
          disabled={paginaActual === 1}
          className="btn-pagina"
        >
          Anterior
        </button>
        <span className="pagina-actual">
          Página {paginaActual} de {totalPaginas}
        </span>
        <button
          onClick={manejarPaginaSiguiente}
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
          className="btn-pagina"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default HistorialPredicciones;
