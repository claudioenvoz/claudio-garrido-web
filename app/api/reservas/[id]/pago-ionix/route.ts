import { NextRequest, NextResponse } from "next/server";
import { crearOrdenCheckoutIonix, obtenerMontoIonix } from "@/lib/integraciones/ionix/checkout";
import { actualizar, obtenerPorId } from "@/lib/reservas/repositorio";

function esChileOBrasil(pais: string): boolean {
  const normalizado = pais
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return ["chile", "cl", "brasil", "brazil", "br"].includes(normalizado);
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const reserva = await obtenerPorId(params.id);
    if (!reserva) {
      return NextResponse.json({ error: "No existe una reserva con ese id." }, { status: 404 });
    }

    if (esChileOBrasil(reserva.pais)) {
      return NextResponse.json({ error: "Esta reserva utiliza transferencia bancaria." }, { status: 409 });
    }

    if (reserva.estado !== "pendiente_pago") {
      return NextResponse.json(
        { error: "Esta reserva no admite un nuevo pago Ionix en su estado actual." },
        { status: 409 }
      );
    }

    if (reserva.holdExpiraEn && new Date(reserva.holdExpiraEn) < new Date()) {
      return NextResponse.json({ error: "El plazo de esta reserva ya venció." }, { status: 409 });
    }

    // Durante la vigencia del Checkout reutilizamos la misma URL para evitar
    // crear dos órdenes cobrables por doble clic.
    const ordenPendienteVigente =
      reserva.ionixEstado === "PENDING" &&
      reserva.ionixCheckoutUrl &&
      Date.now() - new Date(reserva.actualizadoEn).getTime() < 5 * 60 * 1000;

    if (ordenPendienteVigente) {
      return NextResponse.json({ url: reserva.ionixCheckoutUrl });
    }

    const monto = obtenerMontoIonix(reserva);
    const intento = reserva.ionixIntento + 1;
    const commerceOrder = `res-${reserva.id}-${intento}`;
    const origen = process.env.APP_URL || request.nextUrl.origin;
    const resultadoUrl = new URL("/pago/ionix/resultado", origen);
    resultadoUrl.searchParams.set("reserva", reserva.id);

    const orden = await crearOrdenCheckoutIonix({
      reserva,
      monto,
      commerceOrder,
      successUrl: `${resultadoUrl.toString()}&resultado=success`,
      failureUrl: `${resultadoUrl.toString()}&resultado=failure`,
    });

    const actualizada = await actualizar(reserva.id, {
      metodoPago: "ionix_internacional",
      pagoExternoId: String(orden.order_id),
      ionixOrderId: orden.order_id,
      ionixCommerceOrder: commerceOrder,
      ionixEstado: "PENDING",
      ionixCheckoutUrl: orden.url,
      ionixMonto: monto,
      ionixIntento: intento,
    });

    if (!actualizada) {
      return NextResponse.json({ error: "No fue posible guardar la orden Ionix." }, { status: 500 });
    }

    return NextResponse.json({ url: orden.url });
  } catch (error) {
    console.error("[Ionix] Error al iniciar Checkout:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "No fue posible iniciar el pago Ionix." },
      { status: 500 }
    );
  }
}
