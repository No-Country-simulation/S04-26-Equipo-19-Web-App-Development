"use client";

import Link from "next/link";
import { useState } from "react";

import {
  CUSTOM_INCIDENT_TYPE_OPTION,
  INCIDENT_DESCRIPTION_MAX_LENGTH,
  incidentAreas,
  incidentPriorities,
  incidentShifts,
  incidentTypes,
  initialIncidentFormState,
} from "@/constants/incidentOptions";
import { createIncident } from "@/lib/api";
import { createLocalIncident } from "@/lib/incidentStorage";

const CONNECTION_ERROR_MESSAGE =
  "Error de conexión. No se pudo registrar el incidente. Revisá tu conexión e intentá nuevamente.";

/**
 * Formulario principal para reportar incidentes.
 *
 * Primero intenta registrar el incidente mediante una petición HTTP real.
 * Solo si la petición responde correctamente, persiste una copia local para
 * mantener funcionando el flujo demo de listado, dashboard y reportes.
 */
export default function IncidentForm() {
  const [formData, setFormData] = useState(initialIncidentFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastSubmittedIncident, setLastSubmittedIncident] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCustomTypeSelected = formData.type === CUSTOM_INCIDENT_TYPE_OPTION;

  /**
   * Actualiza el estado del formulario usando el atributo "name" de cada input.
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentData) => {
      if (name === "type" && value !== CUSTOM_INCIDENT_TYPE_OPTION) {
        return {
          ...currentData,
          type: value,
          customType: "",
        };
      }

      return {
        ...currentData,
        [name]: value,
      };
    });

    setErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
      ...(name === "type" ? { customType: "" } : {}),
    }));

    setSuccessMessage("");
    setErrorMessage("");
  }

  /**
   * Limpia el estado posterior al envío exitoso y permite cargar un nuevo reporte.
   */
  function handleCreateNewReport() {
    setFormData(initialIncidentFormState);
    setErrors({});
    setSuccessMessage("");
    setErrorMessage("");
    setLastSubmittedIncident(null);
    setIsSubmitting(false);
  }

  /**
   * Devuelve el tipo final del incidente.
   *
   * Si el usuario selecciona "Otro", usa el valor personalizado ingresado.
   */
  function getResolvedIncidentType() {
    if (formData.type === CUSTOM_INCIDENT_TYPE_OPTION) {
      return formData.customType.trim();
    }

    return formData.type;
  }

  /**
   * Normaliza los datos antes de enviarlos a la capa de API/localStorage.
   */
  function buildIncidentPayload() {
    return {
      title: formData.title.trim(),
      area: formData.area,
      type: getResolvedIncidentType(),
      priority: formData.priority,
      shift: formData.shift,
      location: formData.location.trim(),
      reporterName: formData.reporterName.trim(),
      description: formData.description.trim(),
    };
  }

  /**
   * Valida los campos obligatorios antes de intentar enviar la petición.
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

    if (
      formData.type === CUSTOM_INCIDENT_TYPE_OPTION &&
      !formData.customType.trim()
    ) {
      newErrors.customType = "Especificá el tipo de incidente.";
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

    if (cleanDescription.length > INCIDENT_DESCRIPTION_MAX_LENGTH) {
      newErrors.description = `La descripción no puede superar los ${INCIDENT_DESCRIPTION_MAX_LENGTH} caracteres.`;
    }

    return newErrors;
  }

  /**
   * Envía el formulario.
   *
   * Si la petición HTTP falla, no se limpia el formulario y no se confirma
   * un registro ficticio. Esto corrige el comportamiento reportado por QA
   * en modo offline.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccessMessage("");
      setErrorMessage("");
      return;
    }

    const incidentPayload = buildIncidentPayload();

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await createIncident(incidentPayload);

      const newIncident = createLocalIncident(incidentPayload);

      setLastSubmittedIncident(newIncident);
      setSuccessMessage(
        `Incidente registrado correctamente. ID: ${newIncident.id}.`,
      );
      setFormData(initialIncidentFormState);
      setErrors({});
    } catch (error) {
      setLastSubmittedIncident(null);
      setSuccessMessage("");
      setErrorMessage(error?.message || CONNECTION_ERROR_MESSAGE);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (lastSubmittedIncident) {
    return (
      <section className="panel mt-8 max-w-full overflow-hidden p-5">
        <div className="border-l-4 border-(--status-resolved) pl-4">
          <p className="page-eyebrow">Incidente creado</p>

          <h2 className="text-lg font-bold text-(--text-primary)">
            Registro guardado correctamente
          </h2>

          <p
            className="mt-2 max-w-full wrap-break-word text-sm leading-6 text-(--text-muted)"
            role="status"
          >
            {successMessage}
          </p>
        </div>

        <dl className="mt-5 grid min-w-0 gap-3 rounded-md border border-(--border-muted) bg-(--surface-soft) p-4 text-sm sm:grid-cols-2">
          <div className="min-w-0">
            <dt className="font-bold text-(--text-primary)">ID</dt>
            <dd className="mt-1 break-all font-mono text-(--text-secondary)">
              {lastSubmittedIncident.id}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="font-bold text-(--text-primary)">Tipo</dt>
            <dd className="mt-1 wrap-break-wordword text-(--text-secondary)">
              {lastSubmittedIncident.type}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="font-bold text-(--text-primary)">Área</dt>
            <dd className="mt-1 wrap-break-word text-(--text-secondary)">
              {lastSubmittedIncident.area}
            </dd>
          </div>

          <div className="min-w-0">
            <dt className="font-bold text-(--text-primary)">Prioridad</dt>
            <dd className="mt-1 wrap-break-word text-(--text-secondary)">
              {lastSubmittedIncident.priority}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="btn-primary w-full justify-center sm:w-auto"
          >
            Volver al inicio
          </Link>

          <button
            type="button"
            onClick={handleCreateNewReport}
            className="btn-secondary w-full justify-center sm:w-auto"
          >
            Nuevo reporte
          </button>

          <Link
            href="/incidents"
            className="btn-secondary w-full justify-center sm:w-auto"
          >
            Ver listado
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-8 max-w-full overflow-hidden">
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

        <div className="grid items-start gap-5 md:grid-cols-2">
          {" "}
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
          <div className="space-y-4">
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

            {isCustomTypeSelected ? (
              <TextField
                id="customType"
                name="customType"
                label="Especificá el tipo de incidente"
                value={formData.customType}
                onChange={handleChange}
                error={errors.customType}
                placeholder="Ej: Derrame menor, bloqueo de acceso, otro caso operativo..."
              />
            ) : null}
          </div>
        </div>

        <div className="grid items-start gap-5 md:grid-cols-2">
          {" "}
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

        <div className="grid items-start gap-5 md:grid-cols-2">
          {" "}
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
            maxLength={INCIDENT_DESCRIPTION_MAX_LENGTH}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describí qué ocurrió, cuándo se detectó y si afecta la operación..."
            className="form-control"
            aria-invalid={Boolean(errors.description)}
            aria-describedby={
              errors.description
                ? "description-error description-counter"
                : "description-counter"
            }
          />

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            {errors.description ? (
              <p
                id="description-error"
                className="text-sm font-medium text-(--status-critical)"
              >
                {errors.description}
              </p>
            ) : (
              <span aria-hidden="true" />
            )}

            <p
              id="description-counter"
              className="text-sm font-medium text-(--text-muted)"
            >
              {formData.description.length} / {INCIDENT_DESCRIPTION_MAX_LENGTH}{" "}
              caracteres
            </p>
          </div>
        </div>

        {errorMessage ? (
          <div
            className="max-w-full wrap-break-word rounded-md border border-[rgba(220,38,38,0.28)] bg-[rgba(220,38,38,0.08)] px-4 py-3 text-sm font-medium text-(--status-critical)"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
        >
          {isSubmitting ? "Registrando..." : "Registrar incidente"}
        </button>
      </form>
    </div>
  );
}

/**
 * Campo input reutilizable dentro del formulario.
 *
 * Evita repetir estilos y mantiene consistencia visual entre campos.
 */
function TextField({ id, name, label, value, onChange, error, placeholder }) {
  const errorId = `${id}-error`;

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
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      />

      {error ? (
        <p
          id={errorId}
          className="text-sm font-medium text-(--status-critical)"
        >
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
  const errorId = `${id}-error`;

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
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error ? (
        <p
          id={errorId}
          className="text-sm font-medium text-(--status-critical)"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
