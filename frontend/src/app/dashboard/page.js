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
    <main className="app-page">
      <section className="page-container">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-eyebrow">Dashboard</p>

            <h1 className="page-title">Resumen operativo</h1>

            <p className="page-description">
              Vista general de incidentes reportados, estados actuales y
              seguimiento operativo del MVP.
            </p>
          </div>

          <Link
  href="/incidents/new"
  className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-base font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-200"
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