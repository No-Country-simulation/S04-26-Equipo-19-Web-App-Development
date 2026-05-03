/**
 * Badge visual para representar el estado de un incidente.
 *
 * Centralizar esto permite cambiar colores o labels desde un solo lugar.
 * Las clases badge-* están definidas en globals.css.
 */
const statusStyles = {
  Abierto: "badge-critical",
  "En progreso": "badge-progress",
  Cerrado: "badge-resolved",
};

export default function StatusBadge({ status }) {
  const badgeClass = statusStyles[status] || "badge-open";

  return <span className={`badge ${badgeClass}`}>{status}</span>;
}