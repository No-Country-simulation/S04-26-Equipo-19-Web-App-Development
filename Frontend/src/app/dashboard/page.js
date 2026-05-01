import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import IncidentCard from "@/components/incidents/IncidentCard";
import { incidents } from "@/data/incidents";

// Página principal de métricas operativas.
// Usa mock data hasta que el backend exponga endpoints reales.

export default function DashboardPage() {
  const totalIncidents = incidents.length;

  const openIncidents = incidents.filter(
    (incident) => incident.status === "Abierto"
  ).length;

  const inProgressIncidents = incidents.filter(
    (incident) => incident.status === "En progreso"
  ).length;

  const closedIncidents = incidents.filter(
    (incident) => incident.status === "Cerrado"
  ).length;

  const latestIncidents = incidents.slice(0, 2);

  return (
    <main className="px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-300">Dashboard</p>

            <h1 className="mt-2 text-4xl font-bold">Resumen operativo</h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Vista general de incidentes reportados, estados actuales y
              seguimiento operativo del MVP.
            </p>
          </div>

          <Link
            href="/incidents/new"
            className="w-fit rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Nuevo incidente
          </Link>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total"
            value={totalIncidents}
            helper="Incidentes cargados"
            tone="cyan"
          />

          <StatCard
            label="Abiertos"
            value={openIncidents}
            helper="Requieren atención"
            tone="red"
          />

          <StatCard
            label="En progreso"
            value={inProgressIncidents}
            helper="Ya asignados"
            tone="amber"
          />

          <StatCard
            label="Cerrados"
            value={closedIncidents}
            helper="Resueltos"
            tone="green"
          />
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h2 className="text-xl font-semibold">Incidentes recientes</h2>

            <div className="mt-4 grid gap-4">
              {latestIncidents.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-semibold">Lectura rápida</h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              El objetivo del MVP es validar el flujo base: reportar, visualizar
              estado, asignar responsable y dejar trazabilidad.
            </p>

            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>• Reporte mobile-first</p>
              <p>• Seguimiento por estado</p>
              <p>• Métricas iniciales</p>
              <p>• Base lista para conectar backend</p>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}