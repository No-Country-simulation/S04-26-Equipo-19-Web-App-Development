import IncidentDetailClient from "@/components/incidents/IncidentDetailClient";
import { incidents } from "@/data/incidents";

/**
 * Genera rutas estáticas para los incidentes mockeados.
 *
 * Ejemplo:
 * /incidents/INC-001
 * /incidents/INC-002
 *
 * Los incidentes creados localmente desde /incidents/new no pueden incluirse
 * acá porque viven en localStorage, y localStorage solo existe en el navegador.
 *
 * Por eso la búsqueda final del incidente se realiza en IncidentDetailClient.
 */
export function generateStaticParams() {
  return incidents.map((incident) => ({
    id: incident.id,
  }));
}

/**
 * Página dinámica de detalle.
 *
 * Esta página recibe el id desde la URL y delega la búsqueda/renderizado real
 * a un Client Component para poder soportar incidentes creados localmente.
 */
export default async function IncidentDetailPage({ params }) {
  /**
   * En Next.js 15, params puede tratarse como una promesa.
   * Mantenemos await params para compatibilidad con esta versión.
   */
  const { id } = await params;

  return <IncidentDetailClient incidentId={id} initialIncidents={incidents} />;
}