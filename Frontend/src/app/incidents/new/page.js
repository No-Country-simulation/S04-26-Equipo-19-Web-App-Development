// Página para reportar un nuevo incidente.
// Por ahora el formulario es visual. Más adelante se conectará con la API del backend.

export default function NewIncidentPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto max-w-3xl">
        {/* Encabezado de la página */}
        <header>
          <p className="text-sm font-medium text-cyan-300">
            Nuevo incidente
          </p>

          <h1 className="mt-2 text-4xl font-bold">Reportar incidente</h1>

          <p className="mt-2 max-w-2xl text-slate-400">
            Formulario mobile-first para registrar una falla, accidente o desvío
            operativo de manera rápida y clara.
          </p>
        </header>

        {/* 
          Formulario inicial.
          Cuando se conecte con backend, este formulario deberá manejar estado,
          validaciones y envío de datos mediante fetch o una librería de formularios.
        */}
        <form className="mt-8 space-y-5 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div>
            <label htmlFor="title" className="text-sm font-medium text-slate-300">
              Título
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="Ej: Falla en cinta transportadora"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="area" className="text-sm font-medium text-slate-300">
              Área
            </label>

            <select
              id="area"
              name="area"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Producción</option>
              <option>Mantenimiento</option>
              <option>Calidad</option>
              <option>Seguridad</option>
              <option>Logística</option>
            </select>
          </div>

          <div>
            <label htmlFor="type" className="text-sm font-medium text-slate-300">
              Tipo de incidente
            </label>

            <select
              id="type"
              name="type"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Falla mecánica</option>
              <option>Calidad</option>
              <option>Seguridad</option>
              <option>Mantenimiento</option>
              <option>Operativo</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="text-sm font-medium text-slate-300"
            >
              Prioridad
            </label>

            <select
              id="priority"
              name="priority"
              className="mt-2 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            >
              <option>Baja</option>
              <option>Media</option>
              <option>Alta</option>
              <option>Crítica</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-300"
            >
              Descripción
            </label>

            <textarea
              id="description"
              name="description"
              rows="5"
              placeholder="Describí brevemente qué ocurrió..."
              className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Crear incidente
          </button>
        </form>
      </section>
    </main>
  );
}