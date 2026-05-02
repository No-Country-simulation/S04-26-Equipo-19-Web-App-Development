"use client";

import { useEffect, useState } from "react";
import { technicians } from "@/constants/technicians";

// Key única para guardar asignaciones locales en el navegador.
// Esto simula persistencia hasta que conectemos el backend real.
const STORAGE_KEY = "opscore-incident-assignments";

// Estados usados por el flujo de asignación.
// Lo dejamos como constante para evitar strings repetidos y errores de tipeo.
const INCIDENT_STATUS = {
  IN_PROGRESS: "En proceso",
};

/**
 * Lee las asignaciones guardadas en localStorage.
 *
 * La función está separada para mantener el componente más limpio
 * y para centralizar el manejo de errores.
 */
function getStoredAssignments() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    console.error("Error reading incident assignments from localStorage:", error);
    return {};
  }
}

/**
 * Guarda las asignaciones actualizadas en localStorage.
 *
 * En el futuro, esta función sería reemplazada por una llamada al backend:
 * PATCH /api/incidents/:id/assign
 */
function saveStoredAssignments(assignments) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch (error) {
    console.error("Error saving incident assignments in localStorage:", error);
  }
}

/**
 * Formulario para asignar un técnico responsable a un incidente.
 *
 * Este componente representa una acción típica del supervisor:
 * tomar un incidente abierto, asignar un responsable y moverlo a "En proceso".
 */
export default function AssignTechnicianForm({
  incidentId,
  currentAssignedTo = "Sin asignar",
  currentStatus = "Abierto",
}) {
  const [selectedTechnicianId, setSelectedTechnicianId] = useState("");
  const [assignedTo, setAssignedTo] = useState(currentAssignedTo);
  const [status, setStatus] = useState(currentStatus);

  /**
   * Al cargar el componente, buscamos si este incidente ya tenía
   * una asignación guardada localmente.
   *
   * Esto permite que la asignación sobreviva al refresh de la página
   * mientras seguimos trabajando sin backend.
   */
  useEffect(() => {
    const savedAssignments = getStoredAssignments();
    const savedIncident = savedAssignments[incidentId];

    if (!savedIncident) return;

    setAssignedTo(savedIncident.assignedTo);
    setStatus(savedIncident.status);
  }, [incidentId]);

  function handleSubmit(event) {
    event.preventDefault();

    if (!selectedTechnicianId) return;

    const selectedTechnician = technicians.find(
      (technician) => technician.id === selectedTechnicianId
    );

    if (!selectedTechnician) return;

    const savedAssignments = getStoredAssignments();

    const updatedIncident = {
      assignedTo: selectedTechnician.name,
      status: INCIDENT_STATUS.IN_PROGRESS,
    };

    saveStoredAssignments({
      ...savedAssignments,
      [incidentId]: updatedIncident,
    });

    setAssignedTo(updatedIncident.assignedTo);
    setStatus(updatedIncident.status);
    setSelectedTechnicianId("");
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-xl font-semibold text-slate-900">
          Asignar técnico
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Seleccioná un responsable para comenzar la resolución del incidente.
        </p>
      </div>

      <div className="mb-5 grid gap-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-2">
        <div>
          <p className="text-slate-500">Responsable actual</p>
          <p className="font-medium text-slate-900">{assignedTo}</p>
        </div>

        <div>
          <p className="text-slate-500">Estado</p>
          <p className="font-medium text-slate-900">{status}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="technician"
            className="mb-2 block text-sm font-medium text-slate-700"
          >
            Técnico responsable
          </label>

          <select
            id="technician"
            value={selectedTechnicianId}
            onChange={(event) => setSelectedTechnicianId(event.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-200"
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
          disabled={!selectedTechnicianId}
          className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Asignar técnico
        </button>
      </form>
    </section>
  );
}