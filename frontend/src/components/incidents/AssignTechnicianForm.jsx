"use client";

import { useEffect, useState } from "react";

import { technicians } from "@/constants/technicians";
import {
  getIncidentUpdateById,
  INCIDENT_STATUS,
  saveIncidentAssignment,
} from "@/lib/incidentStorage";

/**
 * Formulario para asignar un técnico responsable a un incidente.
 *
 * Este componente representa una acción del supervisor:
 * tomar un incidente abierto, asignar responsable y moverlo a "En proceso".
 *
 * Es Client Component porque usa estado local y localStorage.
 */
export default function AssignTechnicianForm({
  incidentId,
  currentAssignedTo = "Sin asignar",
  currentStatus = INCIDENT_STATUS.OPEN,
}) {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [assignedTo, setAssignedTo] = useState(currentAssignedTo);
  const [status, setStatus] = useState(currentStatus);

  /**
   * Al cargar el componente, revisamos si este incidente ya tiene cambios
   * guardados localmente. Si los tiene, mostramos esos valores actualizados.
   */
  useEffect(() => {
    const savedIncident = getIncidentUpdateById(incidentId);

    if (!savedIncident) return;

    setAssignedTo(savedIncident.assignedTo || currentAssignedTo);
    setStatus(savedIncident.status || currentStatus);
  }, [incidentId, currentAssignedTo, currentStatus]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedTechnicianId) return;

    const selectedTechnician = technicians.find(
      (technician) => technician.id === selectedTechnicianId,
    );

    if (!selectedTechnician) return;

    const updatedIncident = saveIncidentAssignment({
      incidentId,
      assignedTo: selectedTechnician.name,
    });

    setAssignedTo(updatedIncident.assignedTo);
    setStatus(updatedIncident.status);
    setSelectedTechnicianId("");
  }

  const isSubmitDisabled = !selectedTechnicianId;

  return (
    <section className="panel p-6 md:p-8">
      <div className="mb-6">
        <p className="page-eyebrow">Gestión del incidente</p>

        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Asignar técnico
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
          Seleccioná un responsable para iniciar la resolución del incidente.
          Esta acción mueve el caso a estado En proceso.
        </p>
      </div>

      <div className="mb-6 grid gap-4 rounded-[var(--radius-md)] border border-[var(--border-muted)] bg-[var(--surface-soft)] p-5 md:grid-cols-2">
        <InfoBlock label="Responsable actual" value={assignedTo} />

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            Estado
          </p>

          <p className="mt-3">
            <span className="badge badge-open">{status}</span>
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="form-group">
          <label htmlFor="technician" className="form-label">
            Técnico responsable
          </label>

          <select
            id="technician"
            value={selectedTechnicianId}
            onChange={(event) => setSelectedTechnicianId(event.target.value)}
            className="form-control"
          >
            <option value="">Seleccionar técnico</option>

            {technicians.map((technician) => (
              <option key={technician.id} value={technician.id}>
                {technician.name} — {technician.role}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="btn-primary disabled:cursor-not-allowed disabled:border-[var(--border-soft)] disabled:bg-[var(--surface-muted)] disabled:text-[var(--text-disabled)]"
        >
          Asignar técnico
        </button>
      </form>
    </section>
  );
}

/**
 * Bloque simple para mostrar información operativa.
 */
function InfoBlock({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 font-bold text-[var(--text-primary)]">{value}</p>
    </div>
  );
}