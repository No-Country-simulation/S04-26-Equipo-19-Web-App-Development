// Opciones reutilizables para formularios y filtros de incidentes.
// Mantener estos valores separados evita repetir arrays dentro de componentes.

export const CUSTOM_INCIDENT_TYPE_OPTION = "Otro";

export const INCIDENT_DESCRIPTION_MAX_LENGTH = 500;

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
  CUSTOM_INCIDENT_TYPE_OPTION,
];

export const incidentPriorities = ["Baja", "Media", "Alta", "Crítica"];

export const incidentShifts = ["Mañana", "Tarde", "Noche"];

export const initialIncidentFormState = {
  title: "",
  area: "",
  type: "",
  customType: "",
  priority: "",
  shift: "",
  location: "",
  reporterName: "",
  description: "",
};