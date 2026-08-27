// lib/reservas/repositorio.ts
//
// Acceso a datos de reservas — implementación con Supabase (reemplaza
// el Map en memoria, que causaba el bug de "múltiples instancias" entre
// rutas de Next.js App Router).
//
// Mismas 5 funciones exportadas de antes — ningún otro archivo del
// proyecto necesita cambiar.

import { supabaseServidor } from "@/lib/supabase/servidor";
import type { EstadoReserva, Reserva, ReservaClase } from "./types";

// ---------- Mapeo entre las columnas snake_case de la tabla y el tipo
// Reserva (camelCase) que usa el resto del proyecto ----------

interface FilaReserva {
  id: string;
  servicio: string;
  plan_id: string;
  plan_nombre: string;
  plan_precio: string;
  fecha: string;
  hora: string;
  duracion_minutos: number;
  nombre: string;
  email: string;
  whatsapp: string;
  pais: string;
  comentarios: string | null;
  metodo_pago: string | null;
  comprobante_url: string | null;
  pago_externo_id: string | null;
  estado: string;
  hold_expira_en: string | null;
  reagendada_hacia_id: string | null;
  google_calendar_event_id: string | null;
  ionix_customer_id: string | null;
  ionix_payment_method_id: string | null;
  ionix_order_id: number | null;
  ionix_commerce_order: string | null;
  ionix_estado: string | null;
  ionix_checkout_url: string | null;
  ionix_monto: number | null;
  ionix_autorizacion_id: string | null;
  ionix_gateway: string | null;
  ionix_pagado_en: string | null;
  ionix_intento: number | null;
  origen: string;
  notas_internas: string | null;
  creado_en: string;
  actualizado_en: string;
}

interface FilaReservaClase {
  id: string;
  reserva_id: string;
  numero_clase: number;
  fecha: string;
  hora: string;
  duracion_minutos: number;
  google_calendar_event_id: string | null;
  estado_sincronizacion: ReservaClase["estadoSincronizacion"];
  creado_en: string;
  actualizado_en: string;
}

function filaAReservaClase(fila: FilaReservaClase): ReservaClase {
  return {
    id: fila.id,
    reservaId: fila.reserva_id,
    numeroClase: fila.numero_clase,
    fecha: fila.fecha,
    hora: fila.hora.slice(0, 5),
    duracionMinutos: fila.duracion_minutos,
    googleCalendarEventId: fila.google_calendar_event_id,
    estadoSincronizacion: fila.estado_sincronizacion,
    creadoEn: fila.creado_en,
    actualizadoEn: fila.actualizado_en,
  };
}

function filaAReserva(fila: FilaReserva): Reserva {
  return {
    id: fila.id,
    servicio: fila.servicio as Reserva["servicio"],
    planId: fila.plan_id as Reserva["planId"],
    planNombre: fila.plan_nombre,
    planPrecio: fila.plan_precio,
    fecha: fila.fecha,
    hora: fila.hora,
    duracionMinutos: fila.duracion_minutos,
    nombre: fila.nombre,
    email: fila.email,
    whatsapp: fila.whatsapp,
    pais: fila.pais,
    comentarios: fila.comentarios ?? undefined,
    metodoPago: fila.metodo_pago as Reserva["metodoPago"],
    comprobanteUrl: fila.comprobante_url ?? undefined,
    pagoExternoId: fila.pago_externo_id ?? undefined,
    estado: fila.estado as EstadoReserva,
    holdExpiraEn: fila.hold_expira_en,
    reagendadaHaciaId: fila.reagendada_hacia_id ?? undefined,
    googleCalendarEventId: fila.google_calendar_event_id,
    ionixCustomerId: fila.ionix_customer_id ?? undefined,
    ionixPaymentMethodId: fila.ionix_payment_method_id ?? undefined,
    ionixOrderId: fila.ionix_order_id ?? undefined,
    ionixCommerceOrder: fila.ionix_commerce_order ?? undefined,
    ionixEstado: fila.ionix_estado ?? undefined,
    ionixCheckoutUrl: fila.ionix_checkout_url ?? undefined,
    ionixMonto: fila.ionix_monto ?? undefined,
    ionixAutorizacionId: fila.ionix_autorizacion_id ?? undefined,
    ionixGateway: fila.ionix_gateway ?? undefined,
    ionixPagadoEn: fila.ionix_pagado_en ?? undefined,
    ionixIntento: fila.ionix_intento ?? 0,
    origen: fila.origen,
    notasInternas: fila.notas_internas ?? undefined,
    creadoEn: fila.creado_en,
    actualizadoEn: fila.actualizado_en,
  };
}

