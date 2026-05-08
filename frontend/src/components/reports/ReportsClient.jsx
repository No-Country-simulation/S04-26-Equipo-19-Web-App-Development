"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { getAllMergedIncidents, INCIDENT_STATUS } from "@/lib/incidentStorage";

/**
 * Reportes cliente para análisis operativo.
 *
 * Esta capa existe porque los cambios locales de incidentes se guardan
 * temporalmente en localStorage mientras no tenemos backend.
 *
 * Cuando Django esté integrado, estos cálculos podrán venir desde la API
 * o desde endpoints específicos de analítica.
 */
export default function ReportsClient({ initialIncidents }) {
  const [displayedIncidents, setDisplayedIncidents] =
    useState(initialIncidents);

  /**
   * Combina la mock data original con los cambios guardados localmente.
   */
  const syncLocalIncidentState = useCallback(() => {
    const mergedIncidents = getAllMergedIncidents(initialIncidents);

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
        syncLocalIncidentState,
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
        incident.priority === "Alta" || incident.priority === "Crítica",
    ).length;

    const qualityIncidents = displayedIncidents.filter(
      (incident) => incident.type === "Calidad",
    ).length;

    const securityIncidents = displayedIncidents.filter(
      (incident) => incident.type === "Seguridad",
    ).length;

    const closedIncidents = displayedIncidents.filter(
      (incident) => incident.status === INCIDENT_STATUS.CLOSED,
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
        <MetricCard
          label="Alta prioridad"
          value={metrics.highPriorityIncidents}
          helper="Incidentes que requieren atención rápida"
          tone="critical"
        />

        <MetricCard
          label="Calidad"
          value={metrics.qualityIncidents}
          helper="Desvíos asociados al control de calidad"
          tone="progress"
        />

        <MetricCard
          label="Seguridad"
          value={metrics.securityIncidents}
          helper="Eventos relacionados con seguridad operativa"
          tone="neutral"
        />

        <MetricCard
          label="Tasa de cierre"
          value={`${metrics.closureRate}%`}
          helper={`${metrics.closedIncidents} de ${metrics.totalIncidents} incidentes cerrados`}
          tone="resolved"
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

      <section className="panel mt-8 p-6">
        <p className="page-eyebrow">Roadmap analítico</p>

        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          Próximos indicadores
        </h2>

        <div className="mt-4 grid gap-4 text-sm text-[var(--text-muted)] md:grid-cols-2">
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
 * Card compacta para métricas de reportes.
 */
function MetricCard({ label, value, helper, tone = "neutral" }) {
  const toneStyles = {
    neutral:
      "border-[rgba(65,90,119,0.22)] bg-[rgba(65,90,119,0.06)] before:bg-[var(--brand-secondary)]",
    critical:
      "border-[rgba(176,42,55,0.22)] bg-[rgba(176,42,55,0.06)] before:bg-[var(--status-critical)]",
    progress:
      "border-[rgba(232,93,4,0.24)] bg-[rgba(232,93,4,0.07)] before:bg-[var(--status-progress)]",
    resolved:
      "border-[rgba(45,106,79,0.22)] bg-[rgba(45,106,79,0.07)] before:bg-[var(--status-resolved)]",
  };

  return (
    <article
      className={`relative overflow-hidden rounded-[var(--radius-md)] border p-5 shadow-[var(--shadow-card)] before:absolute before:inset-y-0 before:left-0 before:w-1 ${
        toneStyles[tone] || toneStyles.neutral
      }`}
    >
      <p className="text-sm font-medium text-[var(--text-muted)]">{label}</p>

      <p className="mt-4 text-3xl font-black tracking-tight text-[var(--text-primary)]">
        {value}
      </p>

      <p className="mt-3 text-sm leading-5 text-[var(--text-secondary)]">
        {helper}
      </p>
    </article>
  );
}

/**
 * Panel reutilizable para mostrar agrupaciones simples de reportes.
 */
function ReportPanel({ title, description, items }) {
  return (
    <article className="panel p-6">
      <div>
        <h2 className="text-xl font-bold text-[var(--text-primary)]">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
          {description}
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-[var(--radius-sm)] border border-[var(--border-muted)] bg-[var(--surface-soft)] px-4 py-3"
          >
            <span className="text-sm font-bold text-[var(--text-secondary)]">
              {item.label}
            </span>

            <span className="badge badge-open">{item.value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}