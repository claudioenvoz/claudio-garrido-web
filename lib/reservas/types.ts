// lib/reservas/types.ts
// Tipos compartidos del sistema de reservas. Sin lógica, solo contratos.

export type Servicio = "canto" | "piano" | "piano-funcional" | "masterclass";

export type MetodoPago = "transferencia_chile" | "ionix_internacional";

export type EstadoReserva =
  | "pendiente_pago"
  | "pendiente_revision"
  | "confirmada"
  | "rechazada"
  | "cancelada"
  | "reagendada"
  | "expirada"
  | "completada";

export interface Reserva {
  id: string;

  // Servicio y plan
  servicio: Servicio;
  planId: string;
  planNombre: string;
  planPrecio: string;

  // Fecha y hora
  fecha: string; // "2026-08-14"
  hora: string; // "10:00"
  duracionMinutos: number;

  // Datos del alumno
  nombre: string;
  email: string;
  whatsapp: string;
  pais: string;
  comentarios?: string;

  // Pago
  metodoPago: MetodoPago | null;
  comprobanteUrl?: string;
  pagoExternoId?: string;
  ionixCustomerId?: string;
  ionixPaymentMethodId?: string;

  // Estado
  estado: EstadoReserva;
  holdExpiraEn: string | null;

  // Reagendamiento (solo si estado = "reagendada")
  reagendadaHaciaId?: string;

  // Integraciones futuras
  googleCalendarEventId: string | null;

  // Metadata
  origen: string;
  notasInternas?: string;
  creadoEn: string;
  actualizadoEn: string;
}

// Datos que llegan del frontend al crear una reserva.
// No incluye id, estado, timestamps: eso lo asigna el backend.
export interface CrearReservaInput {
  servicio: Servicio;
  planId: string;
  planNombre: string;
  planPrecio: string;
  fecha: string;
  hora: string;
  duracionMinutos: number;
  nombre: string;
  email: string;
  whatsapp: string;
  pais: string;
  comentarios?: string;
  origen: string;
}
