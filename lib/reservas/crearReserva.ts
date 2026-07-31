// lib/reservas/crearReserva.ts
//
// Lógica de negocio para crear una reserva. No sabe nada de HTTP —
// la ruta de API (Etapa siguiente) solo la llama y traduce el resultado
// a una respuesta.

import type { Reserva } from "./types";
import { validarCrearReserva } from "./validar";
import { crear as guardarReserva } from "./repositorio";

export type ResultadoCrearReserva =
  | { exito: true; reserva: Reserva }
  | { exito: false; errores: string[] };

/**
 * Calcula hasta cuándo queda reservado el horario mientras se espera el
 * pago. Regla de negocio ya definida: 23:59 del mismo día de la fecha
 * de la clase.
 *
 * Nota: por ahora es un cálculo fijo. Cuando el método de pago sea
 * ionix_internacional (confirmación instantánea vía webhook), este valor
 * deja de ser relevante en la práctica, pero se mantiene igual para
 * ambos casos hasta que conectemos esa integración.
 */
function calcularHoldExpiraEn(fecha: string): string {
  const finDelDia = new Date(`${fecha}T23:59:00`);
  return finDelDia.toISOString();
}

export async function crearReserva(
  input: unknown
): Promise<ResultadoCrearReserva> {
  const resultado = validarCrearReserva(input);

  if (!resultado.valido || !resultado.data) {
    return { exito: false, errores: resultado.errores };
  }

  const datos = resultado.data;

  // TODO (etapa de integración con Cal.com/Google Calendar):
  // acá se debe consultar disponibilidad real antes de crear la reserva,
  // vía algo como `calendarProvider.estaDisponible(datos.fecha, datos.hora)`.
  // Por ahora se asume siempre disponible.

  const ahora = new Date().toISOString();

  const reserva: Reserva = {
    id: crypto.randomUUID(),

    servicio: datos.servicio,
    planId: datos.planId,
    planNombre: datos.planNombre,
    planPrecio: datos.planPrecio,

    fecha: datos.fecha,
    hora: datos.hora,
    duracionMinutos: datos.duracionMinutos,

    nombre: datos.nombre,
    email: datos.email,
    whatsapp: datos.whatsapp,
    pais: datos.pais,
    comentarios: datos.comentarios,

    metodoPago: null,
    comprobanteUrl: undefined,
    pagoExternoId: undefined,

    estado: "pendiente_pago",
    holdExpiraEn: calcularHoldExpiraEn(datos.fecha),

    googleCalendarEventId: null,

    origen: datos.origen,
    notasInternas: undefined,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  const guardada = await guardarReserva(reserva);

  return { exito: true, reserva: guardada };
}