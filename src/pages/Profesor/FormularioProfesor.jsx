"use client"

import { useState } from "react"

const FormularioProfesor = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    numero_identificacion: "",
    nombre: "",
    apellido: "",
    correo: "",
    biografia: "",
    cualificaciones: "",
    especialidades: [],
    hoja_vida: null,
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setFormData({
        ...formData,
        hoja_vida: file,
      })
      setErrors({ ...errors, hoja_vida: "" })
    } else {
      setErrors({
        ...errors,
        hoja_vida: "El archivo debe ser un PDF",
      })
    }
  }

  const handleSpecialtiesChange = (e) => {
    const specialties = e.target.value.split(",").map((s) => s.trim())
    setFormData({
      ...formData,
      especialidades: specialties,
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.numero_identificacion.trim()) {
      newErrors.numero_identificacion = "La cédula es requerida"
    }
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido"
    }
    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es requerido"
    }
    if (!formData.correo.trim() || !formData.correo.includes("@")) {
      newErrors.correo = "El correo es requerido y debe ser válido"
    }
    if (!formData.hoja_vida) {
      newErrors.hoja_vida = "Debe seleccionar una hoja de vida en PDF"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)

    // Limpiar formulario después de enviar
    setFormData({
      numero_identificacion: "",
      nombre: "",
      apellido: "",
      correo: "",
      biografia: "",
      cualificaciones: "",
      especialidades: [],
      hoja_vida: null,
    })
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="numero_identificacion">Número de Identificación:</label>
        <input
          type="text"
          id="numero_identificacion"
          name="numero_identificacion"
          value={formData.numero_identificacion}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: errors.numero_identificacion ? "2px solid red" : "1px solid #ddd",
          }}
        />
        {errors.numero_identificacion && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.numero_identificacion}</p>
        )}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: errors.nombre ? "2px solid red" : "1px solid #ddd",
          }}
        />
        {errors.nombre && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.nombre}</p>}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="apellido">Apellido:</label>
        <input
          type="text"
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: errors.apellido ? "2px solid red" : "1px solid #ddd",
          }}
        />
        {errors.apellido && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.apellido}</p>}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="correo">Correo Electrónico:</label>
        <input
          type="email"
          id="correo"
          name="correo"
          value={formData.correo}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: errors.correo ? "2px solid red" : "1px solid #ddd",
          }}
        />
        {errors.correo && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.correo}</p>}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="biografia">Biografía (Opcional):</label>
        <textarea
          id="biografia"
          name="biografia"
          value={formData.biografia}
          onChange={handleInputChange}
          rows="4"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontFamily: "Arial, sans-serif",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="cualificaciones">Cualificaciones (Opcional):</label>
        <textarea
          id="cualificaciones"
          name="cualificaciones"
          value={formData.cualificaciones}
          onChange={handleInputChange}
          rows="3"
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: "1px solid #ddd",
            fontFamily: "Arial, sans-serif",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="especialidades">Especialidades (Opcional - separadas por comas):</label>
        <input
          type="text"
          id="especialidades"
          name="especialidades"
          placeholder="Ej: Matemáticas, Física, Química"
          value={formData.especialidades.join(", ")}
          onChange={handleSpecialtiesChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="hoja_vida">Hoja de Vida (PDF):</label>
        <input
          type="file"
          id="hoja_vida"
          accept=".pdf"
          onChange={handleFileChange}
          style={{
            width: "100%",
            padding: "8px",
            marginTop: "5px",
            borderRadius: "4px",
            border: errors.hoja_vida ? "2px solid red" : "1px solid #ddd",
          }}
        />
        {errors.hoja_vida && <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>{errors.hoja_vida}</p>}
        {formData.hoja_vida && (
          <p style={{ color: "green", fontSize: "12px", marginTop: "5px" }}>
            Archivo seleccionado: {formData.hoja_vida.name}
          </p>
        )}
      </div>

      <button
        type="submit"
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Crear Profesor
      </button>
    </form>
  )
}

export default FormularioProfesor