function reservaAFila(reserva: Reserva): FilaReserva {
  return {
    id: reserva.id,
    servicio: reserva.servicio,
    plan_id: reserva.planId,
    plan_nombre: reserva.planNombre,
    plan_precio: reserva.planPrecio,
    fecha: reserva.fecha,
    hora: reserva.hora,
    duracion_minutos: reserva.duracionMinutos,
    nombre: reserva.nombre,
    email: reserva.email,
    whatsapp: reserva.whatsapp,
    pais: reserva.pais,
    comentarios: reserva.comentarios ?? null,
    metodo_pago: reserva.metodoPago ?? null,
    comprobante_url: reserva.comprobanteUrl ?? null,
    pago_externo_id: reserva.pagoExternoId ?? null,
    estado: reserva.estado,
    hold_expira_en: reserva.holdExpiraEn,
    reagendada_hacia_id: reserva.reagendadaHaciaId ?? null,
    google_calendar_event_id: reserva.googleCalendarEventId,
    ionix_customer_id: reserva.ionixCustomerId ?? null,
    ionix_payment_method_id: reserva.ionixPaymentMethodId ?? null,
    ionix_order_id: reserva.ionixOrderId ?? null,
    ionix_commerce_order: reserva.ionixCommerceOrder ?? null,
    ionix_estado: reserva.ionixEstado ?? null,
    ionix_checkout_url: reserva.ionixCheckoutUrl ?? null,
    ionix_monto: reserva.ionixMonto ?? null,
    ionix_autorizacion_id: reserva.ionixAutorizacionId ?? null,
    ionix_gateway: reserva.ionixGateway ?? null,
    ionix_pagado_en: reserva.ionixPagadoEn ?? null,
    ionix_intento: reserva.ionixIntento,
    origen: reserva.origen,
    notas_internas: reserva.notasInternas ?? null,
    creado_en: reserva.creadoEn,
    actualizado_en: reserva.actualizadoEn,
  };
}

// ---------- Funciones públicas (misma firma que la versión en memoria) ----------

export async function crear(reserva: Reserva): Promise<Reserva> {
  const { data, error } = await supabaseServidor
    .from("reservas")
    .insert(reservaAFila(reserva))
    .select()
    .single();

  if (error) {
    throw new Error(`[Supabase] Error al crear la reserva: ${error.message}`);
  }

  return filaAReserva(data as FilaReserva);
}

export async function crearConClases(
  reserva: Reserva,
  clases: ReservaClase[],
): Promise<Reserva> {
  const filasClases = clases.map((clase) => ({
    id: clase.id,
    numero_clase: clase.numeroClase,
    fecha: clase.fecha,
    hora: clase.hora,
    duracion_minutos: clase.duracionMinutos,
    creado_en: clase.creadoEn,
    actualizado_en: clase.actualizadoEn,
  }));

  const { data, error } = await supabaseServidor.rpc("crear_reserva_con_clases", {
    p_reserva: reservaAFila(reserva),
    p_clases: filasClases,
  });

  if (error) {
    throw new Error(`[Supabase] Error al crear reserva recurrente: ${error.message}`);
  }

  const fila = Array.isArray(data) ? data[0] : data;
  return filaAReserva(fila as FilaReserva);
}

export async function listarClases(reservaId: string): Promise<ReservaClase[]> {
  const { data, error } = await supabaseServidor
    .from("reserva_clases")
    .select()
    .eq("reserva_id", reservaId)
    .order("numero_clase", { ascending: true });

  if (error) throw new Error(`[Supabase] Error al listar clases: ${error.message}`);
  return (data as FilaReservaClase[]).map(filaAReservaClase);
}

export async function actualizarClase(
  id: string,
  cambios: Partial<Pick<ReservaClase, "googleCalendarEventId" | "estadoSincronizacion">>,
): Promise<ReservaClase | null> {
  const fila: Record<string, unknown> = { actualizado_en: new Date().toISOString() };
  if ("googleCalendarEventId" in cambios) fila.google_calendar_event_id = cambios.googleCalendarEventId;
  if (cambios.estadoSincronizacion) fila.estado_sincronizacion = cambios.estadoSincronizacion;

  const { data, error } = await supabaseServidor
    .from("reserva_clases")
    .update(fila)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) throw new Error(`[Supabase] Error al actualizar clase: ${error.message}`);
  return data ? filaAReservaClase(data as FilaReservaClase) : null;
}

export async function reclamarSincronizacionClase(id: string): Promise<ReservaClase | null> {
  const { data, error } = await supabaseServidor
    .from("reserva_clases")
    .update({ estado_sincronizacion: "creando", actualizado_en: new Date().toISOString() })
    .eq("id", id)
    .is("google_calendar_event_id", null)
    .in("estado_sincronizacion", ["pendiente", "error"])
    .select()
    .maybeSingle();

  if (error) throw new Error(`[Supabase] Error al reclamar clase: ${error.message}`);
  return data ? filaAReservaClase(data as FilaReservaClase) : null;
}

