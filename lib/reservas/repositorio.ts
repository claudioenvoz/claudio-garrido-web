// lib/reservas/repositorio.ts
//
// Acceso a datos de reservas — implementación con Supabase (reemplaza
// el Map en memoria, que causaba el bug de "múltiples instancias" entre
// rutas de Next.js App Router).
//
// Mismas 5 funciones exportadas de antes — ningún otro archivo del
// proyecto necesita cambiar.

import { supabaseServidor } from "@/lib/supabase/servidor";
import type { EstadoReserva, Reserva } from "./types";

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
  origen: string;
  notas_internas: string | null;
  creado_en: string;
  actualizado_en: string;
}

function filaAReserva(fila: FilaReserva): Reserva {
  return {
    id: fila.id,
    servicio: fila.servicio as Reserva["servicio"],
    planId: fila.plan_id,
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
