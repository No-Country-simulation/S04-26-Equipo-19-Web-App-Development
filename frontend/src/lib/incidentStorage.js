// Utilidades para manejar persistencia local de incidentes.
//
// Mientras no exista backend, usamos localStorage para simular persistencia.
// Esta capa permite que la UI pueda:
//
// - crear incidentes nuevos,
// - asignar responsables,
// - cambiar estados,
// - cerrar incidentes,
// - reflejar cambios en listado, dashboard y reportes.
//
// Cuando integremos Django, este archivo será reemplazado o adaptado para usar
// llamadas HTTP reales, por ejemplo:
// GET /api/incidents
// POST /api/incidents
// PATCH /api/incidents/:id/assign
// PATCH /api/incidents/:id/close

const INCIDENT_UPDATES_STORAGE_KEY = "opscore-incident-updates";
const CREATED_INCIDENTS_STORAGE_KEY = "opscore-created-incidents";

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
 * Lee y parsea JSON desde localStorage de forma segura.
 *
 * Centralizamos esta lógica para evitar repetir try/catch en cada función.
 */
function readFromStorage(storageKey, fallbackValue) {
  if (!isBrowser()) return fallbackValue;

  try {
    return JSON.parse(localStorage.getItem(storageKey)) || fallbackValue;
  } catch (error) {
    console.error(`Error reading ${storageKey} from localStorage:`, error);
    return fallbackValue;
  }
}

/**
 * Guarda JSON en localStorage de forma segura.
 */
function writeToStorage(storageKey, value) {
  if (!isBrowser()) return;

  try {
    localStorage.setItem(storageKey, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${storageKey} in localStorage:`, error);
  }
}

/**
 * Genera un ID local para incidentes creados en modo demo.
 *
 * En backend, este ID debería venir desde la base de datos.
 */
function createLocalIncidentId() {
  return `INC-${Date.now()}`;
}

/**
 * Lee todos los cambios locales guardados sobre incidentes.
 *
 * Estos cambios aplican tanto sobre incidentes mock como sobre incidentes
 * creados localmente.
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
  return readFromStorage(INCIDENT_UPDATES_STORAGE_KEY, {});
}

/**
 * Guarda todos los cambios locales de incidentes.
 */
export function saveIncidentUpdates(updates) {
  writeToStorage(INCIDENT_UPDATES_STORAGE_KEY, updates);
}

/**
 * Obtiene los cambios locales de un incidente puntual.
 */
export function getIncidentUpdateById(incidentId) {
  const updates = getIncidentUpdates();

  return updates[incidentId] || null;
}

/**
 * Lee incidentes creados localmente desde el formulario de nuevo incidente.
 *
 * Estos incidentes no existen en src/data/incidents.js porque todavía no hay
 * backend ni base de datos.
 */
export function getCreatedIncidents() {
  return readFromStorage(CREATED_INCIDENTS_STORAGE_KEY, []);
}

/**
 * Guarda la lista completa de incidentes creados localmente.
 */
export function saveCreatedIncidents(incidents) {
  writeToStorage(CREATED_INCIDENTS_STORAGE_KEY, incidents);
}

/**
 * Crea y persiste un nuevo incidente local.
 *
 * Esta función representa el futuro POST /api/incidents.
 * Por ahora guarda el incidente en localStorage para que aparezca en:
 *
 * - /incidents
 * - /dashboard
 * - /reports
 */
export function createLocalIncident(formData) {
  const createdIncidents = getCreatedIncidents();

  const newIncident = {
    id: createLocalIncidentId(),
    title: formData.title.trim(),
    description: formData.description.trim(),
    area: formData.area,
    type: formData.type,
    priority: formData.priority,
    shift: formData.shift,
    location: formData.location.trim(),
    reportedBy: formData.reporterName?.trim() || "Operario sin identificar",
    assignedTo: "Sin asignar",
    status: INCIDENT_STATUS.OPEN,
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    resolutionNote: "",
    isLocalOnly: true,
  };

  const nextCreatedIncidents = [newIncident, ...createdIncidents];

  saveCreatedIncidents(nextCreatedIncidents);
  notifyIncidentUpdated(newIncident.id);

  return newIncident;
}

/**
 * Combina la información original de un incidente con sus cambios locales.
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
 * Devuelve la lista completa de incidentes visible para la app.
 *
 * Combina:
 * - incidentes mock originales,
 * - incidentes creados localmente,
 * - cambios locales aplicados sobre ambos.
 *
 * Esta función debería usarse en listado, dashboard y reportes.
 */
export function getAllMergedIncidents(baseIncidents = []) {
  const createdIncidents = getCreatedIncidents();

  const allIncidents = [...createdIncidents, ...baseIncidents];

  return allIncidents.map((incident) => getMergedIncident(incident));
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
 * Notifica a otros componentes que cambió información de incidentes.
 *
 * El evento "storage" del navegador no se dispara en la misma pestaña,
 * por eso usamos un evento custom para sincronizar pantallas locales.
 */
export function notifyIncidentUpdated(incidentId) {
  if (!isBrowser()) return;

  window.dispatchEvent(
    new CustomEvent("opscore-incident-updated", {
      detail: { incidentId },
    })
  );
}