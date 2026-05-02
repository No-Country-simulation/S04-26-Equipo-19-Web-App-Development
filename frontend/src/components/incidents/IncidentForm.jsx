"use client";

import Link from "next/link";
import { useState } from "react";

import {
  incidentAreas,
  incidentPriorities,
  incidentShifts,
  incidentTypes,
  initialIncidentFormState,
} from "@/constants/incidentOptions";
import { createLocalIncident } from "@/lib/incidentStorage";

/**
 * Formulario principal para reportar incidentes.
 *
 * Por ahora trabaja en modo demo, sin backend.
 * Cuando el usuario registra un incidente, lo guardamos en localStorage para
 * que aparezca en listado, dashboard y reportes.
 *
 * En el futuro, createLocalIncident será reemplazado por una llamada:
 * POST /api/incidents
 */
export default function IncidentForm() {
  const [formData, setFormData] = useState(initialIncidentFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [lastSubmittedIncident, setLastSubmittedIncident] = useState(null);

  /**
   * Actualiza el estado del formulario usando el atributo "name" de cada input.
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    /**
     * Si el usuario corrige un campo, limpiamos solo ese error.
     * Esto mejora UX sin borrar errores de otros campos.
     */
    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setSuccessMessage("");
  }

  /**
   * Validación mínima del lado cliente.
   *
   * Esto mejora la experiencia del usuario, pero no reemplaza validaciones
   * reales del backend cuando exista Django.
   */
  function validateForm() {
    const newErrors = {};
    const cleanDescription = formData.description.trim();

    if (!formData.title.trim()) {
      newErrors.title = "El título es obligatorio.";
    }

    if (!formData.area) {
      newErrors.area = "Seleccioná un área.";
    }

    if (!formData.type) {
      newErrors.type = "Seleccioná un tipo de incidente.";
    }

    if (!formData.priority) {
      newErrors.priority = "Seleccioná una prioridad.";
    }

    if (!formData.shift) {
      newErrors.shift = "Seleccioná un turno.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Indicá el sector, línea o ubicación.";
    }

    if (!cleanDescription) {
      newErrors.description = "La descripción es obligatoria.";
    }

    if (cleanDescription.length > 0 && cleanDescription.length < 15) {
      newErrors.description =
        "La descripción debe tener al menos 15 caracteres.";
    }

    return newErrors;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
      return;
    }

    const newIncident = createLocalIncident(formData);

    setLastSubmittedIncident(newIncident);
    setSuccessMessage(
      "Incidente registrado correctamente. Ya está disponible en el listado, dashboard y reportes."
    );
    setFormData(initialIncidentFormState);
    setErrors({});
  }

  return (
    <div className="mt-8">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6"
      >
        <div>
          <label htmlFor="title" className="text-sm font-medium text-slate-300">
            Título del incidente
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Falla en cinta transportadora"
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          {errors.title ? (
            <p className="mt-2 text-sm text-red-300">{errors.title}</p>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            id="area"
            name="area"
            label="Área"
            value={formData.area}
            onChange={handleChange}
            error={errors.area}
            options={incidentAreas}
            placeholder="Seleccionar área"
          />

          <SelectField
            id="type"
            name="type"
            label="Tipo de incidente"
            value={formData.type}
            onChange={handleChange}
            error={errors.type}
            options={incidentTypes}
            placeholder="Seleccionar tipo"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <SelectField
            id="priority"
            name="priority"
            label="Prioridad"
            value={formData.priority}
            onChange={handleChange}
            error={errors.priority}
            options={incidentPriorities}
            placeholder="Seleccionar prioridad"
          />

          <SelectField
            id="shift"
            name="shift"
            label="Turno"
            value={formData.shift}
            onChange={handleChange}
            error={errors.shift}
            options={incidentShifts}
            placeholder="Seleccionar turno"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="location"
              className="text-sm font-medium text-slate-300"
            >
              Sector o ubicación
            </label>

            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: Línea 2, sector envasado"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />

            {errors.location ? (
              <p className="mt-2 text-sm text-red-300">{errors.location}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="reporterName"
              className="text-sm font-medium text-slate-300"
            >
              Reportado por
            </label>

            <input
              id="reporterName"
              name="reporterName"
              type="text"
              value={formData.reporterName}
              onChange={handleChange}
              placeholder="Nombre del operador"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>
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
            value={formData.description}
            onChange={handleChange}
            placeholder="Describí qué ocurrió, cuándo se detectó y si afecta la operación..."
            className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
          />

          {errors.description ? (
            <p className="mt-2 text-sm text-red-300">{errors.description}</p>
          ) : null}
        </div>

        {successMessage ? (
          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
        >
          Registrar incidente
        </button>
      </form>

      {lastSubmittedIncident ? (
        <section className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-5">
          <h2 className="text-lg font-semibold text-white">
            Incidente creado
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            El incidente fue guardado localmente en modo demo. Ya puede verse en
            el listado y en las métricas.
          </p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/incidents"
              className="inline-flex w-fit rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Ver listado
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex w-fit rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10"
            >
              Ver dashboard
            </Link>
          </div>

          <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-300">
            {JSON.stringify(lastSubmittedIncident, null, 2)}
          </pre>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Campo select reutilizable dentro del formulario.
 *
 * Reduce duplicación y mantiene estilos consistentes entre selects.
 */
function SelectField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  options,
  placeholder,
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-slate-300">
        {label}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}
    </div>
  );
}