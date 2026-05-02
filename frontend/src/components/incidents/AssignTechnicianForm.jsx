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
      (technician) => technician.id === selectedTechnicianId
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
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 md:p-8 lg:p-10">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
          Gestión del incidente
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-white">
          Asignar técnico
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          Seleccioná un responsable para iniciar la resolución del incidente.
          Esta acción mueve el caso a estado En proceso.
        </p>
      </div>

      <div className="mb-6 grid gap-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Responsable actual
          </p>

          <p className="mt-3 text-sm font-semibold text-white">{assignedTo}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            Estado
          </p>

          <p className="mt-3 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-semibold text-cyan-300">
            {status}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="technician"
            className="mb-2 block text-sm font-semibold text-slate-300"
          >
            Técnico responsable
          </label>

          <select
            id="technician"
            value={selectedTechnicianId}
            onChange={(event) => setSelectedTechnicianId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm font-medium text-white outline-none transition hover:border-cyan-400/30 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/10"
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
          className="inline-flex rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Asignar técnico
        </button>
      </form>
    </section>
  );
}