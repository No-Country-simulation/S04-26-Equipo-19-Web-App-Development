"use client";

import { useCallback, useEffect, useState } from "react";

import IncidentCard from "@/components/incidents/IncidentCard";
import { getAllMergedIncidents, INCIDENT_STATUS } from "@/lib/incidentStorage";

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
  const [displayedIncidents, setDisplayedIncidents] =
    useState(initialIncidents);

  /**
   * Combina la mock data original con los cambios guardados localmente.
   *
   * No modificamos src/data/incidents.js.
   * Solo generamos una versión actualizada para mostrar en pantalla.
   */
  const syncLocalIncidentState = useCallback(() => {
    const mergedIncidents = getAllMergedIncidents(initialIncidents);

    setDisplayedIncidents(mergedIncidents);
  }, [initialIncidents]);

  /**
   * Sincronizamos el dashboard al montar el componente y cuando ocurren cambios.
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

  const totalIncidents = displayedIncidents.length;

  const openIncidents = displayedIncidents.filter(
    (incident) => incident.status === INCIDENT_STATUS.OPEN,
  ).length;

  const inProgressIncidents = displayedIncidents.filter(
    (incident) => incident.status === INCIDENT_STATUS.IN_PROGRESS,
  ).length;

  const closedIncidents = displayedIncidents.filter(
    (incident) => incident.status === INCIDENT_STATUS.CLOSED,
  ).length;

  /**
   * Por ahora mostramos los primeros incidentes del mock actualizado.
   * Más adelante, con backend, convendría ordenar por createdAt o updatedAt.
   */
  const latestIncidents = displayedIncidents.slice(0, 2);

  return (
    <>
      <section className="mt-8 grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Total"
          value={totalIncidents}
          helper="Incidentes cargados"
          tone="neutral"
        />

        <MetricCard
          label="Abiertos"
          value={openIncidents}
          helper="Requieren atención"
          tone="critical"
        />

        <MetricCard
          label="En proceso"
          value={inProgressIncidents}
          helper="Ya asignados"
          tone="progress"
        />

        <MetricCard
          label="Cerrados"
          value={closedIncidents}
          helper="Resueltos"
          tone="resolved"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Incidentes recientes
          </h2>

          <div className="mt-4 grid gap-4">
            {latestIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} />
            ))}
          </div>
        </div>

        <aside className="panel p-6">
          <p className="page-eyebrow">Lectura rápida</p>

          <h2 className="text-xl font-bold text-[var(--text-primary)]">
            Estado del MVP
          </h2>

          <p className="mt-3 text-sm leading-6 text-[var(--text-muted)]">
            El objetivo del MVP es validar el flujo base: reportar, visualizar
            estado, asignar responsable y dejar trazabilidad.
          </p>

          <div className="mt-5 grid gap-3 text-sm text-[var(--text-secondary)]">
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

/**
 * Card compacta para métricas del dashboard.
 *
 * Evitamos depender de colores hardcodeados de Tailwind para mantener
 * la paleta centralizada en globals.css.
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

      <p className="mt-3 text-sm text-[var(--text-secondary)]">{helper}</p>
    </article>
  );
}