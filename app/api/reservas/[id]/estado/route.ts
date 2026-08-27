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
import { obtenerPorId, actualizar, crearConClases } from "@/lib/reservas/repositorio";
import type { EstadoReserva, Reserva, ReservaClase } from "@/lib/reservas/types";
import { cancelarEventosSerie, crearEventosPendientes } from "@/lib/reservas/sincronizarCalendario";

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
    if (reserva.planId !== "individual") {
      return NextResponse.json(
        { error: "El reagendamiento de packs recurrentes debe gestionarse manualmente." },
        { status: 409 },
      );
    }
    if (!nuevaFecha || !nuevaHora) {
      return NextResponse.json(
        { error: "Reagendar requiere nuevaFecha y nuevaHora." },
        { status: 400 }
      );
    }

    const ahora = new Date().toISOString();

    const nuevaReservaBase: Reserva = {
      ...reserva,
      id: crypto.randomUUID(),
      fecha: nuevaFecha,
      hora: nuevaHora,
      estado: "confirmada",
      reagendadaHaciaId: undefined,
      googleCalendarEventId: null,
      creadoEn: ahora,
      actualizadoEn: ahora,
    };
    const nuevaClase: ReservaClase = {
      id: crypto.randomUUID(),
      reservaId: nuevaReservaBase.id,
      numeroClase: 1,
      fecha: nuevaFecha,
      hora: nuevaHora,
      duracionMinutos: reserva.duracionMinutos,
      googleCalendarEventId: null,
      estadoSincronizacion: "pendiente",
      creadoEn: ahora,
      actualizadoEn: ahora,
    };
    const nuevaReserva = await crearConClases(nuevaReservaBase, [nuevaClase]);

    let advertenciaCalendario: string | undefined;
    let nuevaReservaFinal = nuevaReserva;

    try {
      await crearEventosPendientes(nuevaReserva);
      await cancelarEventosSerie(reserva.id);
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

  try {
    if (accion === "aprobar") {
      await crearEventosPendientes(reserva);
    }

    if (accion === "rechazar" || accion === "cancelar") {
      await cancelarEventosSerie(reserva.id);
    }
  } catch (error) {
    console.error(`[GoogleCalendar] Error al procesar "${accion}":`, error);
    return NextResponse.json(
      {
        error:
          "No se completó la sincronización con Google Calendar. El estado de la reserva no cambió; puedes reintentar la acción.",
      },
      { status: 502 },
    );
  }

  const reservaActualizada = await actualizar(reserva.id, {
    estado: NUEVO_ESTADO[accion],
    notasInternas,
  });

  return NextResponse.json(
    reservaActualizada,
    { status: 200 }
  );
}
