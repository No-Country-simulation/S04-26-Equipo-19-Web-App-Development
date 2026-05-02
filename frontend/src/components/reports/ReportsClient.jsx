"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import StatCard from "@/components/dashboard/StatCard";
import { getMergedIncident, INCIDENT_STATUS } from "@/lib/incidentStorage";

/**
 * Reportes cliente para análisis operativo.
 *
 * Esta capa existe porque los cambios locales de incidentes se guardan
 * temporalmente en localStorage mientras no tenemos backend.
 *
 * La página /reports puede seguir siendo Server Component, pero los cálculos
 * de reportes necesitan ejecutarse en el navegador para reflejar:
 *
 * - asignaciones,
 * - cambios de estado,
 * - cierres,
 * - fechas de resolución.
 *
 * Cuando Django esté integrado, estos cálculos podrán venir desde la API
 * o desde endpoints específicos de analítica.
 */
export default function ReportsClient({ initialIncidents }) {
  const [displayedIncidents, setDisplayedIncidents] = useState(initialIncidents);

  /**
   * Combina la mock data original con los cambios guardados localmente.
   *
   * No modificamos src/data/incidents.js.
   * Solo generamos una versión actualizada para reportes.
   */
  const syncLocalIncidentState = useCallback(() => {
    const mergedIncidents = initialIncidents.map((incident) =>
      getMergedIncident(incident)
    );

    setDisplayedIncidents(mergedIncidents);
  }, [initialIncidents]);

  /**
   * Sincroniza los reportes al cargar la pantalla y cuando hay cambios.
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

  /**
   * Calculamos métricas derivadas desde la lista ya sincronizada.
   */
  const metrics = useMemo(() => {
    const totalIncidents = displayedIncidents.length;

    const highPriorityIncidents = displayedIncidents.filter(
      (incident) =>
        incident.priority === "Alta" || incident.priority === "Crítica"
    ).length;

    const qualityIncidents = displayedIncidents.filter(
      (incident) => incident.type === "Calidad"
    ).length;

    const securityIncidents = displayedIncidents.filter(
      (incident) => incident.type === "Seguridad"
    ).length;

    const closedIncidents = displayedIncidents.filter(
      (incident) => incident.status === INCIDENT_STATUS.CLOSED
    ).length;

    const closureRate =
      totalIncidents > 0
        ? Math.round((closedIncidents / totalIncidents) * 100)
        : 0;

    return {
      totalIncidents,
      highPriorityIncidents,
      qualityIncidents,
      securityIncidents,
      closedIncidents,
      closureRate,
    };
  }, [displayedIncidents]);

  const incidentsByArea = useMemo(() => {
    return countByField(displayedIncidents, "area");
  }, [displayedIncidents]);

  const incidentsByType = useMemo(() => {
    return countByField(displayedIncidents, "type");
  }, [displayedIncidents]);

  return (
    <>
      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <StatCard
          label="Alta prioridad"
          value={metrics.highPriorityIncidents}
          helper="Incidentes que requieren atención rápida"
          tone="red"
        />

        <StatCard
          label="Calidad"
          value={metrics.qualityIncidents}
          helper="Desvíos asociados al control de calidad"
          tone="amber"
        />

        <StatCard
          label="Seguridad"
          value={metrics.securityIncidents}
          helper="Eventos relacionados con seguridad operativa"
          tone="cyan"
        />

        <StatCard
          label="Tasa de cierre"
          value={`${metrics.closureRate}%`}
          helper={`${metrics.closedIncidents} de ${metrics.totalIncidents} incidentes cerrados`}
          tone="green"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <ReportPanel
          title="Incidentes por área"
          description="Permite detectar sectores con mayor concentración de reportes."
          items={incidentsByArea}
        />

        <ReportPanel
          title="Incidentes por tipo"
          description="Ayuda a identificar patrones operativos y posibles causas recurrentes."
          items={incidentsByType}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Próximos indicadores</h2>

        <div className="mt-4 grid gap-4 text-sm text-slate-400 md:grid-cols-2">
          <p>• Tiempo promedio de resolución por área.</p>
          <p>• Causas raíz más frecuentes.</p>
          <p>• Tasa de cierre semanal o mensual.</p>
          <p>• Comparativa entre incidentes abiertos y cerrados.</p>
        </div>
      </section>
    </>
  );
}

/**
 * Cuenta cuántos incidentes existen por un campo determinado.
 */
function countByField(incidents, fieldName) {
  const groupedValues = incidents.reduce((accumulator, incident) => {
    const fieldValue = incident[fieldName] || "Sin información";

    accumulator[fieldValue] = (accumulator[fieldValue] || 0) + 1;

    return accumulator;
  }, {});

  return Object.entries(groupedValues).map(([label, value]) => ({
    label,
    value,
  }));
}

/**
 * Panel reutilizable para mostrar agrupaciones simples de reportes.
 */
function ReportPanel({ title, description, items }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {description}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3"
          >
            <span className="text-sm font-medium text-slate-300">
              {item.label}
            </span>

            <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-bold text-cyan-300">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}