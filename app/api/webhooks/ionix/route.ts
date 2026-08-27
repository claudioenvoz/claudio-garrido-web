import { NextRequest, NextResponse } from "next/server";
import { esOrdenPagadaIonix, obtenerDetalleOrdenIonix } from "@/lib/integraciones/ionix/checkout";
import {
  actualizar,
  confirmarPagoIonix,
  obtenerPorIonixOrderId,
} from "@/lib/reservas/repositorio";
import { crearEventosPendientes } from "@/lib/reservas/sincronizarCalendario";

interface WebhookIonix {
  type?: string;
  order_id?: string | number;
  status?: string;
}

export async function POST(request: NextRequest) {
  try {
    const evento = (await request.json()) as WebhookIonix;
    const orderId = Number(evento.order_id);

    if (!Number.isInteger(orderId) || orderId <= 0) {
      return NextResponse.json({ error: "Webhook Ionix inválido: falta order_id." }, { status: 400 });
    }

    const reserva = await obtenerPorIonixOrderId(orderId);

    if (!reserva) {
      return NextResponse.json({ error: "No existe una reserva para esta orden Ionix." }, { status: 404 });
    }

    const orden = await obtenerDetalleOrdenIonix(orderId);
    const coincide =
      orden.id === orderId &&
      orden.commerce_order === reserva.ionixCommerceOrder &&
      orden.amount === reserva.ionixMonto &&
      orden.currency?.code === "CLP";

    if (!coincide) {
      console.error("[Ionix] La orden no coincide con la reserva.", { orderId, reservaId: reserva.id });
      return NextResponse.json({ error: "La orden Ionix no coincide con la reserva." }, { status: 409 });
    }

    if (evento.type === "order.refund" || orden.status === "REFUNDED") {
      await actualizar(reserva.id, { ionixEstado: "REFUNDED" });
      return NextResponse.json({ ok: true });
    }

    // Sólo este evento puede confirmar una reserva. El detalle server-to-server
    // sigue siendo la fuente de verdad para estado, monto y correspondencia.
    if (evento.type !== "order.status" || evento.status !== "PAID") {
      await actualizar(reserva.id, { ionixEstado: orden.status });
      return NextResponse.json({ ok: true });
    }

    if (!esOrdenPagadaIonix(orden)) {
      await actualizar(reserva.id, { ionixEstado: orden.status });
      return NextResponse.json({ ok: true });
    }

    let reservaConfirmada = reserva;
    if (reserva.estado === "pendiente_pago") {
      const confirmada = await confirmarPagoIonix(reserva.id, {
        metodoPago: "ionix_internacional",
        pagoExternoId: String(orderId),
        ionixEstado: "PAID",
        ionixAutorizacionId:
          orden.authorization_id ?? orden.gateway_info?.authorization_code,
        ionixGateway: orden.gateway ?? orden.gateway_info?.name,
        ionixPagadoEn: orden.payed_at ?? new Date().toISOString(),
      });

      if (!confirmada) {
        return NextResponse.json({ error: "La reserva no pudo confirmarse." }, { status: 409 });
      }
      reservaConfirmada = confirmada;
    }

    if (reservaConfirmada.estado !== "confirmada") {
      return NextResponse.json({ error: "La reserva no está en un estado confirmable." }, { status: 409 });
    }

    await crearEventosPendientes(reservaConfirmada);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Ionix] Error procesando webhook:", error);
    return NextResponse.json({ error: "No fue posible procesar el webhook Ionix." }, { status: 500 });
  }
}
