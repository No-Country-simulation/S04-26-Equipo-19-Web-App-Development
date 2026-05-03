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
    <main className="app-page">
      <section className="page-container">
        <header>
          <p className="page-eyebrow">Reportes</p>

          <h1 className="page-title">Análisis operativo</h1>

          <p className="page-description">
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