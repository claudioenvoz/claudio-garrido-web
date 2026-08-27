// lib/reservas/crearReserva.ts
//
// Lógica de negocio para crear una reserva. No sabe nada de HTTP —
// la ruta de API (Etapa siguiente) solo la llama y traduce el resultado
// a una respuesta.

import type { Reserva, ReservaClase } from "./types";
import { validarCrearReserva } from "./validar";
import { crearConClases as guardarReserva } from "./repositorio";
import { generarFechasRecurrentes } from "./recurrencia";
import { estaSerieDisponible } from "@/lib/integraciones/calendario/disponibilidad";

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

  const fechas = generarFechasRecurrentes(datos.fecha, datos.planId);
  const disponible = await estaSerieDisponible(fechas, datos.hora, 60);

  if (!disponible) {
    return {
      exito: false,
      errores: [
        "Ese horario ya no está disponible para todas las clases del pack. Elige otro horario.",
      ],
    };
  }

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
    ionixOrderId: undefined,
    ionixCommerceOrder: undefined,
    ionixEstado: undefined,
    ionixCheckoutUrl: undefined,
    ionixMonto: undefined,
    ionixAutorizacionId: undefined,
    ionixGateway: undefined,
    ionixPagadoEn: undefined,
    ionixIntento: 0,

    estado: "pendiente_pago",
    holdExpiraEn: calcularHoldExpiraEn(datos.fecha),

    googleCalendarEventId: null,

    origen: datos.origen,
    notasInternas: undefined,
    creadoEn: ahora,
    actualizadoEn: ahora,
  };

  const clases: ReservaClase[] = fechas.map((fecha, index) => ({
    id: crypto.randomUUID(),
    reservaId: reserva.id,
    numeroClase: index + 1,
    fecha,
    hora: datos.hora,
    duracionMinutos: 60,
    googleCalendarEventId: null,
    estadoSincronizacion: "pendiente",
    creadoEn: ahora,
    actualizadoEn: ahora,
  }));

  const guardada = await guardarReserva(reserva, clases);

  return { exito: true, reserva: guardada };
}
