// Badge visual para representar el estado de un incidente.
// Centralizar esto permite cambiar colores o labels desde un solo lugar.

const statusStyles = {
  Abierto: "border-red-400/30 bg-red-400/10 text-red-300",
  "En progreso": "border-amber-400/30 bg-amber-400/10 text-amber-300",
  Cerrado: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
};

export default function StatusBadge({ status }) {
  const badgeClass =
    statusStyles[status] || "border-slate-400/30 bg-slate-400/10 text-slate-300";

  return (
    <span
      className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}
    >
      {status}
    </span>
  );
}