import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenerPorId } from "@/lib/reservas/repositorio";
import EstadoBadge from "@/components/admin/EstadoBadge";
import AccionesReserva from "@/components/admin/AccionesReserva";

export const dynamic = "force-dynamic";

interface DetalleReservaProps {
  params: { id: string };
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 border-b border-neutral-100 last:border-0">
      <span className="text-sm text-neutral-500 shrink-0">{etiqueta}</span>
      <span className="text-sm text-neutral-900 text-right">{valor}</span>
    </div>
  );
}

export default async function DetalleReservaPage({ params }: DetalleReservaProps) {
  const reserva = await obtenerPorId(params.id);

  if (!reserva) {
    notFound();
  }

  const esComprobanteImagen = reserva.comprobanteUrl?.startsWith("data:image/");
  const esComprobantePdf = reserva.comprobanteUrl?.startsWith("data:application/pdf");

  return (
    <main className="w-full">
      <div className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
        <Link
          href="/admin"
          className="
            inline-flex items-center gap-2 text-sm font-medium text-neutral-500 mb-8
            transition-colors duration-200
            hover:text-neutral-900
          "
        >
          ← Volver al listado
        </Link>

        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl md:text-3xl font-medium text-neutral-900 mb-1">
              {reserva.nombre}
            </h1>
            <p className="text-sm text-neutral-500">{reserva.id}</p>
          </div>
          <EstadoBadge estado={reserva.estado} />
        </div>

        <div className="flex flex-col gap-8">
          <section className="rounded-2xl border border-neutral-200 p-6 md:p-8">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
              Datos del alumno
            </h2>
            <Fila etiqueta="Nombre" valor={reserva.nombre} />
            <Fila etiqueta="Email" valor={reserva.email} />
            <Fila etiqueta="WhatsApp" valor={reserva.whatsapp} />
            <Fila etiqueta="País" valor={reserva.pais} />
            {reserva.comentarios && (
              <Fila etiqueta="Comentarios" valor={reserva.comentarios} />
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 p-6 md:p-8">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
              Detalle de la reserva
            </h2>
            <Fila etiqueta="Servicio" valor={reserva.servicio} />
            <Fila etiqueta="Plan" valor={reserva.planNombre} />
            <Fila etiqueta="Precio" valor={reserva.planPrecio} />
            <Fila
              etiqueta="Fecha"
              valor={new Date(`${reserva.fecha}T00:00:00`).toLocaleDateString("es-CL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            />
            <Fila etiqueta="Hora" valor={reserva.hora} />
            <Fila etiqueta="Duración" valor={`${reserva.duracionMinutos} minutos`} />
            <Fila etiqueta="Origen" valor={reserva.origen} />
          </section>

          <section className="rounded-2xl border border-neutral-200 p-6 md:p-8">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
              Pago
            </h2>
            <Fila etiqueta="Método de pago" valor={reserva.metodoPago ?? "—"} />
            <Fila
              etiqueta="Hold expira"
              valor={
                reserva.holdExpiraEn
                  ? new Date(reserva.holdExpiraEn).toLocaleString("es-CL")
                  : "—"
              }
            />
            {reserva.ionixCustomerId && (
              <Fila etiqueta="Ionix Customer ID" valor={reserva.ionixCustomerId} />
            )}
            {reserva.ionixPaymentMethodId && (
              <Fila etiqueta="Ionix Payment Method ID" valor={reserva.ionixPaymentMethodId} />
            )}
            {reserva.pagoExternoId && (
              <Fila etiqueta="ID de pago externo" valor={reserva.pagoExternoId} />
            )}

            {reserva.comprobanteUrl && (
              <div className="mt-5 pt-5 border-t border-neutral-100">
                <p className="text-sm text-neutral-500 mb-3">Comprobante</p>
                {esComprobanteImagen && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={reserva.comprobanteUrl}
                    alt="Comprobante de transferencia"
                    className="max-w-full rounded-xl border border-neutral-200"
                  />
                )}
                {esComprobantePdf && (
                  <a
                    href={reserva.comprobanteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      inline-flex items-center justify-center
                      border border-neutral-300 text-neutral-900
                      px-5 py-2.5
                      text-sm font-medium
                      rounded-full
                      transition-colors duration-200
                      hover:border-neutral-900 hover:bg-neutral-50
                    "
                  >
                    Abrir comprobante (PDF)
                  </a>
                )}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-neutral-200 p-6 md:p-8">
            <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
              Metadata
            </h2>
            <Fila etiqueta="Creada" valor={new Date(reserva.creadoEn).toLocaleString("es-CL")} />
            <Fila
              etiqueta="Última actualización"
              valor={new Date(reserva.actualizadoEn).toLocaleString("es-CL")}
            />
          </section>

          <AccionesReserva reservaId={reserva.id} estadoActual={reserva.estado} />
        </div>
      </div>
    </main>
  );
}
