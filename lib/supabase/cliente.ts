// lib/supabase/cliente.ts
//
// Cliente de Supabase para el NAVEGADOR (componentes "use client").
// Usa la anon key (segura para exponer al cliente, a diferencia de la
// service_role key que solo vive en lib/supabase/servidor.ts).
//
// Se usa exclusivamente para autenticación (login/logout) — el panel de
// administración NO consulta la tabla `reservas` directamente desde el
// navegador con este cliente; lo hace a través de nuestras propias rutas
// de API, protegidas server-side.

import { createBrowserClient } from "@supabase/ssr";

export function crearClienteNavegador() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}