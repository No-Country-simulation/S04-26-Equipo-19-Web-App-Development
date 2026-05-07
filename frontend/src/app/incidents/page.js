import Link from "next/link";
import { incidents } from "@/data/incidents";

/**
 * Listado de incidentes.
 *
 * Objetivo:
 * - Mostrar incidentes de forma clara y escaneable.
 * - Mantener etiquetas y valores cerca para mejorar lectura.
 * - Usar colores semánticos solo para estados/prioridades.
 */

const statusStyles = {
  Abierto: "border-red-200 bg-red-50 text-red-800",
  "En proceso": "border-amber-200 bg-amber-50 text-amber-900",
  Cerrado: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

const priorityStyles = {
  Baja: "border-slate-200 bg-slate-100 text-slate-700",
  Media: "border-blue-200 bg-blue-50 text-blue-800",
  Alta: "border-amber-200 bg-amber-50 text-amber-900",
  Crítica: "border-red-200 bg-red-50 text-red-800",
};

function formatDate(dateValue) {
  if (!dateValue) return "Sin fecha";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function IncidentsPage() {
  return (
    <section className="min-h-full bg-slate-50 px-5 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
              Gestión operativa
            </p>

            <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
              Incidentes
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
              Seguimiento de fallas, prioridades, responsables y estados dentro
              del flujo operativo.
            </p>
          </div>

          <Link
            href="/incidents/new"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
          >
            Nuevo incidente
          </Link>
        </header>

        <div className="grid gap-4">
          {incidents.map((incident) => (
            <article
              key={incident.id}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">
                      {incident.id}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-black ${
                        statusStyles[incident.status] ||
                        "border-slate-200 bg-slate-100 text-slate-700"
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950">
                    {incident.title}
                  </h2>

                  <p className="mt-2 max-w-3xl text-base leading-7 text-slate-600">
                    {incident.description}
                  </p>
                </div>

                <Link
                  href={`/incidents/${incident.id}`}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-black text-slate-900 transition hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  Ver detalle
                </Link>
              </div>

              <div className="mt-5 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 xl:grid-cols-[0.85fr_0.85fr_0.75fr_1fr]">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Área
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {incident.area}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Tipo
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {incident.type}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Prioridad
                  </p>

                  <span
                    className={`mt-1 inline-flex rounded-full border px-3 py-1 text-xs font-black ${
                      priorityStyles[incident.priority] ||
                      "border-slate-200 bg-slate-100 text-slate-700"
                    }`}
                  >
                    {incident.priority}
                  </span>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">
                    Responsable
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-900">
                    {incident.assignedTo || "Sin asignar"}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-500">
                Reportado el {formatDate(incident.createdAt)}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
