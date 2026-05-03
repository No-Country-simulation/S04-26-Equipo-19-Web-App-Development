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
      <form onSubmit={handleSubmit} className="panel space-y-5 p-6">
        <TextField
          id="title"
          name="title"
          label="Título del incidente"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Ej: Falla en cinta transportadora"
        />

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
          <TextField
            id="location"
            name="location"
            label="Sector o ubicación"
            value={formData.location}
            onChange={handleChange}
            error={errors.location}
            placeholder="Ej: Línea 2, sector envasado"
          />

          <TextField
            id="reporterName"
            name="reporterName"
            label="Reportado por"
            value={formData.reporterName}
            onChange={handleChange}
            placeholder="Nombre del operador"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">
            Descripción
          </label>

          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describí qué ocurrió, cuándo se detectó y si afecta la operación..."
            className="form-control"
          />

          {errors.description ? (
            <p className="text-sm font-medium text-[var(--status-critical)]">
              {errors.description}
            </p>
          ) : null}
        </div>

        {successMessage ? (
          <div className="rounded-[var(--radius-md)] border border-[rgba(45,106,79,0.28)] bg-[rgba(45,106,79,0.08)] px-4 py-3 text-sm font-medium text-[var(--status-resolved)]">
            {successMessage}
          </div>
        ) : null}

        <button
    type="submit"
    className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 md:w-auto"
  >
    Registrar incidente
  </button>
      </form>

      {lastSubmittedIncident ? (
        <section className="panel mt-6 p-5">
          <div className="border-l-4 border-[var(--status-resolved)] pl-4">
            <p className="page-eyebrow">Incidente creado</p>

            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Registro guardado en modo demo
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              El incidente fue guardado localmente. Ya puede verse en el
              listado, dashboard y reportes.
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Link href="/incidents" className="btn-primary w-fit">
              Ver listado
            </Link>

            <Link href="/dashboard" className="btn-secondary w-fit">
              Ver dashboard
            </Link>
          </div>

          <pre className="mt-4 max-h-72 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border-muted)] bg-[var(--surface-soft)] p-4 text-xs leading-6 text-[var(--text-secondary)]">
            {JSON.stringify(lastSubmittedIncident, null, 2)}
          </pre>
        </section>
      ) : null}
    </div>
  );
}

/**
 * Campo input reutilizable dentro del formulario.
 *
 * Evita repetir estilos y mantiene consistencia visual entre campos.
 */
function TextField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  placeholder,
}) {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>

      <input
        id={id}
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
      />

      {error ? (
        <p className="text-sm font-medium text-[var(--status-critical)]">
          {error}
        </p>
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
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="form-control"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error ? (
        <p className="text-sm font-medium text-[var(--status-critical)]">
          {error}
        </p>
      ) : null}
    </div>
  );
}