// components/admin/EstadoBadge.tsx
//
// Pequeña insignia de color por estado de reserva. Único lugar del
// proyecto que introduce color más allá de la paleta neutra — decisión
// puntual para el Panel de Administración (herramienta interna), no
// aplica a la Landing pública.

import type { EstadoReserva } from "@/lib/reservas/types";

const ESTILOS_POR_ESTADO: Record<EstadoReserva, string> = {
  pendiente_pago: "bg-amber-50 text-amber-700",
  pendiente_revision: "bg-amber-50 text-amber-700",
  confirmada: "bg-emerald-50 text-emerald-700",
  completada: "bg-emerald-50 text-emerald-700",
  rechazada: "bg-red-50 text-red-700",
  cancelada: "bg-red-50 text-red-700",
  expirada: "bg-red-50 text-red-700",
  reagendada: "bg-neutral-100 text-neutral-600",
};

const ETIQUETAS_POR_ESTADO: Record<EstadoReserva, string> = {
  pendiente_pago: "Pendiente de pago",
  pendiente_revision: "Pendiente de revisión",
  confirmada: "Confirmada",
  completada: "Completada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
  expirada: "Expirada",
  reagendada: "Reagendada",
};

export default function EstadoBadge({ estado }: { estado: EstadoReserva }) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${ESTILOS_POR_ESTADO[estado]}`}
    >
      {ETIQUETAS_POR_ESTADO[estado]}
    </span>
  );
}
