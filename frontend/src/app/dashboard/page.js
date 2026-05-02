import Link from "next/link";

import DashboardClient from "@/components/dashboard/DashboardClient";
import { incidents } from "@/data/incidents";

/**
 * Página principal de métricas operativas.
 *
 * Esta pantalla muestra una vista general del estado de los incidentes:
 * total, abiertos, en proceso, cerrados e incidentes recientes.
 *
 * Importante:
 * Esta página sigue siendo Server Component.
 * Las métricas se delegan a DashboardClient porque necesitan leer localStorage
 * para reflejar cambios temporales mientras no existe backend.
 */
export default function DashboardPage() {
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

        {/*
          DashboardClient recibe la mock data base y luego, del lado cliente,
          la combina con los cambios guardados en localStorage.

          Esto permite que el dashboard refleje asignaciones y cierres hechos
          desde la página de detalle sin modificar la mock data original.
        */}
        <DashboardClient initialIncidents={incidents} />
      </section>
    </main>
  );
}