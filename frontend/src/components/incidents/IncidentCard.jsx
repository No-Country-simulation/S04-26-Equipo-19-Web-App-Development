import Link from "next/link";

import StatusBadge from "./StatusBadge";
import { formatDate } from "@/utils/formatDate";

/**
 * Card reutilizable para mostrar la información principal de un incidente.
 *
 * Se usa en el listado general y puede reutilizarse luego en dashboard
 * u otras vistas resumidas.
 *
 * Recibe un objeto incident ya preparado por la capa superior.
 * En /incidents, ese objeto puede venir combinado con cambios locales
 * guardados temporalmente en localStorage.
 */
export default function IncidentCard({ incident }) {
  const isClosed = incident.status === "Cerrado";

  const footerLabel = isClosed ? "Resuelto" : "Reportado";
  const footerDate = isClosed && incident.resolvedAt
    ? incident.resolvedAt
    : incident.createdAt;

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-cyan-400/20 hover:bg-white/10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          {/* ID visible para trazabilidad operativa */}
          <p className="text-sm font-medium text-slate-500">{incident.id}</p>

          <h2 className="mt-1 text-xl font-semibold text-white">
            {incident.title}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            {incident.description}
          </p>
        </div>

        <StatusBadge status={incident.status} />
      </div>

      {/* Datos operativos principales del incidente */}
      <div className="mt-5 grid gap-4 text-sm md:grid-cols-4">
        <div>
          <p className="text-slate-500">Área</p>
          <p className="mt-1 font-medium text-slate-200">{incident.area}</p>
        </div>

        <div>
          <p className="text-slate-500">Tipo</p>
          <p className="mt-1 font-medium text-slate-200">{incident.type}</p>
        </div>

        <div>
          <p className="text-slate-500">Prioridad</p>
          <p className="mt-1 font-medium text-slate-200">
            {incident.priority}
          </p>
        </div>

        <div>
          <p className="text-slate-500">Responsable</p>
          <p className="mt-1 font-medium text-slate-200">
            {incident.assignedTo}
          </p>
        </div>
      </div>

      {/*
        Si el incidente está cerrado y tiene resolvedAt,
        mostramos fecha de resolución. Si no, mostramos fecha de reporte.
      */}
      <div className="mt-5 border-t border-white/10 pt-4 text-xs text-slate-500">
        {footerLabel}: {formatDate(footerDate)}
      </div>

      <Link
        href={`/incidents/${incident.id}`}
        aria-label={`Ver detalle del incidente ${incident.id}`}
        className="mt-4 inline-flex w-fit rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-400/10 hover:text-cyan-200"
      >
        Ver detalle
      </Link>
    </article>
  );
}