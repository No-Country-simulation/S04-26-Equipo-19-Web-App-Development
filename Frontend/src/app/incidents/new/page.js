import IncidentForm from "@/components/incidents/IncidentForm";

// Página para crear un nuevo incidente.
// La lógica del formulario vive en un componente separado para mantener limpia la ruta.

export default function NewIncidentPage() {
  return (
    <main className="px-6 py-10 text-white">
      <section className="mx-auto max-w-3xl">
        <header>
          <p className="text-sm font-medium text-cyan-300">Nuevo incidente</p>

          <h1 className="mt-2 text-4xl font-bold">Reportar incidente</h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Formulario mobile-first para registrar una falla, accidente o desvío
            operativo de manera rápida y clara.
          </p>
        </header>

        <IncidentForm />
      </section>
    </main>
  );
}