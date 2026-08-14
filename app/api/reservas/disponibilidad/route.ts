// app/api/reservas/disponibilidad/route.ts
//
// Consulta la disponibilidad real de Google Calendar.
//
// La zona horaria oficial de las reservas es:
// America/Santiago
//
// IMPORTANTE:
// Los horarios que recibe y devuelve esta API son horarios de Santiago.
// Google Calendar recibe los intervalos con el offset correcto de Santiago
// para la fecha consultada.
//
// La diferencia con São Paulo NO se calcula manualmente.
// Cada zona horaria tiene sus propias reglas y el sistema las determina
// automáticamente para la fecha correspondiente.

import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

const TIME_ZONE_SANTIAGO = "America/Santiago";
const TIME_ZONE_SAO_PAULO = "America/Sao_Paulo";

const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

/**
 * Normaliza la clave privada de Google.
 *
 * Puede venir desde .env.local o Vercel:
 *
 * 1. Con saltos de línea reales.
 * 2. Con "\n" escritos literalmente.
 * 3. Con comillas exteriores.
 *
 * Normalizamos todos esos casos antes de entregarla a Google.
 */
function normalizarPrivateKey(privateKey: string): string {
  let key = privateKey.trim();

  // Elimina comillas exteriores si existen.
  if (
    key.length >= 2 &&
    key.startsWith('"') &&
    key.endsWith('"')
  ) {
    key = key.slice(1, -1);
  }

  if (
    key.length >= 2 &&
    key.startsWith("'") &&
    key.endsWith("'")
  ) {
    key = key.slice(1, -1);
  }

  // Convierte los "\n" literales en saltos de línea reales.
  key = key.replace(/\\n/g, "\n");

  // Normaliza posibles saltos de línea de Windows.
  key = key.replace(/\r\n/g, "\n");

  return key.trim();
}

/**
 * Crea el cliente autenticado de Google Calendar.
 */
function obtenerClienteGoogleCalendar() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyRaw =
    process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

  if (!email || !privateKeyRaw || !CALENDAR_ID) {
    throw new Error(
      "Faltan variables de entorno de Google Calendar. Se requieren GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY y GOOGLE_CALENDAR_ID."
    );
  }

  const privateKey = normalizarPrivateKey(privateKeyRaw);

  console.log(
    "[disponibilidad/route.ts] Google Calendar — email presente:",
    !!email
  );

  console.log(
    "[disponibilidad/route.ts] Google Calendar — calendar ID presente:",
    !!CALENDAR_ID
  );

  console.log(
    "[disponibilidad/route.ts] Google Calendar — private key válida:",
    privateKey.startsWith("-----BEGIN") &&
      privateKey.includes("-----END")
  );

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: [
      "https://www.googleapis.com/auth/calendar",
    ],
  });

  return google.calendar({
    version: "v3",
    auth,
  });
}

/**
 * Obtiene el offset UTC de una zona horaria para una fecha concreta.
 *
 * Ejemplos:
 *   Santiago puede devolver "-04:00" o "-03:00".
 *   São Paulo normalmente devuelve "-03:00".
 *
 * No usamos un offset fijo porque Chile cambia de horario durante el año.
 */
function obtenerOffsetZonaHoraria(
  fecha: string,
  zonaHoraria: string
): string {
  const referencia = new Date(`${fecha}T12:00:00Z`);

  const partes = new Intl.DateTimeFormat("en-US", {
    timeZone: zonaHoraria,
    timeZoneName: "longOffset",
  }).formatToParts(referencia);

  const zona = partes.find(
    (parte) => parte.type === "timeZoneName"
  )?.value;

  if (!zona) {
    throw new Error(
      `No fue posible determinar el offset de la zona horaria ${zonaHoraria}.`
    );
  }

  return zona.replace("GMT", "");
}

/**
 * Convierte una fecha + hora local de Santiago
 * en un ISO con su offset correspondiente.
 */
function construirFechaHoraSantiagoISO(
  fecha: string,
  hora: string
): string {
  const offset = obtenerOffsetZonaHoraria(
    fecha,
    TIME_ZONE_SANTIAGO
  );

  return `${fecha}T${hora}:00${offset}`;
}

/**
 * Convierte una fecha/hora de Santiago a la hora equivalente
 * en São Paulo.
 */
