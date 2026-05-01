import StatCard from "@/components/dashboard/StatCard";
import { incidents } from "@/data/incidents";

// Página inicial de reportes.
// Por ahora usa mock data, pero deja preparada la estructura para análisis real.

export default function ReportsPage() {
  const highPriorityIncidents = incidents.filter(
    (incident) => incident.priority === "Alta" || incident.priority === "Crítica"
  ).length;

  const qualityIncidents = incidents.filter(
    (incident) => incident.type === "Calidad"
  ).length;

  const securityIncidents = incidents.filter(
    (incident) => incident.type === "Seguridad"
  ).length;

  return (
    <main className="px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <header>
          <p className="text-sm font-medium text-cyan-300">Reportes</p>

          <h1 className="mt-2 text-4xl font-bold">Análisis operativo</h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Primer panel para detectar patrones, prioridades y áreas críticas
            dentro de los incidentes registrados.
          </p>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <StatCard
            label="Alta prioridad"
            value={highPriorityIncidents}
            helper="Incidentes que requieren atención rápida"
            tone="red"
          />

          <StatCard
            label="Calidad"
            value={qualityIncidents}
            helper="Desvíos asociados al control de calidad"
            tone="amber"
          />

          <StatCard
            label="Seguridad"
            value={securityIncidents}
            helper="Eventos relacionados con seguridad operativa"
            tone="cyan"
          />
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-semibold">Próximos indicadores</h2>

          <div className="mt-4 grid gap-4 text-sm text-slate-400 md:grid-cols-2">
            <p>• Tiempo promedio de resolución por área.</p>
            <p>• Cantidad de incidentes por tipo.</p>
            <p>• Causas raíz más frecuentes.</p>
            <p>• Tasa de cierre semanal o mensual.</p>
          </div>
        </section>
      </section>
    </main>
  );
}