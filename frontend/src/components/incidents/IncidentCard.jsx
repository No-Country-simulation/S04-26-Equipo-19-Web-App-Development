import Link from "next/link";

import StatusBadge from "./StatusBadge";
import { formatDate } from "@/utils/formatDate";

/**
 * Card reutilizable para mostrar la información principal de un incidente.
 *
 * Se usa en el listado general y también en el dashboard.
 *
 * Recibe un objeto incident ya preparado por la capa superior.
 * En algunas pantallas, ese objeto puede venir combinado con cambios locales
 * guardados temporalmente en localStorage.
 */
export default function IncidentCard({ incident }) {
  const isClosed = incident.status === "Cerrado";

  const footerLabel = isClosed ? "Resuelto" : "Reportado";

  const footerDate =
    isClosed && incident.resolvedAt ? incident.resolvedAt : incident.createdAt;

  const cardStatusClass = getIncidentCardStatusClass(incident.status);

  return (
    <article
      className={`data-card ${cardStatusClass} p-5 transition hover:border-[var(--brand-accent)]`}
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          {/* ID visible para trazabilidad operativa */}
          <p className="text-sm font-bold text-[var(--brand-secondary)]">
            {incident.id}
          </p>

          <h2 className="mt-1 text-xl font-bold text-[var(--text-primary)]">
            {incident.title}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
            {incident.description}
          </p>
        </div>

        <StatusBadge status={incident.status} />
      </div>

      {/* Datos operativos principales del incidente */}
      <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
        <InfoItem label="Área" value={incident.area} />
        <InfoItem label="Tipo" value={incident.type} />
        <InfoItem label="Prioridad" value={incident.priority} />
        <InfoItem label="Responsable" value={incident.assignedTo} />
      </div>

      {/*
        Si el incidente está cerrado y tiene resolvedAt,
        mostramos fecha de resolución. Si no, mostramos fecha de reporte.
      */}
      <div className="mt-5 border-t border-[var(--border-muted)] pt-4 text-xs font-medium text-[var(--text-muted)]">
        {footerLabel}: {formatDate(footerDate)}
      </div>

      <Link
        href={`/incidents/${incident.id}`}
        aria-label={`Ver detalle del incidente ${incident.id}`}
        className="btn-secondary mt-4 w-fit"
      >
        Ver detalle
      </Link>
    </article>
  );
}

/**
 * Pequeño bloque de metadata dentro de la card.
 */
function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
        {label}
      </p>

      <p className="mt-1 font-bold text-[var(--text-secondary)]">{value}</p>
    </div>
  );
}

/**
 * Traduce el estado del incidente a una variante visual de data-card.
 */
function getIncidentCardStatusClass(status) {
  const statusClassMap = {
    Abierto: "data-card-open",
    "En progreso": "data-card-progress",
    Cerrado: "data-card-resolved",
  };

  return statusClassMap[status] || "data-card-open";
}