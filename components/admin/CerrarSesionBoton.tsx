"use client";

import { useRouter } from "next/navigation";
import { crearClienteNavegador } from "@/lib/supabase/cliente";

export default function CerrarSesionBoton() {
  const router = useRouter();

  async function cerrarSesion() {
    const supabase = crearClienteNavegador();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={cerrarSesion}
      className="
        inline-flex items-center justify-center
        border border-neutral-300 text-neutral-900
        px-5 py-2.5
        text-sm font-medium
        rounded-full
        transition-colors duration-200
        hover:border-neutral-900 hover:bg-neutral-50
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
      "
    >
      Cerrar sesión
    </button>
  );
}
