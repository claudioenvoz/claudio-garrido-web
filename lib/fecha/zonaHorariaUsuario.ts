export const ZONA_HORARIA_CANONICA = "America/Santiago";

export function detectarZonaHorariaUsuario(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || ZONA_HORARIA_CANONICA;
  } catch {
    return ZONA_HORARIA_CANONICA;
  }
}

export function formatearHoraEnZona(inicio: string, zonaHoraria: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: zonaHoraria,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(inicio));
}

export function formatearFechaHoraEnZona(inicio: string, zonaHoraria: string): string {
  return new Intl.DateTimeFormat("es-CL", {
    timeZone: zonaHoraria,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(inicio));
}

function corregirNombreZonaHoraria(nombre: string): string {
  return nombre === "Sao Paulo" ? "São Paulo" : nombre;
}

export function obtenerNombreZonaHoraria(zonaHoraria: string): string {
  try {
    const partes = new Intl.DateTimeFormat("es-CL", {
      timeZone: zonaHoraria,
      timeZoneName: "shortGeneric",
    }).formatToParts(new Date());
    const nombre = partes.find((parte) => parte.type === "timeZoneName")?.value;
    const ubicacion = nombre?.match(/^hora (?:de|del|de la) (.+)$/i)?.[1];
    if (ubicacion) return corregirNombreZonaHoraria(ubicacion);
  } catch {
    // Si Intl no ofrece un nombre localizado, usamos la ciudad de la zona IANA.
  }

  const ciudad = zonaHoraria.split("/").at(-1)?.replaceAll("_", " ") ?? zonaHoraria;
  return corregirNombreZonaHoraria(ciudad);
}
