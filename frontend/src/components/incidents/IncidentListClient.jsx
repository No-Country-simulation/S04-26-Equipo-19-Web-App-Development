"use client";

import { useCallback, useEffect, useState } from "react";

import IncidentCard from "@/components/incidents/IncidentCard";
import { getAllMergedIncidents } from "@/lib/incidentStorage";

/**
 * Listado client-side de incidentes.
 *
 * Esta capa existe porque los cambios locales del MVP se guardan en localStorage,
 * y localStorage solo está disponible en el navegador.
 *
 * Flujo actual:
 * mock data original + cambios locales = incidentes actualizados en la UI.
 *
 * Cuando integremos backend, esta lógica debería reemplazarse por datos reales
 * provenientes de la API.
 */
export default function IncidentListClient({ initialIncidents }) {
  const [visibleIncidents, setVisibleIncidents] = useState(initialIncidents);

  /**
   * Sincroniza el listado con los cambios guardados localmente.
   */
  const syncLocalIncidentChanges = useCallback(() => {
    const mergedIncidents = getAllMergedIncidents(initialIncidents);

    setVisibleIncidents(mergedIncidents);
  }, [initialIncidents]);

  useEffect(() => {
    syncLocalIncidentChanges();

    function handleIncidentUpdated() {
      syncLocalIncidentChanges();
    }

    window.addEventListener("opscore-incident-updated", handleIncidentUpdated);
    window.addEventListener("storage", handleIncidentUpdated);
    window.addEventListener("focus", handleIncidentUpdated);

    return () => {
      window.removeEventListener(
        "opscore-incident-updated",
        handleIncidentUpdated,
      );
      window.removeEventListener("storage", handleIncidentUpdated);
      window.removeEventListener("focus", handleIncidentUpdated);
    };
  }, [syncLocalIncidentChanges]);

  if (visibleIncidents.length === 0) {
    return (
      <section className="empty-state mt-8">
        <p className="text-sm">Todavía no hay incidentes cargados.</p>
      </section>
    );
  }

  return (
    <section className="mt-8 grid gap-4">
      {visibleIncidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </section>
  );
}