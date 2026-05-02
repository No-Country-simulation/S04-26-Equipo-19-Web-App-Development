// Mock data inicial para trabajar el frontend sin depender todavía del backend.
// Más adelante este archivo se reemplazará por llamadas reales a la API de Django.

export const incidents = [
  {
    id: "INC-001",
    title: "Falla en cinta transportadora",
    description: "La cinta se detuvo durante la línea de producción.",
    area: "Producción",
    type: "Falla mecánica",
    priority: "Alta",
    status: "Abierto",
    reportedBy: "Operario 1",
    assignedTo: "Sin asignar",
    createdAt: "2026-05-01T09:00:00",
    resolvedAt: null,
  },
  {
    id: "INC-002",
    title: "Desvío de calidad en lote",
    description:
      "Se detectaron piezas fuera de tolerancia durante el control de calidad.",
    area: "Calidad",
    type: "Calidad",
    priority: "Media",
    status: "En progreso",
    reportedBy: "Operario 3",
    assignedTo: "Supervisor de calidad",
    createdAt: "2026-05-01T10:30:00",
    resolvedAt: null,
  },
  {
    id: "INC-003",
    title: "Accidente menor en sector carga",
    description: "Un operario sufrió un golpe leve durante una maniobra de carga.",
    area: "Seguridad",
    type: "Seguridad",
    priority: "Alta",
    status: "Cerrado",
    reportedBy: "Operario 5",
    assignedTo: "Técnico de seguridad",
    createdAt: "2026-04-30T15:00:00",
    resolvedAt: "2026-04-30T17:00:00",
  },
];