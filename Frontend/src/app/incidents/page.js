import Link from "next/link";
import { incidents } from "@/data/incidents";

// Página de listado de incidentes.
// Permite visualizar reportes, estados, prioridades y responsables.

export default function IncidentsPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-6xl">
        {/* Header de la página con acción principal */}
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

        {/* Lista de incidentes */}
        <section className="mt-8 grid gap-4">
          {incidents.map((incident) => (
            <article
              key={incident.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  {/* ID visible para facilitar trazabilidad */}
                  <p className="text-sm text-slate-400">{incident.id}</p>

                  <h2 className="mt-1 text-xl font-semibold">
                    {incident.title}
                  </h2>

                  <p className="mt-2 max-w-3xl text-slate-400">
                    {incident.description}
                  </p>
                </div>

                {/* Badge simple de estado */}
                <span className="w-fit rounded-full bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-300">
                  {incident.status}
                </span>
              </div>

              {/* Datos operativos principales */}
              <div className="mt-4 grid gap-3 text-sm text-slate-300 md:grid-cols-4">
                <p>
                  <span className="text-slate-500">Área:</span>{" "}
                  {incident.area}
                </p>

                <p>
                  <span className="text-slate-500">Tipo:</span>{" "}
                  {incident.type}
                </p>

                <p>
                  <span className="text-slate-500">Prioridad:</span>{" "}
                  {incident.priority}
                </p>

                <p>
                  <span className="text-slate-500">Responsable:</span>{" "}
                  {incident.assignedTo}
                </p>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}