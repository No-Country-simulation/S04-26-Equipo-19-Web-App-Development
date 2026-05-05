// Formatea fechas ISO a un formato más legible para la interfaz.
// Este helper evita repetir lógica de fecha en varios componentes.

export function formatDate(date) {
  if (!date) return "Sin fecha";

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}