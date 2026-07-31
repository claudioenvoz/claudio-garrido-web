// lib/almacenamiento/index.ts
//
// Almacenamiento de archivos vía Supabase Storage (bucket "comprobantes",
// público). Reemplaza la versión anterior que guardaba base64 en memoria.

import { supabaseServidor } from "@/lib/supabase/servidor";

export const TAMANO_MAXIMO_BYTES = 5 * 1024 * 1024;

export const TIPOS_PERMITIDOS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

const BUCKET = "comprobantes";

export interface ArchivoGuardado {
  url: string;
  nombreArchivo: string;
  tipoMime: string;
  tamanoBytes: number;
}

export interface ResultadoGuardarArchivo {
  exito: true;
  archivo: ArchivoGuardado;
}

export interface ErrorGuardarArchivo {
  exito: false;
  error: string;
}

export async function guardarArchivo(
  archivo: File
): Promise<ResultadoGuardarArchivo | ErrorGuardarArchivo> {
  if (!TIPOS_PERMITIDOS.includes(archivo.type as (typeof TIPOS_PERMITIDOS)[number])) {
    return {
      exito: false,
      error: `Tipo de archivo no permitido (${archivo.type}). Solo se aceptan: ${TIPOS_PERMITIDOS.join(", ")}.`,
    };
  }

  if (archivo.size > TAMANO_MAXIMO_BYTES) {
    return {
      exito: false,
      error: `El archivo supera el tamaño máximo permitido (${TAMANO_MAXIMO_BYTES / 1024 / 1024}MB).`,
    };
  }

  const bytes = Buffer.from(await archivo.arrayBuffer());
  const ruta = `${crypto.randomUUID()}-${archivo.name}`;

  const { error: errorSubida } = await supabaseServidor.storage
    .from(BUCKET)
    .upload(ruta, bytes, { contentType: archivo.type });

  if (errorSubida) {
    return { exito: false, error: `Error al subir el archivo: ${errorSubida.message}` };
  }

  const { data } = supabaseServidor.storage.from(BUCKET).getPublicUrl(ruta);

  return {
    exito: true,
    archivo: {
      url: data.publicUrl,
      nombreArchivo: archivo.name,
      tipoMime: archivo.type,
      tamanoBytes: archivo.size,
    },
  };
}