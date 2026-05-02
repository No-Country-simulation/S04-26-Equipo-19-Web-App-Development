"use client";

import { useCallback, useEffect, useState } from "react";

import IncidentCard from "@/components/incidents/IncidentCard";
import { getMergedIncident } from "@/lib/incidentStorage";

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
   *
   * Ejemplo:
   * Si INC-001 fue asignado o cerrado desde el detalle,
   * acá mezclamos esa actualización con la data mock original.
   */
  const syncLocalIncidentChanges = useCallback(() => {
    const mergedIncidents = initialIncidents.map((incident) =>
      getMergedIncident(incident)
    );

    setVisibleIncidents(mergedIncidents);
  }, [initialIncidents]);

  useEffect(() => {
    syncLocalIncidentChanges();

    /**
     * Este evento custom lo dispara incidentStorage.js cada vez que
     * se asigna o se cierra un incidente.
     */
    function handleIncidentUpdated() {
      syncLocalIncidentChanges();
    }

    window.addEventListener("opscore-incident-updated", handleIncidentUpdated);

    /**
     * El evento storage ayuda si el usuario modifica datos desde otra pestaña.
     */
    window.addEventListener("storage", handleIncidentUpdated);

    /**
     * El evento focus ayuda a refrescar el listado cuando el usuario vuelve
     * a esta pestaña o navega de vuelta desde otra pantalla.
     */
    window.addEventListener("focus", handleIncidentUpdated);

    return () => {
      window.removeEventListener(
        "opscore-incident-updated",
        handleIncidentUpdated
      );
      window.removeEventListener("storage", handleIncidentUpdated);
      window.removeEventListener("focus", handleIncidentUpdated);
    };
  }, [syncLocalIncidentChanges]);

  if (visibleIncidents.length === 0) {
    return (
      <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-slate-400">
          Todavía no hay incidentes cargados.
        </p>
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