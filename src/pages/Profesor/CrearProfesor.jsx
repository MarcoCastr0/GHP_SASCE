"use client"

import { useState } from "react"
import { profesorService } from "../../services/profesorService"
import FormularioProfesor from "./FormularioProfesor"

const CrearProfesor = ({ setActiveModule }) => {
  const [mensaje, setMensaje] = useState(null)
  const [tipoMensaje, setTipoMensaje] = useState("exito") // 'exito' o 'error'

  const handleSubmit = async (data) => {
    try {
      const response = await profesorService.createProfesor(data)
      setTipoMensaje("exito")
      setMensaje("Profesor creado con éxito ✔️")
      console.log("Respuesta del servidor:", response)

      setTimeout(() => {
        if (setActiveModule) {
          setActiveModule("profesores")
        }
      }, 2000)
    } catch (error) {
      setTipoMensaje("error")
      setMensaje("Error: " + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Crear Profesor</h2>

      {mensaje && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            borderRadius: "4px",
            backgroundColor: tipoMensaje === "exito" ? "#d4edda" : "#f8d7da",
            color: tipoMensaje === "exito" ? "#155724" : "#721c24",
            border: `1px solid ${tipoMensaje === "exito" ? "#c3e6cb" : "#f5c6cb"}`,
          }}
        >
          {mensaje}
        </div>
      )}

      <FormularioProfesor onSubmit={handleSubmit} />
    </div>
  )
}

export default CrearProfesor
