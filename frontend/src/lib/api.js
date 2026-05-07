import { incidents } from "@/data/incidents";

const INCIDENTS_ENDPOINT = "/api/incidents";

/**
 * Capa temporal de acceso a datos.
 *
 * Actualmente algunas lecturas todavía usan mock data local.
 * Las operaciones de escritura pasan por una ruta API interna para poder
 * detectar errores reales de red, servidor u offline antes de confirmar éxito.
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
 * Crea un nuevo incidente usando una petición HTTP real.
 *
 * Esto permite que el frontend detecte correctamente errores de red,
 * modo offline o fallos del servidor antes de mostrar éxito al usuario.
 *
 * Futuro endpoint esperado:
 * POST /api/incidents
 */
export async function createIncident(incidentData) {
  try {
    const response = await fetch(INCIDENTS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(incidentData),
      cache: "no-store",
    });

    const responseData = await safelyReadJson(response);

    if (!response.ok) {
      throw new Error(
        responseData?.message ||
          "No se pudo registrar el incidente. Intentá nuevamente."
      );
    }

    return responseData.incident;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Error de conexión. No se pudo registrar el incidente. Revisá tu conexión e intentá nuevamente."
      );
    }

    throw error;
  }
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

/**
 * Lee JSON de una respuesta HTTP sin romper si el body viene vacío.
 */
async function safelyReadJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}