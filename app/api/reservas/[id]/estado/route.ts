// app/api/reservas/[id]/estado/route.ts
//
// PATCH -> aplica una acción administrativa sobre una reserva
// (aprobar, rechazar, cancelar, reagendar). Protegida — solo el
// Panel de Administración autenticado puede llamarla.
//
// "reagendar" es especial: no mueve la fecha de la reserva original,
// crea una reserva NUEVA con la nueva fecha/hora, y marca la original
// como "reagendada" enlazándola a la nueva (reagendadaHaciaId) — así
// no se pierde el historial de que hubo un cambio.

import { NextRequest, NextResponse } from "next/server";
import { obtenerSesion } from "@/lib/supabase/servidorAuth";
import { obtenerPorId, actualizar, crear } from "@/lib/reservas/repositorio";
import type { EstadoReserva } from "@/lib/reservas/types";
import { googleCalendarProvider } from "@/lib/integraciones/calendario";

type Accion = "aprobar" | "rechazar" | "cancelar" | "reagendar";

const ESTADOS_QUE_PERMITEN: Record<Accion, EstadoReserva[]> = {
  aprobar: ["pendiente_revision"],
  rechazar: ["pendiente_revision"],
  cancelar: ["pendiente_pago", "pendiente_revision", "confirmada"],
  reagendar: ["confirmada"],
};

const NUEVO_ESTADO: Record<"aprobar" | "rechazar" | "cancelar", EstadoReserva> = {
  aprobar: "confirmada",
  rechazar: "rechazada",
  cancelar: "cancelada",
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const sesion = await obtenerSesion();
  if (!sesion) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const reserva = await obtenerPorId(params.id);
  if (!reserva) {
    return NextResponse.json(
      { error: "No existe una reserva con ese id." },
      { status: 404 }
    );
  }

  let body: {
    accion?: Accion;
    notasInternas?: string;
    nuevaFecha?: string;
    nuevaHora?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "El cuerpo de la solicitud no es JSON válido." },
      { status: 400 }
    );
  }

  const { accion, notasInternas, nuevaFecha, nuevaHora } = body;

  if (!accion || !ESTADOS_QUE_PERMITEN[accion]) {
    return NextResponse.json(
      { error: 'Acción inválida. Usa "aprobar", "rechazar", "cancelar" o "reagendar".' },
      { status: 400 }
    );
  }

  if (!ESTADOS_QUE_PERMITEN[accion].includes(reserva.estado)) {
    return NextResponse.json(
      {
        error: `No se puede "${accion}" una reserva en estado "${reserva.estado}".`,
      },
      { status: 409 }
    );
  }

  if (accion === "reagendar") {
    if (!nuevaFecha || !nuevaHora) {
      return NextResponse.json(
        { error: "Reagendar requiere nuevaFecha y nuevaHora." },
        { status: 400 }
      );
    }

    const ahora = new Date().toISOString();

    const nuevaReserva = await crear({
      ...reserva,
      id: crypto.randomUUID(),
      fecha: nuevaFecha,
      hora: nuevaHora,
      estado: "confirmada",
      reagendadaHaciaId: undefined,
      googleCalendarEventId: null,
      creadoEn: ahora,
      actualizadoEn: ahora,
    });

    let advertenciaCalendario: string | undefined;
    let nuevaReservaFinal = nuevaReserva;

    try {
      if (reserva.googleCalendarEventId) {
        await googleCalendarProvider.cancelarEvento(reserva.googleCalendarEventId);
      }
      const { eventId } = await googleCalendarProvider.crearEvento(nuevaReserva);
      nuevaReservaFinal =
        (await actualizar(nuevaReserva.id, { googleCalendarEventId: eventId })) ??
        nuevaReserva;
    } catch (error) {
      advertenciaCalendario =
        "La reserva se reagendó correctamente, pero hubo un problema al sincronizar Google Calendar. Revísalo manualmente.";
      console.error("[GoogleCalendar] Error al reagendar evento:", error);
    }

    const reservaOriginalActualizada = await actualizar(reserva.id, {
      estado: "reagendada",
      reagendadaHaciaId: nuevaReservaFinal.id,
      notasInternas,
    });

    return NextResponse.json(
      {
        original: reservaOriginalActualizada,
        nueva: nuevaReservaFinal,
        ...(advertenciaCalendario ? { advertencia: advertenciaCalendario } : {}),
      },
      { status: 200 }
    );
  }

  let advertenciaCalendario: string | undefined;

  try {
    if (accion === "aprobar") {
      const { eventId } = await googleCalendarProvider.crearEvento(reserva);
      await actualizar(reserva.id, { googleCalendarEventId: eventId });
    }

    if ((accion === "rechazar" || accion === "cancelar") && reserva.googleCalendarEventId) {
      await googleCalendarProvider.cancelarEvento(reserva.googleCalendarEventId);
    }
  } catch (error) {
    advertenciaCalendario =
      "El estado se actualizó correctamente, pero hubo un problema al sincronizar Google Calendar. Revísalo manualmente.";
    console.error(`[GoogleCalendar] Error al procesar "${accion}":`, error);
  }

  const reservaActualizada = await actualizar(reserva.id, {
    estado: NUEVO_ESTADO[accion],
    notasInternas,
  });

  return NextResponse.json(
    {
      ...reservaActualizada,
      ...(advertenciaCalendario ? { advertencia: advertenciaCalendario } : {}),
    },
    { status: 200 }
  );
}
