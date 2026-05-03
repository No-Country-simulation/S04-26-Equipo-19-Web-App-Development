import Link from "next/link";

import IncidentListClient from "@/components/incidents/IncidentListClient";
import { incidents } from "@/data/incidents";

/**
 * Página de listado de incidentes.
 *
 * Esta pantalla muestra el estado general de los reportes operativos:
 * responsables, prioridades, estados y acceso al detalle.
 *
 * Importante:
 * La página sigue siendo Server Component.
 * El listado se delega a IncidentListClient porque necesita leer localStorage
 * para reflejar cambios temporales mientras no existe backend.
 */
export default function IncidentsPage() {
  return (
    <main className="app-page">
      <section className="page-container">
        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-eyebrow">Incidentes</p>

            <h1 className="page-title">Listado de incidentes</h1>

            <p className="page-description">
              Seguimiento de reportes, responsables, prioridades y estados
              dentro de la operación.
            </p>
          </div>

          <Link href="/incidents/new" className="btn-warning w-fit">
            Nuevo incidente
          </Link>
        </header>

        {/*
          El listado recibe la mock data base y luego, del lado cliente,
          la combina con los cambios guardados en localStorage.

          Esto permite que /incidents refleje asignaciones y cierres hechos
          desde la página de detalle sin tocar la data mock original.
        */}
        <IncidentListClient initialIncidents={incidents} />
      </section>
    </main>
  );
}