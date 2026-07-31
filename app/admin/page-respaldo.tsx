import { obtenerSesion } from "@/lib/supabase/servidorAuth";
import CerrarSesionBoton from "@/components/admin/CerrarSesionBoton";

export default async function AdminPage() {
  const sesion = await obtenerSesion();

  return (
    <main className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-center justify-between mb-14">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-1">
              Panel de Administración
            </h1>
            <p className="text-sm text-neutral-500">
              Sesión iniciada como {sesion?.user.email}
            </p>
          </div>
          <CerrarSesionBoton />
        </div>

        <div className="rounded-2xl border border-neutral-200 p-8 text-center">
          <p className="text-base text-neutral-600">
            El listado de reservas se agrega en el siguiente módulo.
          </p>
        </div>
      </div>
    </main>
  );
}
