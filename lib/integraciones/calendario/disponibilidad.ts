import { google } from "googleapis";
import { normalizarPrivateKey } from "./credenciales";

const TIME_ZONE_SANTIAGO = "America/Santiago";
const TIME_ZONE_SAO_PAULO = "America/Sao_Paulo";
const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00",
];

function obtenerConfiguracion() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!email || !privateKeyRaw || !calendarId) {
    throw new Error("Faltan variables de entorno de Google Calendar.");
  }
  const auth = new google.auth.JWT({
    email,
    key: normalizarPrivateKey(privateKeyRaw),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return { calendar: google.calendar({ version: "v3", auth }), calendarId };
}

function obtenerOffsetZonaHoraria(fecha: string, zonaHoraria: string): string {
  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zonaHoraria,
    timeZoneName: "longOffset",
  }).formatToParts(new Date(`${fecha}T12:00:00Z`));
  const zona = partes.find((parte) => parte.type === "timeZoneName")?.value;
  if (!zona) throw new Error(`No fue posible determinar el offset de ${zonaHoraria}.`);
  return zona.replace("GMT", "");
}

export function construirFechaHoraSantiagoISO(fecha: string, hora: string): string {
  return `${fecha}T${hora}:00${obtenerOffsetZonaHoraria(fecha, TIME_ZONE_SANTIAGO)}`;
}

function convertirSantiagoASaoPaulo(fecha: string, hora: string): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE_SAO_PAULO,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(construirFechaHoraSantiagoISO(fecha, hora)));
  const parte = (tipo: string) => partes.find((item) => item.type === tipo)?.value ?? "";
  return `${parte("hour")}:${parte("minute")}`;
}

export function esFechaCalendarioValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return false;
  const [year, month, day] = fecha.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export interface HorarioSerie {
  hora: string;
  horaSaoPaulo: string;
  disponible: boolean;
}

export async function obtenerDisponibilidadSerie(
  fechas: string[],
  duracionMinutos = 60,
): Promise<HorarioSerie[]> {
  if (fechas.length === 0 || fechas.some((fecha) => !esFechaCalendarioValida(fecha))) {
    throw new Error("La serie contiene fechas inválidas.");
  }
  const { calendar, calendarId } = obtenerConfiguracion();
  const primeraFecha = fechas[0];
  const ultimaFecha = fechas[fechas.length - 1];
  const respuesta = await calendar.freebusy.query({
    requestBody: {
      timeMin: construirFechaHoraSantiagoISO(primeraFecha, "00:00"),
      timeMax: construirFechaHoraSantiagoISO(ultimaFecha, "23:59"),
      timeZone: TIME_ZONE_SANTIAGO,
      items: [{ id: calendarId }],
    },
  });
  const ocupados = respuesta.data.calendars?.[calendarId]?.busy ?? [];

  return TIME_SLOTS.map((hora) => {
    const disponible = fechas.every((fecha) => {
      const inicio = new Date(construirFechaHoraSantiagoISO(fecha, hora));
      const fin = new Date(inicio.getTime() + duracionMinutos * 60 * 1000);
      return !ocupados.some((bloque) => {
        if (!bloque.start || !bloque.end) return false;
        return inicio < new Date(bloque.end) && fin > new Date(bloque.start);
      });
    });
    return {
      hora,
      horaSaoPaulo: convertirSantiagoASaoPaulo(primeraFecha, hora),
      disponible,
    };
  });
}

export async function estaSerieDisponible(
  fechas: string[],
  hora: string,
  duracionMinutos = 60,
): Promise<boolean> {
  const horarios = await obtenerDisponibilidadSerie(fechas, duracionMinutos);
  return horarios.some((horario) => horario.hora === hora && horario.disponible);
}
