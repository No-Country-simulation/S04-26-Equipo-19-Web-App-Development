import Link from "next/link";
import IncidentCard from "@/components/incidents/IncidentCard";
import { incidents } from "@/data/incidents";

// Página de listado de incidentes.
// Muestra reportes, estados, prioridades y responsables.

export default function IncidentsPage() {
  return (
    <main className="px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-300">Incidentes</p>

            <h1 className="mt-2 text-4xl font-bold">
              Listado de incidentes
            </h1>

            <p className="mt-2 max-w-2xl text-slate-400">
              Seguimiento de reportes, responsables, prioridades y estados
              dentro de la operación.
            </p>
          </div>

          <Link
            href="/incidents/new"
            className="w-fit rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Nuevo incidente
          </Link>
        </header>

        <section className="mt-8 grid gap-4">
          {incidents.map((incident) => (
            <IncidentCard key={incident.id} incident={incident} />
          ))}
        </section>
      </section>
    </main>
  );
}