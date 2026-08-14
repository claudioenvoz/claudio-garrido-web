// lib/integraciones/calendario/index.ts
//
// Integración real con Google Calendar, usando una cuenta de servicio
// compartida con permiso de edición sobre el calendario de Claudio.

import { google } from "googleapis";
import type { Reserva } from "@/lib/reservas/types";

const VALOR_FICTICIO_EMAIL =
  "ficticio@ficticio.iam.gserviceaccount.com";

const VALOR_FICTICIO_KEY =
  "-----BEGIN PRIVATE KEY-----\nFICTICIA\n-----END PRIVATE KEY-----\n";

const VALOR_FICTICIO_CALENDAR_ID =
  "ficticio@gmail.com";

function obtenerCredenciales() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;

  console.log("EMAIL:", email);
  console.log("CALENDAR:", calendarId);
  console.log("KEY PRESENTE:", !!privateKey);

  if (!email || !privateKey || !calendarId) {
    console.warn(
      "[GoogleCalendar] Faltan variables de entorno (GOOGLE_SERVICE_ACCOUNT_EMAIL, " +
        "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY o GOOGLE_CALENDAR_ID) — usando valores FICTICIOS."
    );
  }

  return {
    email: email ?? VALOR_FICTICIO_EMAIL,
    privateKey: (privateKey ?? VALOR_FICTICIO_KEY).replace(/\\n/g, "\n"),
    calendarId: calendarId ?? VALOR_FICTICIO_CALENDAR_ID,
  };
}

function obtenerClienteCalendar() {
  const { email, privateKey } = obtenerCredenciales();

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });

  return google.calendar({ version: "v3", auth });
}

const ZONA_HORARIA = "America/Santiago";

function calcularRangoEvento(
  reserva: Pick<Reserva, "fecha" | "hora" | "duracionMinutos">
) {
  const inicio = new Date(`${reserva.fecha}T${reserva.hora}:00`);

  const fin = new Date(
    inicio.getTime() + reserva.duracionMinutos * 60 * 1000
  );

  return { inicio, fin };
}

export interface CalendarProvider {
  estaDisponible(
    fecha: string,
    hora: string,
    duracionMinutos: number
  ): Promise<boolean>;

  obtenerHorariosOcupados(
    fecha: string
  ): Promise<string[]>;

  crearEvento(
    reserva: Reserva
  ): Promise<{ eventId: string }>;

  cancelarEvento(
    eventId: string
  ): Promise<void>;
}

export const googleCalendarProvider: CalendarProvider = {
  async estaDisponible(fecha, hora, duracionMinutos) {
    const { calendarId } = obtenerCredenciales();
    const calendar = obtenerClienteCalendar();

    const { inicio, fin } = calcularRangoEvento({
      fecha,
      hora,
      duracionMinutos,
    });

    const respuesta = await calendar.freebusy.query({
      requestBody: {
        timeMin: inicio.toISOString(),
        timeMax: fin.toISOString(),
        timeZone: ZONA_HORARIA,
        items: [{ id: calendarId }],
      },
    });

    const ocupado =
      respuesta.data.calendars?.[calendarId]?.busy ?? [];

    return ocupado.length === 0;
  },

  async obtenerHorariosOcupados(fecha: string) {
    const { calendarId } = obtenerCredenciales();
    const calendar = obtenerClienteCalendar();

    const inicioDia = new Date(`${fecha}T00:00:00`);
    const finDia = new Date(`${fecha}T23:59:59`);

    const respuesta = await calendar.events.list({
      calendarId,
      timeMin: inicioDia.toISOString(),
      timeMax: finDia.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const eventos = respuesta.data.items ?? [];

    return eventos
      .map((evento) => {
        const inicio = evento.start?.dateTime;

        if (!inicio) return null;

        const fechaInicio = new Date(inicio);

        return fechaInicio.toLocaleTimeString("es-CL", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: ZONA_HORARIA,
        });
      })
      .filter(Boolean) as string[];
  },

  async crearEvento(reserva) {
    const { calendarId } = obtenerCredenciales();
    const calendar = obtenerClienteCalendar();

    const { inicio, fin } = calcularRangoEvento(reserva);

    const respuesta = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary: `${reserva.planNombre} — ${reserva.nombre}`,

        description:
          `Servicio: ${reserva.servicio}\n` +
          `Alumno: ${reserva.nombre}\n` +
          `Email: ${reserva.email}\n` +
          `WhatsApp: ${reserva.whatsapp}\n` +
          (reserva.comentarios
            ? `Comentarios: ${reserva.comentarios}\n`
            : "") +
          `Reserva ID: ${reserva.id}`,

        start: {
          dateTime: inicio.toISOString(),
          timeZone: ZONA_HORARIA,
        },

        end: {
          dateTime: fin.toISOString(),
          timeZone: ZONA_HORARIA,
        },
      },
    });

    if (!respuesta.data.id) {
      throw new Error(
        "[GoogleCalendar] El evento se creó pero no devolvió un id."
      );
    }

    return {
      eventId: respuesta.data.id,
    };
  },

  async cancelarEvento(eventId) {
    const { calendarId } = obtenerCredenciales();
    const calendar = obtenerClienteCalendar();

    await calendar.events.delete({
      calendarId,
      eventId,
    });
  },
};