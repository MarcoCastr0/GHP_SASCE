"use client"

import { useEffect, useState } from "react"
import { profesorService } from "../../services/profesorService"

const Profesores = ({ setActiveModule }) => {
  console.log("[v0] Profesores component mounted, setActiveModule is:", typeof setActiveModule, setActiveModule)

  const [profesores, setProfesores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    cargarProfesores()
  }, [])

  const cargarProfesores = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await profesorService.getProfesores()
      setProfesores(response.data || [])
    } catch (error) {
      console.error("Error cargando profesores:", error)
      setError("Error al cargar los profesores. Por favor, intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleCrearProfesor = () => {
    console.log("[v0] Button clicked, calling setActiveModule with 'crearProfesor'")
    console.log("[v0] setActiveModule is:", typeof setActiveModule)
    if (typeof setActiveModule === "function") {
      setActiveModule("crearProfesor")
    } else {
      console.error("[v0] ERROR: setActiveModule is not a function!", setActiveModule)
    }
  }

  if (loading) {
    return <div style={{ padding: "20px", textAlign: "center" }}>Cargando profesores...</div>
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Gestión de Profesores</h2>

      {/* BOTÓN CREAR PROFESOR */}
      <button
        onClick={handleCrearProfesor}
        style={{
          marginBottom: "15px",
          padding: "10px 16px",
          background: "#5c6abbff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "bold",
        }}
      >
        ➕ Crear Profesor
      </button>

      {/* MENSAJE DE ERROR */}
      {error && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            background: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
          }}
        >
          {error}
        </div>
      )}

      {/* TABLA */}
      <table
        border="1"
        cellPadding="8"
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "14px",
        }}
      >
        <thead>
          <tr style={{ background: "#f8f9fa" }}>
            <th style={{ textAlign: "left" }}>ID</th>
            <th style={{ textAlign: "left" }}>Nombre Completo</th>
            <th style={{ textAlign: "left" }}>Correo</th>
            <th style={{ textAlign: "left" }}>Identificación</th>
          </tr>
        </thead>

        <tbody>
          {profesores.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No hay profesores registrados
              </td>
            </tr>
          ) : (
            profesores.map((p) => (
              <tr key={p.id_profesor}>
                <td>{p.id_profesor}</td>
                <td>
                  {p.usuario?.nombre} {p.usuario?.apellido}
                </td>
                <td>{p.usuario?.correo}</td>
                <td>{p.numero_identificacion}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Profesores
