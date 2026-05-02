// Utilidades para manejar cambios locales de incidentes.
//
// Mientras no exista backend, usamos localStorage para simular persistencia.
// La idea es que la UI pueda actualizar asignaciones, estados y resoluciones
// sin modificar directamente la mock data original.
//
// Cuando integremos Django, este archivo será reemplazado o adaptado para usar
// llamadas HTTP reales, por ejemplo:
// PATCH /api/incidents/:id/assign
// PATCH /api/incidents/:id/close

const STORAGE_KEY = "opscore-incident-updates";

export const INCIDENT_STATUS = {
  OPEN: "Abierto",
  IN_PROGRESS: "En proceso",
  CLOSED: "Cerrado",
};

/**
 * Verifica si estamos en el navegador.
 *
 * Next.js puede renderizar componentes en servidor, donde window/localStorage
 * no existen. Este guard evita errores durante renderizado server-side.
 */
function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * Lee todos los cambios locales guardados para incidentes.
 *
 * Estructura esperada:
 * {
 *   "INC-001": {
 *     assignedTo: "Carlos Méndez",
 *     status: "En proceso",
 *     resolutionNote: "...",
 *     resolvedAt: "2026-05-02T15:30:00.000Z"
 *   }
 * }
 */
export function getIncidentUpdates() {
  if (!isBrowser()) return {};

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    console.error("Error reading incident updates from localStorage:", error);
    return {};
  }
}

/**
 * Guarda todos los cambios locales de incidentes.
 */
export function saveIncidentUpdates(updates) {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updates));
  } catch (error) {
    console.error("Error saving incident updates in localStorage:", error);
  }
}

/**
 * Obtiene los cambios locales de un incidente puntual.
 */
export function getIncidentUpdateById(incidentId) {
  const updates = getIncidentUpdates();

  return updates[incidentId] || null;
}

/**
 * Combina la información original del mock con los cambios locales.
 *
 * Esto permite que la UI vea un incidente actualizado aunque la data base
 * siga viniendo desde src/data/incidents.js.
 */
export function getMergedIncident(incident) {
  if (!incident) return null;

  const localUpdate = getIncidentUpdateById(incident.id);

  return {
    ...incident,
    ...localUpdate,
  };
}

/**
 * Guarda la asignación de técnico para un incidente.
 *
 * Esta función representa la acción del supervisor:
 * asignar responsable y mover el incidente a "En proceso".
 */
export function saveIncidentAssignment({ incidentId, assignedTo }) {
  const updates = getIncidentUpdates();
  const previousUpdate = updates[incidentId] || {};

  const nextUpdate = {
    ...previousUpdate,
    assignedTo,
    status: INCIDENT_STATUS.IN_PROGRESS,
  };

  saveIncidentUpdates({
    ...updates,
    [incidentId]: nextUpdate,
  });

  notifyIncidentUpdated(incidentId);

  return nextUpdate;
}

/**
 * Guarda la resolución de un incidente.
 *
 * Esta función representa la acción del técnico o supervisor:
 * documentar la solución aplicada y cerrar el incidente.
 */
export function saveIncidentResolution({ incidentId, resolutionNote }) {
  const updates = getIncidentUpdates();
  const previousUpdate = updates[incidentId] || {};

  const nextUpdate = {
    ...previousUpdate,
    status: INCIDENT_STATUS.CLOSED,
    resolutionNote,
    resolvedAt: new Date().toISOString(),
  };

  saveIncidentUpdates({
    ...updates,
    [incidentId]: nextUpdate,
  });

  notifyIncidentUpdated(incidentId);

  return nextUpdate;
}

/**
 * Notifica a otros componentes de la misma pantalla que un incidente cambió.
 *
 * El evento "storage" del navegador no se dispara en la misma pestaña,
 * por eso usamos un evento custom para sincronizar formularios locales.
 */
export function notifyIncidentUpdated(incidentId) {
  if (!isBrowser()) return;

  window.dispatchEvent(
    new CustomEvent("opscore-incident-updated", {
      detail: { incidentId },
    })
  );
}