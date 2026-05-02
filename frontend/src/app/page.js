import Link from "next/link";

// Página inicial del proyecto.
// Funciona como landing simple para presentar el propósito de OpsCore.

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6">
        {/* Etiqueta superior para contextualizar rápidamente el producto */}
        <span className="mb-4 w-fit rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
          OpsCore · Incident Management
        </span>

        {/* Título principal orientado al valor del producto */}
        <h1 className="max-w-3xl text-5xl font-bold tracking-tight md:text-7xl">
          Gestión inteligente de incidentes operativos.
        </h1>

        {/* Descripción breve del problema que resuelve la app */}
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          Reportá fallas, asigná responsables, seguí estados y analizá causas
          recurrentes desde una plataforma simple, trazable y pensada para
          entornos industriales.
        </p>

        {/* Acciones principales de navegación */}
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/dashboard"
            className="rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Ver dashboard
          </Link>

          <Link
            href="/incidents/new"
            className="rounded-xl border border-white/15 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Reportar incidente
          </Link>
        </div>
      </section>
    </main>
  );
}