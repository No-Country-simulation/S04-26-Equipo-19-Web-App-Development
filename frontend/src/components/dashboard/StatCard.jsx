// Card reutilizable para mostrar métricas del dashboard.
// Mantenerlo separado evita repetir estilos en cada estadística.

export default function StatCard({ label, value, helper, tone = "default" }) {
  const tones = {
    default: "border-white/10 bg-white/5",
    cyan: "border-cyan-400/20 bg-cyan-400/10",
    amber: "border-amber-400/20 bg-amber-400/10",
    green: "border-emerald-400/20 bg-emerald-400/10",
    red: "border-red-400/20 bg-red-400/10",
  };

  return (
    <article className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <p className="text-sm text-slate-400">{label}</p>

      <p className="mt-3 text-3xl font-bold text-white">{value}</p>

      {helper ? (
        <p className="mt-2 text-sm leading-6 text-slate-500">{helper}</p>
      ) : null}
    </article>
  );
}