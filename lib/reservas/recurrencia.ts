export type PlanReservaId = "individual" | "mensual" | "bimensual";

const REGLAS_PLAN = {
  individual: { cantidadClases: 1, nombre: "Clase Individual", precio: "$40.000 CLP" },
  mensual: { cantidadClases: 4, nombre: "Pack Mensual", precio: "$120.000 CLP" },
  bimensual: { cantidadClases: 8, nombre: "Pack Bimensual", precio: "$200.000 CLP" },
} as const;

export function esPlanReservaId(valor: string): valor is PlanReservaId {
  return valor in REGLAS_PLAN;
}

export function obtenerReglaPlan(planId: PlanReservaId) {
  return REGLAS_PLAN[planId];
}

export function generarFechasRecurrentes(
  fechaInicial: string,
  planId: PlanReservaId,
): string[] {
  const [year, month, day] = fechaInicial.split("-").map(Number);

  if (!year || !month || !day) return [];

  const inicio = new Date(Date.UTC(year, month - 1, day));

  return Array.from({ length: REGLAS_PLAN[planId].cantidadClases }, (_, index) => {
    const fecha = new Date(inicio);
    fecha.setUTCDate(inicio.getUTCDate() + index * 7);
    return fecha.toISOString().slice(0, 10);
  });
}

export function formatearFechaRecurrente(fecha: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${fecha}T12:00:00Z`));
}
