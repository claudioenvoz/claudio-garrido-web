// lib/supabase/servidorAuth.ts
//
// Cliente de Supabase para SERVER COMPONENTS y Route Handlers que
// necesitan saber "¿quién está logueado?" a partir de las cookies de
// la petición. Distinto de lib/supabase/servidor.ts (que usa la
// service_role key para leer/escribir datos sin importar quién esté
// logueado) — este archivo es específicamente para verificar sesión.

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

export function crearClienteServidorConSesion() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options });
        },
      },
    }
  );
}

export async function obtenerSesion() {
  const supabase = crearClienteServidorConSesion();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}