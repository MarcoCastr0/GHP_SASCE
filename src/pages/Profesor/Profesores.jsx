import React, { useEffect, useState } from "react";
import { profesorService } from "../../services/profesorService";
import { useNavigate } from "react-router-dom";

const Profesores = ({ setActiveModule }) => {
  const [profesores, setProfesores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarProfesores();
  }, []);

  const cargarProfesores = async () => {
    try {
      const response = await profesorService.getProfesores();
      setProfesores(response.data || []);
    } catch (error) {
      console.error("Error cargando profesores:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Profesores</h2>

      {/* BOTÓN CREAR PROFESOR */}
     <button
     onClick={() => setActiveModule("crearProfesor")}
        style={{
        marginBottom: "15px",
        padding: "8px 12px",
        background: "green",
        color: "white",
        border: "none",
    }}
    >
     ➕ Crear Profesor
    </button>


      {/* TABLA */}
      <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre completo</th>
            <th>Correo</th>
            <th>Identificación</th>
          </tr>
        </thead>

        <tbody>
          {profesores.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>No hay profesores registrados</td>
            </tr>
          ) : (
            profesores.map((p) => (
              <tr key={p.id_profesor}>
                <td>{p.id_profesor}</td>
                <td>{p.usuario?.nombre} {p.usuario?.apellido}</td>
                <td>{p.usuario?.correo}</td>
                <td>{p.numero_identificacion}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Profesores;
