import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

export const ZONA_HORARIA_SANTIAGO = "America/Santiago";

/**
 * Convierte una fecha/hora civil de Santiago a un Date/instante UTC.
 *
 * Ejemplo:
 * "2026-08-14" + "10:00"
 * significa SIEMPRE las 10:00 de Santiago,
 * aunque el servidor esté ejecutándose en Brasil o UTC.
 */
export function fechaHoraSantiagoAUTC(
  fecha: string,
  hora: string
): Date {
  return fromZonedTime(
    `${fecha}T${hora}:00`,
    ZONA_HORARIA_SANTIAGO
  );
}

/**
 * Devuelve el instante UTC correspondiente a las 23:59
 * de una fecha determinada en Santiago.
 */
export function finDelDiaSantiagoAUTC(fecha: string): Date {
  return fechaHoraSantiagoAUTC(fecha, "23:59");
}

/**
 * Formatea un instante para mostrarlo en horario de Santiago.
 */
export function formatearHoraSantiago(
  fecha: Date | string
): string {
  return formatInTimeZone(
    fecha,
    ZONA_HORARIA_SANTIAGO,
    "HH:mm"
  );
}