function convertirSantiagoASaoPaulo(
  fecha: string,
  hora: string
): {
  fecha: string;
  hora: string;
} {
  const isoSantiago = construirFechaHoraSantiagoISO(
    fecha,
    hora
  );

  const instante = new Date(isoSantiago);

  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE_SAO_PAULO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(instante);

  const obtenerParte = (tipo: string) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return {
    fecha: `${obtenerParte("year")}-${obtenerParte(
      "month"
    )}-${obtenerParte("day")}`,
    hora: `${obtenerParte("hour")}:${obtenerParte(
      "minute"
    )}`,
  };
}

/**
 * Verifica que la fecha tenga formato AAAA-MM-DD
 * y que realmente exista.
 */
function esFechaValida(fecha: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
    return false;
  }

  const date = new Date(`${fecha}T12:00:00Z`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const [year, month, day] = fecha.split("-").map(Number);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() + 1 === month &&
    date.getUTCDate() === day
  );
}

export async function GET(request: NextRequest) {
  const fecha = request.nextUrl.searchParams.get("fecha");

  console.log(
    `[disponibilidad/route.ts] Consulta de disponibilidad — fecha: ${fecha}`
  );

  if (!fecha) {
    return NextResponse.json(
      {
        error: 'Falta el parámetro "fecha".',
      },
      { status: 400 }
    );
  }

  if (!esFechaValida(fecha)) {
    return NextResponse.json(
      {
        error:
          'El parámetro "fecha" debe tener el formato AAAA-MM-DD y ser una fecha válida.',
      },
      { status: 400 }
    );
  }

  try {
    const calendario = obtenerClienteGoogleCalendar();

    /*
     * El día completo se construye en horario de Santiago.
     */
    const inicioDia = construirFechaHoraSantiagoISO(
      fecha,
      "00:00"
    );

    const finDia = construirFechaHoraSantiagoISO(
      fecha,
      "23:59"
    );

    console.log(
      `[disponibilidad/route.ts] Consultando Google Calendar entre ${inicioDia} y ${finDia}`
    );

    const respuesta = await calendario.freebusy.query({
      requestBody: {
        timeMin: inicioDia,
        timeMax: finDia,
        timeZone: TIME_ZONE_SANTIAGO,
        items: [
          {
            id: CALENDAR_ID!,
          },
        ],
      },
    });

    const ocupados =
      respuesta.data.calendars?.[CALENDAR_ID!]?.busy ?? [];

    console.log(
      `[disponibilidad/route.ts] Bloques ocupados encontrados: ${ocupados.length}`
    );

    const horarios = TIME_SLOTS.map((hora) => {
      /*
       * El horario de la reserva está definido en Santiago.
       */
      const inicioHorario = new Date(
        construirFechaHoraSantiagoISO(fecha, hora)
      );

      /*
       * Cada horario representa una clase de 60 minutos.
       */
      const finHorario = new Date(
        inicioHorario.getTime() + 60 * 60 * 1000
      );

      /*
       * Determinamos también la hora equivalente en São Paulo.
       */
      const saoPaulo = convertirSantiagoASaoPaulo(
        fecha,
        hora
      );

      const ocupado = ocupados.some((bloque) => {
        if (!bloque.start || !bloque.end) {
          return false;
        }

        const inicioOcupado = new Date(bloque.start);
        const finOcupado = new Date(bloque.end);

        /*
         * Detectamos cualquier superposición entre:
         *
         * horario solicitado
         *       ↓
         * [ inicioHorario -------- finHorario ]
         *
         * y un evento de Google Calendar.
         */
        return (
          inicioHorario < finOcupado &&
          finHorario > inicioOcupado
        );
      });

      return {
        hora,
        horaSaoPaulo: saoPaulo.hora,
        disponible: !ocupado,
      };
    });

    return NextResponse.json({
      fecha,
      zonaHoraria: TIME_ZONE_SANTIAGO,
      zonaHorariaUsuario: TIME_ZONE_SAO_PAULO,
      horarios,
    });
  } catch (error) {
    console.error(
      "[disponibilidad/route.ts] Error consultando Google Calendar:",
      error
    );

    return NextResponse.json(
      {
        error:
          "No fue posible consultar la disponibilidad del calendario.",
      },
      { status: 500 }
    );
  }
}