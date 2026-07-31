import { obtenerSesion } from "@/lib/supabase/servidorAuth";
import { listar, type FiltrosListado } from "@/lib/reservas/repositorio";
import type { EstadoReserva, Servicio } from "@/lib/reservas/types";
import CerrarSesionBoton from "@/components/admin/CerrarSesionBoton";
import EstadoBadge from "@/components/admin/EstadoBadge";

const ESTADOS: EstadoReserva[] = [
  "pendiente_pago",
  "pendiente_revision",
  "confirmada",
  "rechazada",
  "cancelada",
  "reagendada",
  "expirada",
  "completada",
];

const SERVICIOS: Servicio[] = ["canto", "piano", "piano-funcional", "masterclass"];

interface AdminPageProps {
  searchParams: {
    estado?: string;
    servicio?: string;
    fecha?: string;
  };
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const sesion = await obtenerSesion();

  const filtros: FiltrosListado = {};
  if (searchParams.estado) filtros.estado = searchParams.estado as EstadoReserva;
  if (searchParams.servicio) filtros.servicio = searchParams.servicio as Servicio;
  if (searchParams.fecha) filtros.fecha = searchParams.fecha;

  const reservas = await listar(filtros);

  return (
    <main className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="flex items-center justify-between mb-10">
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

        {/* Filtros — formulario GET plano, sin JS, navega con query params */}
        <form
          method="GET"
          className="flex flex-wrap items-end gap-4 mb-8 rounded-2xl border border-neutral-200 p-6"
        >
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Estado
            </label>
            <select
              name="estado"
              defaultValue={searchParams.estado ?? ""}
              className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900"
            >
              <option value="">Todos</option>
              {ESTADOS.map((estado) => (
                <option key={estado} value={estado}>
                  {estado}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Servicio
            </label>
            <select
              name="servicio"
              defaultValue={searchParams.servicio ?? ""}
              className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900"
            >
              <option value="">Todos</option>
              {SERVICIOS.map((servicio) => (
                <option key={servicio} value={servicio}>
                  {servicio}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Fecha
            </label>
            <input
              type="date"
              name="fecha"
              defaultValue={searchParams.fecha ?? ""}
              className="rounded-xl border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900"
            />
          </div>

          <button
            type="submit"
            className="
              inline-flex items-center justify-center
              bg-neutral-900 text-white
              px-6 py-2.5
              text-sm font-medium
              rounded-full
              transition-colors duration-200
              hover:bg-neutral-800
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
            "
          >
            Filtrar
          </button>

          {(searchParams.estado || searchParams.servicio || searchParams.fecha) && (
            <a
              href="/admin"
              className="
                inline-flex items-center justify-center
                text-sm font-medium text-neutral-500
                transition-colors duration-200
                hover:text-neutral-900
              "
            >
              Limpiar filtros
            </a>
          )}
        </form>

        {/* Tabla de reservas */}
        {reservas.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 p-12 text-center">
            <p className="text-base text-neutral-500">
              No hay reservas que coincidan con estos filtros.
            </p>
          </div>
        ) : (
          <div className="rounded-2xl border border-neutral-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50">
                  <th className="text-left font-medium text-neutral-500 px-5 py-3">Fecha</th>
                  <th className="text-left font-medium text-neutral-500 px-5 py-3">Hora</th>
                  <th className="text-left font-medium text-neutral-500 px-5 py-3">Servicio</th>
                  <th className="text-left font-medium text-neutral-500 px-5 py-3">Plan</th>
                  <th className="text-left font-medium text-neutral-500 px-5 py-3">Alumno</th>
                  <th className="text-left font-medium text-neutral-500 px-5 py-3">Método de pago</th>
                  <th className="text-left font-medium text-neutral-500 px-5 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {reservas.map((reserva) => (
                  <tr key={reserva.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-5 py-4 text-neutral-900">
                      {new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString("es-CL", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-4 text-neutral-900">{reserva.hora}</td>
                    <td className="px-5 py-4 text-neutral-600">{reserva.servicio}</td>
                    <td className="px-5 py-4 text-neutral-600">{reserva.planNombre}</td>
                    <td className="px-5 py-4 text-neutral-900">
                      {reserva.nombre}
                      <br />
                      <span className="text-neutral-500 text-xs">{reserva.email}</span>
                    </td>
                    <td className="px-5 py-4 text-neutral-600">
                      {reserva.metodoPago ?? "—"}
                    </td>
                    <td className="px-5 py-4">
                      <EstadoBadge estado={reserva.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
