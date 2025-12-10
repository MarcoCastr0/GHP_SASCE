import React, { useState } from "react";
import { profesorService } from "../../services/profesorService";
import FormularioProfesor from "./FormularioProfesor";

const CrearProfesor = () => {
  const [mensaje, setMensaje] = useState(null);

  const handleSubmit = async (data) => {
    try {
      const response = await profesorService.createProfesor(data);
      setMensaje("Profesor creado con éxito ✔️");
      console.log("Respuesta del servidor:", response);
    } catch (error) {
      setMensaje("Error: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Crear Profesor</h2>

      {mensaje && <p>{mensaje}</p>}

      <FormularioProfesor onSubmit={handleSubmit} />
    </div>
  );
};

export default CrearProfesor;
