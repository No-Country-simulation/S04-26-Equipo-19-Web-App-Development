import { incidents } from "@/data/incidents";

/**
 * Capa temporal de acceso a datos.
 *
 * Actualmente estas funciones devuelven información desde mock data local.
 * La idea es que los componentes y páginas llamen a funciones de este archivo
 * en vez de depender directamente de "@/data/incidents".
 *
 * Cuando el backend Django esté disponible, reemplazamos la lógica interna
 * por llamadas HTTP reales sin tener que reescribir toda la UI.
 *
 * Ejemplo futuro:
 * const response = await fetch(`${API_URL}/incidents`);
 * return response.json();
 */

/**
 * Obtiene todos los incidentes.
 *
 * Futuro endpoint esperado:
 * GET /api/incidents
 */
export async function getIncidents() {
  return incidents;
}

/**
 * Obtiene un incidente específico por ID.
 *
 * Futuro endpoint esperado:
 * GET /api/incidents/:id
 */
export async function getIncidentById(id) {
  return incidents.find((incident) => incident.id === id);
}

/**
 * Crea un nuevo incidente.
 *
 * Por ahora no persiste datos porque seguimos trabajando con mock data.
 * Esta función queda como contrato inicial para conectar luego el formulario
 * de creación con el backend.
 *
 * Futuro endpoint esperado:
 * POST /api/incidents
 */
export async function createIncident(incidentData) {
  console.warn(
    "createIncident todavía no persiste datos. Pendiente integración con backend.",
    incidentData
  );

  return {
    id: crypto.randomUUID(),
    ...incidentData,
  };
}

/**
 * Asigna un técnico responsable a un incidente.
 *
 * En la versión actual, la asignación se maneja desde el componente
 * AssignTechnicianForm usando localStorage.
 *
 * Esta función queda preparada para mover esa lógica acá cuando exista API.
 *
 * Futuro endpoint esperado:
 * PATCH /api/incidents/:id/assign
 */
export async function assignTechnicianToIncident(incidentId, technicianData) {
  console.warn(
    "assignTechnicianToIncident todavía no persiste datos. Pendiente integración con backend.",
    {
      incidentId,
      technicianData,
    }
  );

  return {
    incidentId,
    assignedTo: technicianData.name,
    status: "En proceso",
  };
}