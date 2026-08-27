import { googleCalendarProvider } from "@/lib/integraciones/calendario";
import type { Reserva } from "./types";
import {
  actualizarClase,
  listarClases,
  reclamarSincronizacionClase,
} from "./repositorio";

function eventIdDeterminista(claseId: string): string {
  return claseId.replace(/-/g, "").toLowerCase();
}

export async function crearEventosPendientes(reserva: Reserva): Promise<void> {
  const clases = await listarClases(reserva.id);
  const errores: string[] = [];

  for (const clase of clases) {
    if (clase.googleCalendarEventId || clase.estadoSincronizacion === "creado") continue;
    const reclamada = await reclamarSincronizacionClase(clase.id);
    if (!reclamada) continue;

    try {
      const eventId = eventIdDeterminista(reclamada.id);
      await googleCalendarProvider.crearEvento(
        {
          ...reserva,
          fecha: reclamada.fecha,
          hora: reclamada.hora,
          duracionMinutos: reclamada.duracionMinutos,
        },
        eventId,
      );
      await actualizarClase(reclamada.id, {
        googleCalendarEventId: eventId,
        estadoSincronizacion: "creado",
      });
    } catch (error) {
      await actualizarClase(reclamada.id, { estadoSincronizacion: "error" });
      errores.push(`Clase ${reclamada.numeroClase}: ${error instanceof Error ? error.message : "error"}`);
    }
  }

  if (errores.length > 0) throw new Error(errores.join("; "));
}

export async function cancelarEventosSerie(reservaId: string): Promise<void> {
  const clases = await listarClases(reservaId);
  const errores: string[] = [];

  for (const clase of clases) {
    try {
      if (clase.googleCalendarEventId) {
        await googleCalendarProvider.cancelarEvento(clase.googleCalendarEventId);
      }
      await actualizarClase(clase.id, {
        googleCalendarEventId: null,
        estadoSincronizacion: "cancelado",
      });
    } catch (error) {
      await actualizarClase(clase.id, { estadoSincronizacion: "error" });
      errores.push(`Clase ${clase.numeroClase}: ${error instanceof Error ? error.message : "error"}`);
    }
  }

  if (errores.length > 0) throw new Error(errores.join("; "));
}
