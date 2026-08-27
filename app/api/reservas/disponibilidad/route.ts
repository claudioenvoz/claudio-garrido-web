import { NextRequest, NextResponse } from "next/server";
import {
  esFechaCalendarioValida,
  obtenerDisponibilidadSerie,
} from "@/lib/integraciones/calendario/disponibilidad";
import { esPlanReservaId, generarFechasRecurrentes } from "@/lib/reservas/recurrencia";

export async function GET(request: NextRequest) {
  const fecha = request.nextUrl.searchParams.get("fecha");
  const planId = request.nextUrl.searchParams.get("planId") ?? "individual";

  if (!fecha || !esFechaCalendarioValida(fecha)) {
    return NextResponse.json(
      { error: 'El parámetro "fecha" debe tener formato AAAA-MM-DD y ser válido.' },
      { status: 400 },
    );
  }
  if (!esPlanReservaId(planId)) {
    return NextResponse.json({ error: "El plan seleccionado no es válido." }, { status: 400 });
  }

  const fechas = generarFechasRecurrentes(fecha, planId);
  try {
    const horarios = await obtenerDisponibilidadSerie(fechas);
    return NextResponse.json({
      fecha,
      fechas,
      zonaHoraria: "America/Santiago",
      zonaHorariaUsuario: "America/Sao_Paulo",
      horarios,
    });
  } catch (error) {
    console.error("[Disponibilidad] Error consultando la serie:", error);
    return NextResponse.json(
      { error: "No fue posible consultar la disponibilidad del calendario." },
      { status: 500 },
    );
  }
}
