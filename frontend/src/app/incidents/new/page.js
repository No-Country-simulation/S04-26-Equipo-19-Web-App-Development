import IncidentForm from "@/components/incidents/IncidentForm";

/**
 * Página para crear un nuevo incidente.
 *
 * La lógica del formulario vive en un componente separado para mantener limpia
 * la ruta y facilitar futuras integraciones con backend.
 */
export default function NewIncidentPage() {
  return (
    <main className="app-page">
      <section className="page-container max-w-3xl">
        <header>
          <p className="page-eyebrow">Nuevo incidente</p>

          <h1 className="page-title">Reportar incidente</h1>

          <p className="page-description">
            Registrá una falla, accidente o desvío operativo. Esta versión usa
            validación local y deja preparado el objeto para conectarlo a una
            API.
          </p>
        </header>

        <IncidentForm />
      </section>
    </main>
  );
}