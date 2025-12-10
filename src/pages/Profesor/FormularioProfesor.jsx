import React, { useState } from "react";

const FormularioProfesor = ({ onSubmit }) => {
  const [form, setForm] = useState({
    numero_identificacion: "",
    nombre: "",
    apellido: "",
    correo: "",
    biografia: "",
    cualificaciones: "",
    especialidades: [],
    hoja_vida: null,
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEspecialidad = (e) => {
    const value = e.target.value;
    setForm({
      ...form,
      especialidades: value.split(",").map((item) => item.trim()),
    });
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      alert("Solo se admite PDF.");
      return;
    }
    setForm({
      ...form,
      hoja_vida: file,
    });
  };

  const enviar = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={enviar} style={{ display: "flex", flexDirection: "column", gap: "12px", width: "400px" }}>
      
      <input
        type="text"
        name="numero_identificacion"
        placeholder="Número de identificación"
        value={form.numero_identificacion}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        value={form.nombre}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="apellido"
        placeholder="Apellido"
        value={form.apellido}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="correo"
        placeholder="Correo"
        value={form.correo}
        onChange={handleChange}
        required
      />

      <textarea
        name="biografia"
        placeholder="Biografía"
        value={form.biografia}
        onChange={handleChange}
      />

      <textarea
        name="cualificaciones"
        placeholder="Cualificaciones"
        value={form.cualificaciones}
        onChange={handleChange}
      />

      <input
        type="text"
        name="especialidades"
        placeholder="Especialidades separadas con coma (ej: Matemáticas, Física)"
        onChange={handleEspecialidad}
      />

      <label>Hoja de vida (PDF):</label>
      <input type="file" accept="application/pdf" onChange={handleFile} required />

      <button type="submit" style={{ padding: "10px", background: "green", color: "white" }}>
        Crear Profesor
      </button>
    </form>
  );
};

export default FormularioProfesor;
