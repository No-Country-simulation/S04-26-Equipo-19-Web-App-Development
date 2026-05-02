// Opciones reutilizables para formularios y filtros de incidentes.
// Mantener estos valores separados evita repetir arrays dentro de componentes.

export const incidentAreas = [
  "Producción",
  "Mantenimiento",
  "Calidad",
  "Seguridad",
  "Logística",
  "Depósito",
];

export const incidentTypes = [
  "Falla mecánica",
  "Falla eléctrica",
  "Desvío de calidad",
  "Accidente",
  "Casi accidente",
  "Mantenimiento preventivo",
  "Problema operativo",
];

export const incidentPriorities = ["Baja", "Media", "Alta", "Crítica"];

export const incidentShifts = ["Mañana", "Tarde", "Noche"];

export const initialIncidentFormState = {
  title: "",
  area: "",
  type: "",
  priority: "",
  shift: "",
  location: "",
  reporterName: "",
  description: "",
};