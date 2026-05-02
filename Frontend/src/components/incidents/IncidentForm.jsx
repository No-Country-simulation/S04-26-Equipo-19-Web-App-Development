"use client";

import { useState } from "react";

// Opciones iniciales del formulario.
// Más adelante pueden venir desde backend o desde un archivo de constantes.
const areas = ["Producción", "Mantenimiento", "Calidad", "Seguridad", "Logística"];

const incidentTypes = [
  "Falla mecánica",
  "Calidad",
  "Seguridad",
  "Mantenimiento",
  "Operativo",
];

const priorities = ["Baja", "Media", "Alta", "Crítica"];

export default function IncidentForm() {
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    // Por ahora no enviamos a backend.
    // Este feedback confirma que el flujo visual del formulario funciona.
    setMessage(
      "Incidente preparado correctamente. Próximo paso: conectar con la API."
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6"
    >
      <div>
        <label htmlFor="title" className="text-sm font-medium text-slate-300">
          Título
        </label>

        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Ej: Falla en cinta transportadora"
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="area" className="text-sm font-medium text-slate-300">
            Área
          </label>

          <select
            id="area"
            name="area"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            {areas.map((area) => (
              <option key={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="text-sm font-medium text-slate-300">
            Tipo de incidente
          </label>

          <select
            id="type"
            name="type"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          >
            {incidentTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="priority"
          className="text-sm font-medium text-slate-300"
        >
          Prioridad
        </label>

        <select
          id="priority"
          name="priority"
          className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
        >
          {priorities.map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="description"
          className="text-sm font-medium text-slate-300"
        >
          Descripción
        </label>

        <textarea
          id="description"
          name="description"
          rows="5"
          required
          placeholder="Describí brevemente qué ocurrió..."
          className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
        />
      </div>

      {message ? (
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
          {message}
        </div>
      ) : null}

      <button
        type="submit"
        className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Crear incidente
      </button>
    </form>
  );
}