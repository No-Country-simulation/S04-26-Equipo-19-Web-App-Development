import { NextResponse } from "next/server";

const REQUIRED_FIELDS = [
  "title",
  "area",
  "type",
  "priority",
  "shift",
  "location",
  "description",
];

/**
 * Endpoint temporal para crear incidentes.
 *
 * No reemplaza al backend real. Su objetivo actual es forzar una petición HTTP
 * real desde el formulario para que QA pueda validar correctamente escenarios
 * offline, errores de conexión y fallos de servidor.
 */
export async function POST(request) {
  try {
    const incidentData = await request.json();
    const validationError = validateIncidentData(incidentData);

    if (validationError) {
      return NextResponse.json(
        {
          message: validationError,
        },
        {
          status: 400,
        }
      );
    }

    const incident = {
      id: `INC-${Date.now()}`,
      title: incidentData.title.trim(),
      description: incidentData.description.trim(),
      area: incidentData.area,
      type: incidentData.type,
      priority: incidentData.priority,
      shift: incidentData.shift,
      location: incidentData.location.trim(),
      reportedBy:
        incidentData.reporterName?.trim() || "Operario sin identificar",
      assignedTo: "Sin asignar",
      status: "Abierto",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
      resolutionNote: "",
    };

    return NextResponse.json(
      {
        message: "Incidente registrado correctamente.",
        incident,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error creating incident:", error);

    return NextResponse.json(
      {
        message: "Error interno al registrar el incidente.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * Valida los campos mínimos requeridos para crear un incidente.
 */
function validateIncidentData(incidentData) {
  if (!incidentData || typeof incidentData !== "object") {
    return "Los datos del incidente son inválidos.";
  }

  const missingField = REQUIRED_FIELDS.find((field) => {
    const value = incidentData[field];

    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missingField) {
    return `El campo ${missingField} es obligatorio.`;
  }

  if (incidentData.description.trim().length < 15) {
    return "La descripción debe tener al menos 15 caracteres.";
  }

  return null;
}