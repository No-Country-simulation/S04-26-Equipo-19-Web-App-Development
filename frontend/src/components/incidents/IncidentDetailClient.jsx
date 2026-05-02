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
      (item) => item.id === incidentId
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
      <section className="mx-auto w-full max-w-7xl px-6 py-8 text-white lg:px-10 lg:py-10">
        <p className="text-sm text-slate-400">Cargando incidente...</p>
      </section>
    );
  }

  if (!incident) {
    return (
      <section className="mx-auto w-full max-w-7xl space-y-6 px-6 py-8 text-white lg:px-10 lg:py-10">
        <Link
          href="/incidents"
          className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
        >
          ← Volver a incidentes
        </Link>

        <article className="rounded-[2rem] border border-red-400/20 bg-red-400/10 p-6">
          <h1 className="text-2xl font-bold text-white">
            Incidente no encontrado
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            No existe un incidente con el identificador solicitado. Puede haber
            sido eliminado del almacenamiento local o no estar disponible en la
            mock data.
          </p>
        </article>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-6 py-8 lg:px-10 lg:py-10">
      <Link
        href="/incidents"
        className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
      >
        ← Volver a incidentes
      </Link>

      <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 md:p-8 lg:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Detalle del incidente
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              {incident.title}
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-400">
              {incident.description}
            </p>

            {incident.isLocalOnly ? (
              <p className="mt-4 inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                Incidente creado localmente
              </p>
            ) : null}
          </div>

          <div className="shrink-0">
            <StatusBadge status={incident.status} />
          </div>
        </div>

        <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 md:grid-cols-2 xl:grid-cols-3">
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

        {incident.status === "Cerrado" && (
          <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm font-semibold text-emerald-300">
              Resolución
            </p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              {incident.resolutionNote ||
                "Incidente cerrado. La nota de resolución no está disponible."}
            </p>
          </div>
        )}
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
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/20 hover:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-sm font-semibold leading-6 text-white">
        {value || "Sin información"}
      </p>
    </div>
  );
}