export async function obtenerPorId(id: string): Promise<Reserva | null> {
  const { data, error } = await supabaseServidor
    .from("reservas")
    .select()
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`[Supabase] Error al obtener la reserva ${id}: ${error.message}`);
  }

  return data ? filaAReserva(data as FilaReserva) : null;
}

export async function obtenerPorIonixOrderId(
  orderId: number
): Promise<Reserva | null> {
  const { data, error } = await supabaseServidor
    .from("reservas")
    .select()
    .eq("ionix_order_id", orderId)
    .maybeSingle();

  if (error) {
    throw new Error(`[Supabase] Error al obtener reserva por orden Ionix: ${error.message}`);
  }

  return data ? filaAReserva(data as FilaReserva) : null;
}

export interface FiltrosListado {
  estado?: EstadoReserva;
  servicio?: Reserva["servicio"];
  fecha?: string;
}

export async function listar(filtros: FiltrosListado = {}): Promise<Reserva[]> {
  let consulta = supabaseServidor.from("reservas").select();

  if (filtros.estado) consulta = consulta.eq("estado", filtros.estado);
  if (filtros.servicio) consulta = consulta.eq("servicio", filtros.servicio);
  if (filtros.fecha) consulta = consulta.eq("fecha", filtros.fecha);

  const { data, error } = await consulta.order("creado_en", { ascending: true });

  if (error) {
    throw new Error(`[Supabase] Error al listar reservas: ${error.message}`);
  }

  return (data as FilaReserva[]).map(filaAReserva);
}

export async function actualizar(
  id: string,
  cambios: Partial<Reserva>
): Promise<Reserva | null> {
  const existente = await obtenerPorId(id);
  if (!existente) return null;

  const reservaCompleta: Reserva = {
    ...existente,
    ...cambios,
    id: existente.id, // el id nunca se sobrescribe
    actualizadoEn: new Date().toISOString(),
  };

  const { data, error } = await supabaseServidor
    .from("reservas")
    .update(reservaAFila(reservaCompleta))
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(`[Supabase] Error al actualizar la reserva ${id}: ${error.message}`);
  }

  return filaAReserva(data as FilaReserva);
}

/**
 * Confirma un pago Ionix sólo si la reserva sigue pendiente. El filtro de
 * estado evita que reintentos del webhook confirmen dos veces la misma reserva.
 */
export async function confirmarPagoIonix(
  id: string,
  cambios: Pick<
    Reserva,
    | "pagoExternoId"
    | "metodoPago"
    | "ionixEstado"
    | "ionixAutorizacionId"
    | "ionixGateway"
    | "ionixPagadoEn"
  >
): Promise<Reserva | null> {
  const actualizadoEn = new Date().toISOString();

  const { data, error } = await supabaseServidor
    .from("reservas")
    .update({
      pago_externo_id: cambios.pagoExternoId,
      metodo_pago: cambios.metodoPago,
      ionix_estado: cambios.ionixEstado,
      ionix_autorizacion_id: cambios.ionixAutorizacionId ?? null,
      ionix_gateway: cambios.ionixGateway ?? null,
      ionix_pagado_en: cambios.ionixPagadoEn ?? null,
      estado: "confirmada",
      actualizado_en: actualizadoEn,
    })
    .eq("id", id)
    .eq("estado", "pendiente_pago")
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`[Supabase] Error al confirmar pago Ionix: ${error.message}`);
  }

  return data ? filaAReserva(data as FilaReserva) : null;
}

/**
 * Reclama atómicamente la creación del evento de Calendar. Sólo la primera
 * llamada que encuentre el campo nulo obtiene la reserva; las concurrentes
 * reciben null y no crean un segundo evento.
 */
export async function reclamarCreacionEventoCalendario(
  id: string
): Promise<Reserva | null> {
  const { data, error } = await supabaseServidor
    .from("reservas")
    .update({ google_calendar_event_id: "__IONIX_CALENDAR_PENDING__" })
    .eq("id", id)
    .is("google_calendar_event_id", null)
    .select()
    .maybeSingle();

  if (error) {
    throw new Error(`[Supabase] Error al reclamar evento de Calendar: ${error.message}`);
  }

  return data ? filaAReserva(data as FilaReserva) : null;
}

// Utilidad exclusiva para pruebas locales — vacía todas las reservas.
export async function limpiarTodoSoloParaPruebas(): Promise<void> {
  const { error } = await supabaseServidor
    .from("reservas")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // condición que siempre es verdadera

  if (error) {
    throw new Error(`[Supabase] Error al limpiar reservas: ${error.message}`);
  }
}
