// app/api/reservas/route.ts
//
// POST -> crea una reserva (usado por el wizard del frontend, público)
// GET  -> lista reservas (SOLO Panel de Administración — protegido)

import { NextRequest, NextResponse } from "next/server";
import { crearReserva } from "@/lib/reservas/crearReserva";
import { listar, type FiltrosListado } from "@/lib/reservas/repositorio";
import type { EstadoReserva, Servicio } from "@/lib/reservas/types";
import { obtenerSesion } from "@/lib/supabase/servidorAuth";

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { errores: ["El cuerpo de la solicitud no es JSON válido."] },
      { status: 400 }
    );
  }

  const resultado = await crearReserva(body);

  if (!resultado.exito) {
    return NextResponse.json({ errores: resultado.errores }, { status: 400 });
  }

  return NextResponse.json(resultado.reserva, { status: 201 });
}

export async function GET(request: NextRequest) {
  const sesion = await obtenerSesion();

  if (!sesion) {
    return NextResponse.json(
      { error: "No autorizado. Debes iniciar sesión en el Panel de Administración." },
      { status: 401 }
    );
  }

  const { searchParams } = request.nextUrl;

  const filtros: FiltrosListado = {};

  const estado = searchParams.get("estado");
  if (estado) filtros.estado = estado as EstadoReserva;

  const servicio = searchParams.get("servicio");
  if (servicio) filtros.servicio = servicio as Servicio;

  const fecha = searchParams.get("fecha");
  if (fecha) filtros.fecha = fecha;

  const reservas = await listar(filtros);

  return NextResponse.json(reservas);
}
