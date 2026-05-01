import { incidents } from "@/data/incidents";

// Página de dashboard.
// Resume el estado general de los incidentes usando datos simulados.

export default function DashboardPage() {
  // Cálculos simples derivados del array de incidentes.
  // Cuando exista backend, estos datos podrían venir directamente desde un endpoint de métricas.
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

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        {/* Encabezado de la página */}
        <header>
          <p className="text-sm font-medium text-cyan-300">Dashboard</p>

          <h1 className="mt-2 text-4xl font-bold">Resumen operativo</h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Vista general de incidentes reportados, estados actuales y
            seguimiento operativo.
          </p>
        </header>

        {/* Cards de métricas principales */}
        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Total de incidentes</p>
            <p className="mt-2 text-3xl font-bold">{totalIncidents}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Abiertos</p>
            <p className="mt-2 text-3xl font-bold">{openIncidents}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">En progreso</p>
            <p className="mt-2 text-3xl font-bold">{inProgressIncidents}</p>
          </article>

          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Cerrados</p>
            <p className="mt-2 text-3xl font-bold">{closedIncidents}</p>
          </article>
        </section>

        {/* Sección futura para gráficos o reportes */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Análisis inicial</h2>

          <p className="mt-2 text-slate-400">
            En esta sección se podrán agregar gráficos por estado, área, tipo de
            incidente y tiempos de resolución.
          </p>
        </section>
      </section>
    </main>
  );
}