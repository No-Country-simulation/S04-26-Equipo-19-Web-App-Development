"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import AssignTechnicianForm from "@/components/incidents/AssignTechnicianForm";
import CloseIncidentForm from "@/components/incidents/CloseIncidentForm";
import StatusBadge from "@/components/incidents/StatusBadge";
import { getAllMergedIncidents } from "@/lib/incidentStorage";
import { formatDate } from "@/utils/formatDate";

/**
 * Detalle cliente de un incidente.
 *
 * Este componente existe porque los incidentes creados localmente viven en
 * localStorage, y localStorage solo está disponible en el navegador.
 *
 * La página dinámica /incidents/[id] puede recibir el id desde el servidor,
 * pero la búsqueda completa del incidente debe hacerse del lado cliente para
 * soportar tanto:
 *
 * - incidentes mockeados desde src/data/incidents.js,
 * - incidentes creados localmente desde /incidents/new,
 * - cambios locales de asignación, estado y resolución.
 *
 * Cuando exista backend, esta lógica debería reemplazarse por:
 * GET /api/incidents/:id
 */
export default function IncidentDetailClient({ incidentId, initialIncidents }) {
  const [incident, setIncident] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  /**
   * Busca el incidente combinando:
   * - mock data base,
   * - incidentes creados localmente,
   * - cambios guardados en localStorage.
   */
  const syncIncidentState = useCallback(() => {
    const mergedIncidents = getAllMergedIncidents(initialIncidents);
    const selectedIncident = mergedIncidents.find(
      (item) => item.id === incidentId,
    );

    setIncident(selectedIncident || null);
    setHasLoaded(true);
  }, [incidentId, initialIncidents]);

  /**
   * Sincronizamos al montar el componente y cuando cambian los datos locales.
   *
   * Escuchamos:
   * - evento interno cuando se crea/asigna/cierra un incidente,
   * - cambios de localStorage desde otra pestaña,
   * - foco de ventana al volver al detalle.
   */
  useEffect(() => {
    syncIncidentState();

    window.addEventListener("opscore-incident-updated", syncIncidentState);
    window.addEventListener("storage", syncIncidentState);
    window.addEventListener("focus", syncIncidentState);

    return () => {
      window.removeEventListener("opscore-incident-updated", syncIncidentState);
      window.removeEventListener("storage", syncIncidentState);
      window.removeEventListener("focus", syncIncidentState);
    };
  }, [syncIncidentState]);

  if (!hasLoaded) {
    return (
      <section className="page-container">
        <p className="text-[var(--text-muted)]">Cargando incidente...</p>
      </section>
    );
  }

  if (!incident) {
    return (
      <section className="page-container space-y-6">
        <Link href="/incidents" className="btn-secondary w-fit">
          ← Volver a incidentes
        </Link>

        <article className="rounded-[var(--radius-md)] border border-[rgba(176,42,55,0.3)] bg-[rgba(176,42,55,0.08)] p-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Incidente no encontrado
          </h1>

          <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
            No existe un incidente con el identificador solicitado. Puede haber
            sido eliminado del almacenamiento local o no estar disponible en la
            mock data.
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="page-container space-y-8">
      <Link href="/incidents" className="btn-secondary w-fit">
        ← Volver a incidentes
      </Link>

      <article className="panel p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="page-eyebrow">Detalle del incidente</p>

            <h1 className="page-title">{incident.title}</h1>

            <p className="page-description">{incident.description}</p>

            {incident.isLocalOnly ? (
              <p className="mt-4 inline-flex rounded-[var(--radius-xs)] border border-[rgba(65,90,119,0.28)] bg-[rgba(65,90,119,0.1)] px-3 py-1 text-sm font-bold text-[#263d5c]">
                Incidente creado localmente
              </p>
            ) : null}
          </div>

          <div className="shrink-0">
            <StatusBadge status={incident.status} />
          </div>
        </div>

        <div className="mt-8 grid gap-4 border-t border-[var(--border-muted)] pt-6 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="ID" value={incident.id} />
          <DetailItem label="Tipo" value={incident.type} />
          <DetailItem label="Área" value={incident.area} />
          <DetailItem label="Prioridad" value={incident.priority} />
          <DetailItem label="Estado actual" value={incident.status} />
          <DetailItem label="Reportado por" value={incident.reportedBy} />
          <DetailItem label="Responsable actual" value={incident.assignedTo} />

          {incident.shift ? (
            <DetailItem label="Turno" value={incident.shift} />
          ) : null}

          {incident.location ? (
            <DetailItem label="Ubicación" value={incident.location} />
          ) : null}

          <DetailItem
            label="Fecha de creación"
            value={formatDate(incident.createdAt)}
          />

          <DetailItem
            label="Fecha de resolución"
            value={
              incident.resolvedAt ? formatDate(incident.resolvedAt) : "Pendiente"
            }
          />
        </div>

        {incident.status === "Cerrado" ? (
          <div className="mt-8 rounded-[var(--radius-md)] border border-[rgba(45,106,79,0.28)] bg-[rgba(45,106,79,0.08)] p-5">
            <p className="font-bold text-[var(--status-resolved)]">
              Resolución
            </p>

            <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
              {incident.resolutionNote ||
                "Incidente cerrado. La nota de resolución no está disponible."}
            </p>
          </div>
        ) : null}
      </article>

      <AssignTechnicianForm
        incidentId={incident.id}
        currentAssignedTo={incident.assignedTo}
        currentStatus={incident.status}
      />

      <CloseIncidentForm
        incidentId={incident.id}
        currentStatus={incident.status}
        currentResolvedAt={incident.resolvedAt}
      />
    </section>
  );
}

/**
 * Componente auxiliar para mostrar pares label/value.
 *
 * Lo mantenemos dentro del archivo porque solo se usa en esta pantalla.
 * Si se reutiliza en otras vistas, conviene moverlo a:
 * src/components/ui/DetailItem.jsx
 */
function DetailItem({ label, value }) {
  return (
    <div className="rounded-[var(--radius-md)] border border-[var(--border-muted)] bg-[var(--surface-soft)] p-5 transition hover:border-[var(--brand-accent)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-3 font-bold leading-6 text-[var(--text-primary)]">
        {value || "Sin información"}
      </p>
    </div>
  );
}