import Link from "next/link";
import { incidents } from "@/data/incidents";

/**
 * Home / Landing operativa de OpsCore.
 *
 * Objetivo:
 * - Presentar el propósito del sistema.
 * - Mostrar métricas rápidas.
 * - Dar prioridad visual a la acción principal: reportar un incidente.
 * - Usar colores con criterio: naranja para acción, estados solo para semántica.
 */

const STATUS = {
  OPEN: "Abierto",
  IN_PROGRESS: "En proceso",
  CLOSED: "Cerrado",
};

function countIncidentsByStatus(status) {
  return incidents.filter((incident) => incident.status === status).length;
}

function getTime(dateValue) {
  const date = new Date(dateValue);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function formatDate(dateValue) {
  if (!dateValue) return "Sin fecha";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "Sin fecha";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

const summaryCards = [
  {
    label: "Incidentes abiertos",
    value: countIncidentsByStatus(STATUS.OPEN),
    description: "Casos pendientes de revisión o asignación.",
  },
  {
    label: "En proceso",
    value: countIncidentsByStatus(STATUS.IN_PROGRESS),
    description: "Incidentes asignados y actualmente en seguimiento.",
  },
  {
    label: "Resueltos",
    value: countIncidentsByStatus(STATUS.CLOSED),
    description: "Casos cerrados dentro del flujo operativo.",
  },
];

const statusStyles = {
  [STATUS.OPEN]: "border-red-200 bg-red-50 text-red-800",
  [STATUS.IN_PROGRESS]: "border-amber-200 bg-amber-50 text-amber-900",
  [STATUS.CLOSED]: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

const latestIncidents = [...incidents]
  .sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt))
  .slice(0, 5);

export default function HomePage() {
  return (
    <section className="min-h-full bg-slate-50 px-5 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Hero principal */}
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.35fr_0.65fr] lg:p-12">
            <div className="max-w-4xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-black text-slate-700">
                <span className="h-2 w-2 rounded-full bg-emerald-700" />
                OpsCore · Incident Management
              </span>

              <h1 className="mt-8 max-w-5xl text-4xl font-black leading-[1.02] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl xl:text-7xl">
                Gestión inteligente de incidentes operativos.
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
                Reportá fallas, asigná responsables, seguí estados y analizá
                causas recurrentes desde una plataforma simple, trazable y
                pensada para entornos industriales.
              </p>

              {/* CTAs: una acción principal y una secundaria */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/incidents/new"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
                >
                  Reportar incidente
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-3 text-base font-black text-slate-900 transition hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100 focus:outline-none focus:ring-4 focus:ring-slate-200"
                >
                  Ver dashboard
                </Link>
              </div>
            </div>

            {/* Panel lateral informativo con contraste reforzado */}
            <aside className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-700">
                Estado del MVP
              </p>

              <div className="mt-5 rounded-2xl border border-emerald-400 bg-emerald-50 p-4">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full bg-emerald-700" />
                  <p className="font-black text-slate-950">
                    Sprint operativo activo
                  </p>
                </div>

                <p className="mt-3 text-sm font-semibold leading-6 text-slate-800">
                  Flujo visual preparado para demo, navegación interna,
                  registro de incidentes y seguimiento inicial.
                </p>
              </div>

              <div className="mt-5 space-y-3 text-sm leading-6 text-slate-700">
                <p>
                  <strong className="text-slate-950">Enfoque:</strong>{" "}
                  usabilidad, trazabilidad y lectura rápida.
                </p>

                <p>
                  <strong className="text-slate-950">Objetivo:</strong>{" "}
                  reducir pérdida de información operativa.
                </p>
              </div>
            </aside>
          </div>
        </section>

        {/* Métricas rápidas */}
        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {summaryCards.map((card) => (
            <article
              key={card.label}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-black uppercase tracking-[0.16em] text-slate-500">
                {card.label}
              </p>

              <p className="mt-4 text-5xl font-black tracking-tight text-slate-950">
                {card.value}
              </p>

              <p className="mt-3 text-base leading-7 text-slate-600">
                {card.description}
              </p>
            </article>
          ))}
        </section>

        {/* Actividad reciente */}
        <section className="mt-6 rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">
                Actividad reciente
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                Últimos incidentes reportados
              </h2>
            </div>

            <Link
              href="/incidents"
              className="text-sm font-black text-slate-700 transition hover:text-slate-950"
            >
              Ver todos →
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
            <div className="hidden grid-cols-[1fr_1fr_140px_120px] gap-4 bg-slate-50 px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-slate-500 md:grid">
              <span>Incidente</span>
              <span>Área / responsable</span>
              <span>Estado</span>
              <span>Fecha</span>
            </div>

            <div className="divide-y divide-slate-200">
              {latestIncidents.map((incident) => (
                <Link
                  key={incident.id}
                  href={`/incidents/${incident.id}`}
                  className="grid gap-3 px-5 py-4 transition hover:bg-slate-50 md:grid-cols-[1fr_1fr_140px_120px] md:items-center md:gap-4"
                >
                  <div>
                    <p className="font-black text-slate-950">
                      {incident.title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {incident.id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {incident.area}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {incident.assignedTo || "Sin asignar"}
                    </p>
                  </div>

                  <div>
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-black ${
                        statusStyles[incident.status] ||
                        "border-slate-200 bg-slate-100 text-slate-700"
                      }`}
                    >
                      {incident.status}
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-600">
                    {formatDate(incident.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}