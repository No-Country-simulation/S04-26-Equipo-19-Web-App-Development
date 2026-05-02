import Link from "next/link";
import { notFound } from "next/navigation";
import CloseIncidentForm from "@/components/incidents/CloseIncidentForm";
import { incidents } from "@/data/incidents";
import StatusBadge from "@/components/incidents/StatusBadge";
import AssignTechnicianForm from "@/components/incidents/AssignTechnicianForm";
import { formatDate } from "@/utils/formatDate";

/**
 * Genera las rutas estáticas para cada incidente mockeado.
 *
 * Ejemplo:
 * /incidents/INC-001
 * /incidents/INC-002
 *
 * Por ahora usamos datos locales desde "@/data/incidents".
 * Cuando exista backend, esta lógica puede reemplazarse por una llamada a API.
 */
export function generateStaticParams() {
  return incidents.map((incident) => ({
    id: incident.id,
  }));
}

/**
 * Página de detalle de un incidente.
 *
 * Responsabilidad de esta pantalla:
 * - Mostrar la información completa de un incidente.
 * - Permitir al supervisor asignar un técnico responsable.
 *
 * Importante:
 * Esta página sigue siendo un Server Component.
 * El formulario de asignación es un Client Component porque usa localStorage.
 */
export default async function IncidentDetailPage({ params }) {
  /**
   * En Next.js 15, params puede tratarse como una promesa.
   * Por eso mantenemos await params para evitar problemas de compatibilidad.
   */
  const { id } = await params;

  /**
   * Buscamos el incidente según el id recibido en la URL.
   *
   * Ejemplo:
   * Si la URL es /incidents/INC-001,
   * buscamos el incidente cuyo id sea "INC-001".
   */
  const incident = incidents.find((item) => item.id === id);

  /**
   * Si no existe un incidente con ese id,
   * Next renderiza automáticamente la página 404.
   */
  if (!incident) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8 px-6 py-8 lg:px-10 lg:py-10">
      {/* Navegación para volver al listado general de incidentes */}
      <Link
        href="/incidents"
        className="inline-flex w-fit items-center rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm font-semibold text-cyan-300 transition hover:border-cyan-400/40 hover:bg-cyan-400/10 hover:text-cyan-200"
      >
        ← Volver a incidentes
      </Link>

      {/* Card principal con la información del incidente */}
      <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 shadow-2xl shadow-black/20 md:p-8 lg:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              Detalle del incidente
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-white md:text-4xl">
              {incident.title}
            </h1>

            <p className="mt-4 text-base leading-7 text-slate-400">
              {incident.description}
            </p>
          </div>

          {/* Estado original del incidente según la data mock */}
          <div className="shrink-0">
            <StatusBadge status={incident.status} />
          </div>
        </div>

        {/* Datos generales del incidente */}
        <div className="mt-10 grid gap-5 border-t border-white/10 pt-8 md:grid-cols-2 xl:grid-cols-3">
          <DetailItem label="ID" value={incident.id} />
          <DetailItem label="Tipo" value={incident.type} />
          <DetailItem label="Área" value={incident.area} />
          <DetailItem label="Prioridad" value={incident.priority} />

          {/*
            Estos valores vienen desde el mock inicial.
            El formulario de asignación muestra el responsable/estado actualizado
            usando localStorage hasta que exista backend.
          */}
          <DetailItem label="Estado inicial" value={incident.status} />
          <DetailItem label="Reportado por" value={incident.reportedBy} />
          <DetailItem label="Responsable inicial" value={incident.assignedTo} />

          <DetailItem
            label="Fecha de creación"
            value={formatDate(incident.createdAt)}
          />

          <DetailItem
            label="Fecha de resolución"
            value={
              incident.resolvedAt
                ? formatDate(incident.resolvedAt)
                : "Pendiente"
            }
          />
        </div>

        {/* Bloque reservado para futuros datos de resolución */}
        {incident.status === "Cerrado" && (
          <div className="mt-8 rounded-3xl border border-emerald-400/20 bg-emerald-400/10 p-5">
            <p className="text-sm font-semibold text-emerald-300">Resolución</p>

            <p className="mt-2 text-sm leading-6 text-slate-300">
              Incidente cerrado. La nota de resolución se agregará cuando esté
              disponible en el flujo de cierre.
            </p>
          </div>
        )}
      </article>

      {/*
        Formulario de asignación de técnico.

        Este componente:
        - Permite elegir un técnico responsable.
        - Guarda la asignación en localStorage.
        - Cambia visualmente el estado a "En proceso".
        - Queda preparado para reemplazar localStorage por una llamada API.
      */}
      <AssignTechnicianForm
        incidentId={incident.id}
        currentAssignedTo={incident.assignedTo}
        currentStatus={incident.status}
      />
      <CloseIncidentForm
        incidentId={incident.id}
        currentStatus={incident.status}
        currentResolvedAt={incident.resolvedAt}
      />
    </section>
  );
}

/**
 * Componente auxiliar para mostrar pares label/value.
 *
 * Lo dejamos dentro del mismo archivo porque solo se usa en esta pantalla.
 * Si más adelante se reutiliza en otras páginas, conviene moverlo a:
 * src/components/ui/DetailItem.jsx
 */
function DetailItem({ label, value }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-5 transition hover:border-cyan-400/20 hover:bg-slate-900/70">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-sm font-semibold leading-6 text-white">
        {value || "Sin información"}
      </p>
    </div>
  );
}
