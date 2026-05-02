import ReportsClient from "@/components/reports/ReportsClient";
import { incidents } from "@/data/incidents";

/**
 * Página inicial de reportes.
 *
 * Esta pantalla apunta a mostrar análisis operativo:
 * prioridades, tipos de incidentes, áreas afectadas y tasa de cierre.
 *
 * Importante:
 * La página sigue siendo Server Component.
 * La lógica que necesita localStorage vive en ReportsClient porque localStorage
 * solo existe en el navegador.
 */
export default function ReportsPage() {
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

        {/*
          ReportsClient recibe la mock data base y luego, del lado cliente,
          la combina con los cambios guardados en localStorage.

          Esto permite que los reportes reflejen asignaciones y cierres hechos
          desde la página de detalle sin modificar la mock data original.
        */}
        <ReportsClient initialIncidents={incidents} />
      </section>
    </main>
  );
}