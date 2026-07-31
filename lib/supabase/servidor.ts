// lib/supabase/servidor.ts
//
// Cliente de Supabase EXCLUSIVO para código de servidor (rutas de API,
// nunca componentes de cliente). Usa la service_role key, que tiene
// permisos totales sobre la base de datos — por eso nunca debe
// importarse desde un archivo con "use client".

import { createClient } from "@supabase/supabase-js";

const VALOR_FICTICIO_URL = "https://ficticio.supabase.co";
const VALOR_FICTICIO_KEY = "FICTICIO_SERVICE_ROLE_KEY_REEMPLAZAR";

function obtenerUrl(): string {
  const valor = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!valor) {
    console.warn(
      "[Supabase] NEXT_PUBLIC_SUPABASE_URL no está definida — usando un valor FICTICIO. " +
        "Las consultas reales van a fallar hasta que la configures en .env.local."
    );
    return VALOR_FICTICIO_URL;
  }
  return valor;
}

function obtenerServiceRoleKey(): string {
  const valor = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!valor) {
    console.warn(
      "[Supabase] SUPABASE_SERVICE_ROLE_KEY no está definida — usando un valor FICTICIO. " +
        "Las consultas reales van a fallar hasta que la configures en .env.local."
    );
    return VALOR_FICTICIO_KEY;
  }
  return valor;
}

// Instancia única, compartida por todas las rutas de servidor — evita
// crear un cliente nuevo en cada request.
export const supabaseServidor = createClient(
  obtenerUrl(),
  obtenerServiceRoleKey(),
  {
    auth: {
      persistSession: false, // no aplica en servidor, evita warnings
    },
  }
);
