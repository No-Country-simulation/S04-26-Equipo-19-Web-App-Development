import StatusBadge from "./StatusBadge";
import { formatDate } from "@/utils/formatDate";

// Card reutilizable para mostrar la información principal de un incidente.
// Se usa en el listado y puede reutilizarse luego en dashboard o vistas detalle.

export default function IncidentCard({ incident }) {
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

      {/* Datos operativos principales */}
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

      {/* Footer con fecha de creación */}
      <div className="mt-5 border-t border-white/10 pt-4 text-xs text-slate-500">
        Reportado: {formatDate(incident.createdAt)}
      </div>
    </article>
  );
}