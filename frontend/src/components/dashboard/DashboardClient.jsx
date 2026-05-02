"use client";

import { useCallback, useEffect, useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import IncidentCard from "@/components/incidents/IncidentCard";
import { getMergedIncident, INCIDENT_STATUS } from "@/lib/incidentStorage";

/**
 * Dashboard cliente para métricas operativas.
 *
 * Esta capa existe porque localStorage solo está disponible en el navegador.
 * La página /dashboard puede seguir siendo Server Component, pero las métricas
 * necesitan ejecutarse del lado cliente para reflejar:
 *
 * - asignaciones de técnico,
 * - cambios de estado,
 * - cierres de incidentes,
 * - fechas de resolución.
 *
 * Cuando integremos Django, esta lógica debería simplificarse porque la API
 * ya debería devolver los incidentes actualizados.
 */
export default function DashboardClient({ initialIncidents }) {
  const [displayedIncidents, setDisplayedIncidents] = useState(initialIncidents);

  /**
   * Combina la mock data original con los cambios guardados localmente.
   *
   * No modificamos src/data/incidents.js.
   * Solo generamos una versión actualizada para mostrar en pantalla.
   */
  const syncLocalIncidentState = useCallback(() => {
    const mergedIncidents = initialIncidents.map((incident) =>
      getMergedIncident(incident)
    );

    setDisplayedIncidents(mergedIncidents);
  }, [initialIncidents]);

  /**
   * Sincronizamos el dashboard al montar el componente y cuando ocurren cambios.
   *
   * Escuchamos:
   * - evento custom interno: cuando se asigna/cierra un incidente,
   * - storage: cambios desde otra pestaña,
   * - focus: cuando el usuario vuelve al dashboard.
   */
  useEffect(() => {
    syncLocalIncidentState();

    window.addEventListener("opscore-incident-updated", syncLocalIncidentState);
    window.addEventListener("storage", syncLocalIncidentState);
    window.addEventListener("focus", syncLocalIncidentState);

    return () => {
      window.removeEventListener(
        "opscore-incident-updated",
        syncLocalIncidentState
      );
      window.removeEventListener("storage", syncLocalIncidentState);
      window.removeEventListener("focus", syncLocalIncidentState);
    };
  }, [syncLocalIncidentState]);

  const totalIncidents = displayedIncidents.length;

  const openIncidents = displayedIncidents.filter(
    (incident) => incident.status === INCIDENT_STATUS.OPEN
  ).length;

  const inProgressIncidents = displayedIncidents.filter(
    (incident) => incident.status === INCIDENT_STATUS.IN_PROGRESS
  ).length;

  const closedIncidents = displayedIncidents.filter(
    (incident) => incident.status === INCIDENT_STATUS.CLOSED
  ).length;

  /**
   * Por ahora mostramos los primeros incidentes del mock actualizado.
   * Más adelante, con backend, convendría ordenar por createdAt o updatedAt.
   */
  const latestIncidents = displayedIncidents.slice(0, 2);

  return (
    <>
      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard
          label="Total"
          value={totalIncidents}
          helper="Incidentes cargados"
          tone="cyan"
        />

        <StatCard
          label="Abiertos"
          value={openIncidents}
          helper="Requieren atención"
          tone="red"
        />

        <StatCard
          label="En proceso"
          value={inProgressIncidents}
          helper="Ya asignados"
          tone="amber"
        />

        <StatCard
          label="Cerrados"
          value={closedIncidents}
          helper="Resueltos"
          tone="green"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="text-xl font-semibold">Incidentes recientes</h2>

          <div className="mt-4 grid gap-4">
            {latestIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </div>

        <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Lectura rápida</h2>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            El objetivo del MVP es validar el flujo base: reportar, visualizar
            estado, asignar responsable y dejar trazabilidad.
          </p>

          <div className="mt-5 space-y-3 text-sm text-slate-300">
            <p>• Reporte mobile-first</p>
            <p>• Seguimiento por estado</p>
            <p>• Métricas iniciales sincronizadas localmente</p>
            <p>• Base lista para conectar backend</p>
          </div>
        </aside>
      </section>
    </>
  );
}