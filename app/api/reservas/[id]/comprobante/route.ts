// app/api/reservas/[id]/comprobante/route.ts
//
// POST -> recibe el comprobante de transferencia bancaria (Chile) para
// una reserva específica, lo guarda (vía lib/almacenamiento) y actualiza
// la reserva: estado -> "pendiente_revision", metodoPago -> "transferencia_chile".
//
// Solo válido si la reserva está en estado "pendiente_pago" — no se
// puede subir un comprobante para una reserva ya confirmada, rechazada
// o cancelada.

import { NextRequest, NextResponse } from "next/server";
import { obtenerPorId, actualizar } from "@/lib/reservas/repositorio";
import { guardarArchivo } from "@/lib/almacenamiento";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log(`[comprobante/route.ts] POST recibido — reservaId: ${params.id}`);

  const reserva = await obtenerPorId(params.id);

  if (!reserva) {
    console.log(`[comprobante/route.ts] Reserva ${params.id} NO encontrada — devolviendo 404`);
    return NextResponse.json(
      { error: "No existe una reserva con ese id." },
      { status: 404 }
    );
  }

  console.log(`[comprobante/route.ts] Reserva encontrada — estado actual: ${reserva.estado}`);

  if (reserva.estado !== "pendiente_pago") {
    console.log(
      `[comprobante/route.ts] Estado "${reserva.estado}" no admite comprobante — devolviendo 409`
    );
    return NextResponse.json(
      {
        error: `Esta reserva no admite un comprobante en su estado actual (${reserva.estado}).`,
      },
      { status: 409 }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
    console.log(
      `[comprobante/route.ts] formData parseado — keys:`,
      Array.from(formData.keys())
    );
  } catch (err) {
    console.log(`[comprobante/route.ts] ERROR al parsear formData:`, err);
    return NextResponse.json(
      { error: "La solicitud debe ser multipart/form-data." },
      { status: 400 }
    );
  }

  const archivo = formData.get("comprobante");

  if (!archivo || !(archivo instanceof File)) {
    console.log(
      `[comprobante/route.ts] Campo "comprobante" ausente o no es un File. Valor recibido:`,
      archivo
    );
    return NextResponse.json(
      { error: 'Falta el archivo — se espera el campo "comprobante".' },
      { status: 400 }
    );
  }

  console.log(
    `[comprobante/route.ts] Archivo recibido — nombre: ${archivo.name}, tipo: ${archivo.type}, tamaño: ${archivo.size} bytes`
  );

  const resultado = await guardarArchivo(archivo);

  console.log(`[comprobante/route.ts] guardarArchivo() -> exito: ${resultado.exito}`);

  if (!resultado.exito) {
    console.log(`[comprobante/route.ts] guardarArchivo() falló:`, resultado.error);
    return NextResponse.json({ error: resultado.error }, { status: 400 });
  }

  console.log(
    `[comprobante/route.ts] Llamando a actualizar(${reserva.id}, { estado: "pendiente_revision", ... })`
  );

  const reservaActualizada = await actualizar(reserva.id, {
    comprobanteUrl: resultado.archivo.url,
    metodoPago: "transferencia_chile",
    estado: "pendiente_revision",
  });

  console.log(
    `[comprobante/route.ts] actualizar() devolvió:`,
    reservaActualizada
      ? `estado: ${reservaActualizada.estado}`
      : "null (¡no encontró la reserva para actualizar!)"
  );

  return NextResponse.json(reservaActualizada, { status: 200 });
}
