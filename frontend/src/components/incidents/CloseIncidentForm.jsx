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
        handleIncidentUpdated
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
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 md:p-8 lg:p-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Resolución
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Cerrar incidente
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Registrá la solución aplicada para cerrar el incidente y dejar trazabilidad
          del trabajo realizado.
        </p>
      </div>

      {isClosed && (
        <div className="mb-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-sm font-semibold text-emerald-300">
            Incidente cerrado
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            {resolutionNote ||
              "Incidente cerrado. La nota de resolución no está disponible."}
          </p>

          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Fecha de resolución
          </p>

          <p className="mt-1 text-sm font-semibold text-white">
            {resolvedAt ? formatDate(resolvedAt) : "Sin información"}
          </p>
        </div>
      )}

      {!isClosed && !canClose && (
        <div className="mb-6 rounded-3xl border border-amber-400/20 bg-amber-400/10 p-5">
          <p className="text-sm font-semibold text-amber-300">
            Asignación requerida
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Para cerrar este incidente, primero debe estar asignado a un técnico
            y figurar en estado En proceso.
          </p>
        </div>
      )}

      {!isClosed && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="resolutionNote"
              className="mb-2 block text-sm font-semibold text-slate-300"
            >
              Solución aplicada
            </label>

            <textarea
              id="resolutionNote"
              rows={5}
              value={resolutionNote}
              onChange={(event) => setResolutionNote(event.target.value)}
              placeholder="Ejemplo: Se reemplazó el rodamiento dañado y se verificó el funcionamiento de la cinta transportadora."
              className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-600 hover:border-cyan-400/30 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="inline-flex rounded-2xl bg-emerald-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            Cerrar incidente
          </button>
        </form>
      )}
    </section>
  );
}