// Lista mock de técnicos disponibles para asignar incidentes.
//
// Por ahora trabajamos con datos locales porque todavía no tenemos backend.
// Cuando integremos Django, este archivo debería ser reemplazado por una llamada
// a la API, por ejemplo: GET /api/technicians

export const technicians = [
  {
    id: "TECH-001",
    name: "Carlos Méndez",
    role: "Técnico mecánico",
  },
  {
    id: "TECH-002",
    name: "María Torres",
    role: "Técnica eléctrica",
  },
  {
    id: "TECH-003",
    name: "Juan Pérez",
    role: "Supervisor de mantenimiento",
  },
  {
    id: "TECH-004",
    name: "Lucía Fernández",
    role: "Calidad y seguridad",
  },
];