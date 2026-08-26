import crypto from "crypto";
import type { Reserva } from "@/lib/reservas/types";

const MONEDA_CLP_ID = 1;
const MONEDA_CLP = "CLP";
const GATEWAY_TARJETAS_POR_DEFECTO = 1;
const SESSION_TTL_SEGUNDOS = 300;

type ValorFirmable = string | number | boolean | null | ValorFirmable[] | {
  [key: string]: ValorFirmable;
};

interface RespuestaIonix<T> {
  code: string;
  message: string;
  data: T;
  signature?: string;
}

export interface OrdenCheckoutIonix {
  token: string;
  url: string;
  order_id: number;
  commerce_order: string;
}

export interface DetalleOrdenIonix {
  id: number;
  order_id?: number | string;
  commerce_order: string;
  amount: number;
  currency: { code: string; symbol?: string };
  status: string;
  authorization_id?: string;
  payed_at?: string;
  gateway?: string;
  gateway_info?: { name?: string; authorization_code?: string };
}

function obtenerConfiguracion() {
  const baseUrl = process.env.IONIX_BASE_URL;
  const jwt = process.env.IONIX_JWT;
  const secretoFirma = process.env.IONIX_SIGNATURE_SECRET;

  if (!baseUrl || !jwt || !secretoFirma) {
    throw new Error(
      "Faltan variables Ionix. Se requieren IONIX_BASE_URL, IONIX_JWT e IONIX_SIGNATURE_SECRET."
    );
  }

  return {
    baseUrl: baseUrl.replace(/\/$/, ""),
    jwt,
    secretoFirma,
  };
}

function ordenarParaFirma(valor: ValorFirmable): ValorFirmable {
  if (Array.isArray(valor)) {
    const copia = [...valor];
    if (copia.every((item) => typeof item === "string")) {
      copia.sort((a, b) => (a as string).localeCompare(b as string));
    }
    return copia.map(ordenarParaFirma);
  }

  if (valor && typeof valor === "object") {
    return Object.keys(valor)
      .sort()
      .reduce<Record<string, ValorFirmable>>((resultado, clave) => {
        resultado[clave] = ordenarParaFirma(valor[clave]);
        return resultado;
      }, {});
  }

  return valor;
}

export function firmarIonix(datos: Record<string, ValorFirmable>): string {
  const { secretoFirma } = obtenerConfiguracion();
  const ordenado = ordenarParaFirma(datos) as Record<string, ValorFirmable>;
  const mensaje = Object.keys(ordenado)
    .sort()
    .filter((clave) => clave !== "signature")
    .map((clave) => `${clave}${JSON.stringify(ordenado[clave])}`)
    .join("");

  return crypto
    .createHmac("sha256", secretoFirma)
    .update(mensaje)
    .digest("hex");
}

function gatewayId(): number {
  const valor = process.env.IONIX_CHECKOUT_GATEWAY_ID;
  if (!valor) return GATEWAY_TARJETAS_POR_DEFECTO;

  const id = Number(valor);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("IONIX_CHECKOUT_GATEWAY_ID debe ser un entero positivo.");
  }
  return id;
}

export function obtenerMontoIonix(reserva: Reserva): number {
  if (reserva.servicio !== "piano" && reserva.servicio !== "canto") {
    throw new Error("Ionix Checkout sólo está disponible para clases de piano y canto.");
  }

  const precios: Record<string, number> = {
    individual: 40000,
    mensual: 120000,
    bimensual: 200000,
  };

  const monto = precios[reserva.planId];
  if (!monto) {
    throw new Error("El pack seleccionado no tiene un precio Ionix configurado.");
  }

  return monto;
}

export async function crearOrdenCheckoutIonix(input: {
  reserva: Reserva;
  monto: number;
  commerceOrder: string;
  successUrl: string;
  failureUrl: string;
}): Promise<OrdenCheckoutIonix> {
  const { baseUrl, jwt } = obtenerConfiguracion();
  const gateway = gatewayId();
  const bodySinFirma: Record<string, ValorFirmable> = {
    title: input.reserva.planNombre,
    description: `Reserva ${input.reserva.servicio} · ${input.reserva.fecha} ${input.reserva.hora}`,
    gateway_id: gateway,
    currency_id: MONEDA_CLP_ID,
    amount: input.monto,
    customer: {
      name: input.reserva.nombre,
      email: input.reserva.email,
    },
    success_url: input.successUrl,
    failure_url: input.failureUrl,
    commerce_order: input.commerceOrder,
    commerce_reference: input.reserva.id,
    ...(gateway === 4 ? { session_ttl: SESSION_TTL_SEGUNDOS } : {}),
  };

  const body = { ...bodySinFirma, signature: firmarIonix(bodySinFirma) };
  const respuesta = await fetch(`${baseUrl}/v1/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const payload = (await respuesta.json()) as RespuestaIonix<OrdenCheckoutIonix>;
  if (!respuesta.ok || payload.code !== "1000000000" || !payload.data?.url) {
    throw new Error(payload.message || "Ionix no pudo crear la orden Checkout.");
  }

  return payload.data;
}

export async function obtenerDetalleOrdenIonix(
  orderId: number
): Promise<DetalleOrdenIonix> {
  const { baseUrl, jwt } = obtenerConfiguracion();
  const firma = firmarIonix({ id: orderId });
  const parametros = new URLSearchParams({ id: String(orderId), signature: firma });

  const respuesta = await fetch(`${baseUrl}/v1/orders/detail?${parametros}`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  const payload = (await respuesta.json()) as RespuestaIonix<DetalleOrdenIonix>;
  if (!respuesta.ok || payload.code !== "1000000000" || !payload.data) {
    throw new Error(payload.message || "Ionix no pudo obtener el detalle de la orden.");
  }

  return payload.data;
}

export function esOrdenPagadaIonix(orden: DetalleOrdenIonix): boolean {
  return orden.status === "PAID" && orden.currency?.code === MONEDA_CLP;
}
