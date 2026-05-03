"use client";

import { useEffect, useState } from "react";

import {
  getIncidentUpdateById,
  INCIDENT_STATUS,
  saveIncidentResolution,
} from "@/lib/incidentStorage";
import { formatDate } from "@/utils/formatDate";

/**
 * Formulario para cerrar un incidente.
 *
 * Este componente representa la acción posterior a la asignación:
 * el técnico o supervisor documenta la solución aplicada y cierra el caso.
 */
export default function CloseIncidentForm({
  incidentId,
  currentStatus = INCIDENT_STATUS.OPEN,
  currentResolvedAt = null,
}) {
  const [status, setStatus] = useState(currentStatus);
  const [resolvedAt, setResolvedAt] = useState(currentResolvedAt);
  const [resolutionNote, setResolutionNote] = useState("");

  /**
   * Carga el estado local del incidente.
   *
   * Se usa tanto al montar el componente como cuando otro componente
   * de la pantalla dispara el evento "opscore-incident-updated".
   */
  function syncIncidentState() {
    const savedIncident = getIncidentUpdateById(incidentId);

    if (!savedIncident) return;

    setStatus(savedIncident.status || currentStatus);
    setResolvedAt(savedIncident.resolvedAt || currentResolvedAt);
    setResolutionNote(savedIncident.resolutionNote || "");
  }

  useEffect(() => {
    syncIncidentState();

    function handleIncidentUpdated(event) {
      if (event.detail?.incidentId !== incidentId) return;

      syncIncidentState();
    }

    window.addEventListener("opscore-incident-updated", handleIncidentUpdated);

    return () => {
      window.removeEventListener(
        "opscore-incident-updated",
        handleIncidentUpdated,
      );
    };
  }, [incidentId]);

  function handleSubmit(event) {
    event.preventDefault();

    const cleanResolutionNote = resolutionNote.trim();

    if (!cleanResolutionNote) return;

    const updatedIncident = saveIncidentResolution({
      incidentId,
      resolutionNote: cleanResolutionNote,
    });

    setStatus(updatedIncident.status);
    setResolvedAt(updatedIncident.resolvedAt);
    setResolutionNote(updatedIncident.resolutionNote);
  }

  const isClosed = status === INCIDENT_STATUS.CLOSED;
  const canClose = status === INCIDENT_STATUS.IN_PROGRESS;
  const isSubmitDisabled = !canClose || !resolutionNote.trim();

  return (
    <section className="panel p-6 md:p-8">
      <div className="mb-6">
        <p className="page-eyebrow">Resolución</p>

        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Cerrar incidente
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Registrá la solución aplicada para cerrar el incidente y dejar
          trazabilidad del trabajo realizado.
        </p>
      </div>

      {isClosed ? (
        <div className="mb-6 rounded-[var(--radius-md)] border border-[rgba(45,106,79,0.28)] bg-[rgba(45,106,79,0.08)] p-5">
          <p className="font-bold text-[var(--status-resolved)]">
            Incidente cerrado
          </p>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            {resolutionNote ||
              "Incidente cerrado. La nota de resolución no está disponible."}
          </p>

          <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Fecha de resolución
          </p>

          <p className="mt-1 font-bold text-[var(--text-primary)]">
            {resolvedAt ? formatDate(resolvedAt) : "Sin información"}
          </p>
        </div>
      ) : null}

      {!isClosed && !canClose ? (
        <div className="mb-6 rounded-[var(--radius-md)] border border-[rgba(176,137,0,0.3)] bg-[rgba(176,137,0,0.1)] p-5">
          <p className="font-bold text-[#7a5f00]">Asignación requerida</p>

          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Para cerrar este incidente, primero debe estar asignado a un técnico
            y figurar en estado En proceso.
          </p>
        </div>
      ) : null}

      {!isClosed ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="form-group">
            <label htmlFor="resolutionNote" className="form-label">
              Solución aplicada
            </label>

            <textarea
              id="resolutionNote"
              rows={5}
              value={resolutionNote}
              onChange={(event) => setResolutionNote(event.target.value)}
              placeholder="Ejemplo: Se reemplazó el rodamiento dañado y se verificó el funcionamiento de la cinta transportadora."
              className="form-control"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="btn-warning disabled:cursor-not-allowed disabled:border-[var(--border-soft)] disabled:bg-[var(--surface-muted)] disabled:text-[var(--text-disabled)]"
          >
            Cerrar incidente
          </button>
        </form>
      ) : null}
    </section>
  );
}