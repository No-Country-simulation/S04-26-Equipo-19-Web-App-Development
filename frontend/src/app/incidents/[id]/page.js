import Link from "next/link";
import { notFound } from "next/navigation";
import { incidents } from "@/data/incidents";
import StatusBadge from "@/components/incidents/StatusBadge";
import { formatDate } from "@/utils/formatDate";

export function generateStaticParams() {
  return incidents.map((incident) => ({
    id: incident.id,
  }));
}

export default async function IncidentDetailPage({ params }) {
  const { id } = await params;

  const incident = incidents.find((item) => item.id === id);

  if (!incident) {
    notFound();
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
        <DetailItem label="Estado" value={incident.status} />
        <DetailItem label="Reportado por" value={incident.reportedBy} />
        <DetailItem label="Responsable" value={incident.assignedTo} />
        <DetailItem
          label="Fecha de creación"
          value={formatDate(incident.createdAt)}
        />
        <DetailItem
          label="Fecha de resolución"
          value={incident.resolvedAt ? formatDate(incident.resolvedAt) : "Pendiente"}
        />
      </div>

      {incident.status === "Cerrado" && (
        <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
          <p className="text-sm font-semibold text-emerald-300">
            Resolución
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Incidente cerrado. La nota de resolución se agregará cuando esté disponible en el flujo de cierre.
          </p>
        </div>
      )}
    </article>
  </section>
);
}

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