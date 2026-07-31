// lib/reservas/validar.ts
// Validación manual (sin librerías externas) del input para crear una reserva.

import type { CrearReservaInput, Servicio } from "./types";

export interface ResultadoValidacion {
  valido: boolean;
  errores: string[];
  data: CrearReservaInput | null;
}

const SERVICIOS_VALIDOS: Servicio[] = [
  "canto",
  "piano",
  "piano-funcional",
  "masterclass",
];

const REGEX_FECHA = /^\d{4}-\d{2}-\d{2}$/;
const REGEX_HORA = /^([01]\d|2[0-3]):[0-5]\d$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function esTextoValido(valor: unknown, minLength = 1): valor is string {
  return typeof valor === "string" && valor.trim().length >= minLength;
}

function esFechaValida(valor: unknown): valor is string {
  if (typeof valor !== "string" || !REGEX_FECHA.test(valor)) return false;
  const fecha = new Date(valor + "T00:00:00");
  return !Number.isNaN(fecha.getTime());
}

function esHoraValida(valor: unknown): valor is string {
  return typeof valor === "string" && REGEX_HORA.test(valor);
}

function esEmailValido(valor: unknown): valor is string {
  return typeof valor === "string" && REGEX_EMAIL.test(valor);
}

/**
 * Valida el input crudo que llega desde el frontend (o desde cualquier
 * llamada a la API) antes de crear una reserva.
 *
 * No lanza errores — devuelve un resultado que el llamador decide cómo
 * manejar (ej. responder 400 con la lista de errores).
 */
export function validarCrearReserva(input: unknown): ResultadoValidacion {
  const errores: string[] = [];

  if (typeof input !== "object" || input === null) {
    return {
      valido: false,
      errores: ["El cuerpo de la solicitud no es un objeto válido."],
      data: null,
    };
  }

  const body = input as Record<string, unknown>;

  if (
    !esTextoValido(body.servicio) ||
    !SERVICIOS_VALIDOS.includes(body.servicio as Servicio)
  ) {
    errores.push(
      `"servicio" debe ser uno de: ${SERVICIOS_VALIDOS.join(", ")}.`
    );
  }

  if (!esTextoValido(body.planId)) {
    errores.push('"planId" es obligatorio.');
  }

  if (!esTextoValido(body.planNombre)) {
    errores.push('"planNombre" es obligatorio.');
  }

  if (!esTextoValido(body.planPrecio)) {
    errores.push('"planPrecio" es obligatorio.');
  }

  if (!esFechaValida(body.fecha)) {
    errores.push('"fecha" debe tener el formato AAAA-MM-DD y ser válida.');
  }

  if (!esHoraValida(body.hora)) {
    errores.push('"hora" debe tener el formato HH:mm (24 horas).');
  }

  if (
    typeof body.duracionMinutos !== "number" ||
    !Number.isFinite(body.duracionMinutos) ||
    body.duracionMinutos <= 0
  ) {
    errores.push('"duracionMinutos" debe ser un número mayor a 0.');
  }

  if (!esTextoValido(body.nombre, 2)) {
    errores.push('"nombre" es obligatorio (mínimo 2 caracteres).');
  }

  if (!esEmailValido(body.email)) {
    errores.push('"email" no tiene un formato válido.');
  }

  if (!esTextoValido(body.whatsapp, 6)) {
    errores.push('"whatsapp" es obligatorio.');
  }

  if (!esTextoValido(body.pais)) {
    errores.push('"pais" es obligatorio.');
  }

  if (
    body.comentarios !== undefined &&
    typeof body.comentarios !== "string"
  ) {
    errores.push('"comentarios", si se envía, debe ser texto.');
  }

  if (!esTextoValido(body.origen)) {
    errores.push('"origen" es obligatorio.');
  }

  if (errores.length > 0) {
    return { valido: false, errores, data: null };
  }

  const data: CrearReservaInput = {
    servicio: body.servicio as Servicio,
    planId: (body.planId as string).trim(),
    planNombre: (body.planNombre as string).trim(),
    planPrecio: (body.planPrecio as string).trim(),
    fecha: body.fecha as string,
    hora: body.hora as string,
    duracionMinutos: body.duracionMinutos as number,
    nombre: (body.nombre as string).trim(),
    email: (body.email as string).trim().toLowerCase(),
    whatsapp: (body.whatsapp as string).trim(),
    pais: (body.pais as string).trim(),
    comentarios:
      typeof body.comentarios === "string"
        ? body.comentarios.trim()
        : undefined,
    origen: (body.origen as string).trim(),
  };

  return { valido: true, errores: [], data };
}