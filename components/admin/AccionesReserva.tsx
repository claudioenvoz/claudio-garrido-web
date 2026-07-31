"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { EstadoReserva } from "@/lib/reservas/types";

interface AccionesReservaProps {
  reservaId: string;
  estadoActual: EstadoReserva;
}

type Accion = "aprobar" | "rechazar" | "cancelar" | "reagendar";

export default function AccionesReserva({
  reservaId,
  estadoActual,
}: AccionesReservaProps) {
  const router = useRouter();

  const [notas, setNotas] = useState("");
  const [cargando, setCargando] = useState<Accion | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [advertencia, setAdvertencia] = useState<string | null>(null);
  const [mostrandoReagendar, setMostrandoReagendar] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");

  async function ejecutar(accion: Accion, extra?: Record<string, string>) {
    setCargando(accion);
    setError(null);

    try {
      const respuesta = await fetch(`/api/reservas/${reservaId}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion,
          notasInternas: notas.trim() || undefined,
          ...extra,
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setError(data.error ?? "No se pudo completar la acción.");
        return;
      }

      if (data.advertencia) {
        setAdvertencia(data.advertencia);
      } else {
        setAdvertencia(null);
      }

      router.refresh();
      setMostrandoReagendar(false);
    } catch {
      setError("No pudimos conectar con el servidor. Intenta nuevamente.");
    } finally {
      setCargando(null);
    }
  }

  const puedeAprobar = estadoActual === "pendiente_revision";
  const puedeRechazar = estadoActual === "pendiente_revision";
  const puedeCancelar = ["pendiente_pago", "pendiente_revision", "confirmada"].includes(
    estadoActual
  );
  const puedeReagendar = estadoActual === "confirmada";

  const sinAccionesDisponibles =
    !puedeAprobar && !puedeRechazar && !puedeCancelar && !puedeReagendar;

  return (
    <section className="rounded-2xl border border-neutral-200 p-6 md:p-8">
      <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wide mb-4">
        Acciones
      </h2>

      {sinAccionesDisponibles ? (
        <p className="text-sm text-neutral-500">
          No hay acciones disponibles para el estado actual (
          {estadoActual}).
        </p>
      ) : (
        <>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Notas internas (opcional)
          </label>
          <textarea
            value={notas}
            onChange={(e) => setNotas(e.target.value)}
            rows={3}
            placeholder="Ej. comprobante verificado por transferencia, motivo de cancelación, etc."
            className="
              w-full rounded-xl border border-neutral-300 px-4 py-3
              text-sm text-neutral-900 mb-5
              focus:outline-none focus:border-neutral-900
            "
          />

          {error && (
            <p className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-5">
              {error}
            </p>
          )}

          {advertencia && (
            <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
              ⚠️ {advertencia}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {puedeAprobar && (
              <button
                type="button"
                disabled={cargando !== null}
                onClick={() => ejecutar("aprobar")}
                className="
                  inline-flex items-center justify-center
                  bg-neutral-900 text-white
                  px-6 py-3
                  text-sm font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:bg-neutral-800
                  disabled:opacity-40 disabled:cursor-not-allowed
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                "
              >
                {cargando === "aprobar" ? "Aprobando..." : "Aprobar"}
              </button>
            )}

            {puedeRechazar && (
              <button
                type="button"
                disabled={cargando !== null}
                onClick={() => ejecutar("rechazar")}
                className="
                  inline-flex items-center justify-center
                  border border-red-200 text-red-700
                  px-6 py-3
                  text-sm font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:bg-red-50
                  disabled:opacity-40 disabled:cursor-not-allowed
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                "
              >
                {cargando === "rechazar" ? "Rechazando..." : "Rechazar"}
              </button>
            )}

            {puedeCancelar && (
              <button
                type="button"
                disabled={cargando !== null}
                onClick={() => ejecutar("cancelar")}
                className="
                  inline-flex items-center justify-center
                  border border-red-200 text-red-700
                  px-6 py-3
                  text-sm font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:bg-red-50
                  disabled:opacity-40 disabled:cursor-not-allowed
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                "
              >
                {cargando === "cancelar" ? "Cancelando..." : "Cancelar"}
              </button>
            )}

            {puedeReagendar && !mostrandoReagendar && (
              <button
                type="button"
                disabled={cargando !== null}
                onClick={() => setMostrandoReagendar(true)}
                className="
                  inline-flex items-center justify-center
                  border border-neutral-300 text-neutral-900
                  px-6 py-3
                  text-sm font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:border-neutral-900 hover:bg-neutral-50
                  disabled:opacity-40 disabled:cursor-not-allowed
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                "
              >
                Reagendar
              </button>
            )}
          </div>

          {mostrandoReagendar && (
            <div className="mt-5 pt-5 border-t border-neutral-100 flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nueva fecha
                  </label>
                  <input
                    type="date"
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                    className="
                      w-full rounded-xl border border-neutral-300 px-4 py-2.5
                      text-sm text-neutral-900
                      focus:outline-none focus:border-neutral-900
                    "
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Nueva hora
                  </label>
                  <input
                    type="time"
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                    className="
                      w-full rounded-xl border border-neutral-300 px-4 py-2.5
                      text-sm text-neutral-900
                      focus:outline-none focus:border-neutral-900
                    "
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={!nuevaFecha || !nuevaHora || cargando !== null}
                  onClick={() => ejecutar("reagendar", { nuevaFecha, nuevaHora })}
                  className="
                    inline-flex items-center justify-center
                    bg-neutral-900 text-white
                    px-6 py-3
                    text-sm font-medium
                    rounded-full
                    transition-colors duration-200
                    hover:bg-neutral-800
                    disabled:opacity-40 disabled:cursor-not-allowed
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                  "
                >
                  {cargando === "reagendar" ? "Reagendando..." : "Confirmar reagendamiento"}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrandoReagendar(false)}
                  className="
                    inline-flex items-center justify-center
                    text-sm font-medium text-neutral-500
                    transition-colors duration-200
                    hover:text-neutral-900
                  "
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
