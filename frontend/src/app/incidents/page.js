import Link from "next/link";

import IncidentListClient from "@/components/incidents/IncidentListClient";
import { incidents } from "@/data/incidents";

/**
 * Página de listado de incidentes.
 *
 * Mantiene la estructura principal como Server Component y delega el listado
 * a un Client Component para poder sincronizar incidentes mock + localStorage.
 */
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

        <IncidentListClient initialIncidents={incidents} />
      </div>
    </section>
  );
}