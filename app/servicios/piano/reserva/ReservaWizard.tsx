"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Reserva } from "@/lib/reservas/types";

/*
 * PÁGINA: /servicios/canto/reserva
 * Sistema de reserva — ETAPA 2: interfaz conectada a /api/reservas.
 * Todavía sin Google Calendar, Ionix ni emails automáticos — eso llega
 * en etapas posteriores. Lo marcado como "DEMO" más abajo (disponibilidad
 * del calendario) sigue siendo data falsa, no viene de la API.
 */

type PlanId = "individual" | "mensual" | "bimensual";

const plans: { id: PlanId; name: string; price: string; detail: string }[] = [
  {
    id: "individual",
    name: "Clase Individual",
    price: "$40.000 CLP",
    detail: "1 clase de 60 minutos",
  },
  {
    id: "mensual",
    name: "Pack Mensual",
    price: "$120.000 CLP",
    detail: "4 clases · una clase semanal",
  },
  {
    id: "bimensual",
    name: "Pack Bimensual",
    price: "$200.000 CLP",
    detail: "8 clases · seguimiento prolongado",
  },
];

const timeSlots = ["09:00", "10:00", "11:00", "14:00", "16:00", "18:00"];

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

// DEMO: determina si un día está "bloqueado" solo para fines visuales.
// Reemplazar por disponibilidad real (Google Calendar) en la integración.
function isDayBlockedDemo(date: Date) {
  const day = date.getDay(); // 0 = domingo
  if (day === 0) return true; // domingos bloqueados
  return date.getDate() % 7 === 0; // un día bloqueado cada semana, como ejemplo
}

function getMonthMatrix(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  // Lunes como primer día de la semana
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
}

const stepLabels = [
  "Modalidad",
  "Fecha",
  "Horario",
  "Tus datos",
  "Resumen",
];

export default function ReservaWizard() {
  const searchParams = useSearchParams();
  const preselectedPlan = searchParams.get("plan") as PlanId | null;

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(
    preselectedPlan && plans.some((p) => p.id === preselectedPlan)
      ? preselectedPlan
      : null
  );

  const today = useMemo(() => new Date(), []);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    whatsapp: "",
    country: "",
    comments: "",
  });

  // Estado de la integración con /api/reservas
  const [enviando, setEnviando] = useState(false);
  const [errores, setErrores] = useState<string[] | null>(null);
  const [reservaCreada, setReservaCreada] = useState<Reserva | null>(null);

  // Flujo de pago post-reserva
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [comprobanteEnviado, setComprobanteEnviado] = useState(false);
  const [subiendoComprobante, setSubiendoComprobante] = useState(false);
  const [errorComprobante, setErrorComprobante] = useState<string | null>(null);

  // Flujo de pago Ionix
  const [enviandoPagoIonix, setEnviandoPagoIonix] = useState(false);
  const [errorPagoIonix, setErrorPagoIonix] = useState<string | null>(null);

  const monthCells = useMemo(
    () => getMonthMatrix(viewYear, viewMonth),
    [viewYear, viewMonth]
  );

  const selectedPlanData = plans.find((p) => p.id === selectedPlan) ?? null;

  const canGoNext =
    (step === 1 && selectedPlan !== null) ||
    (step === 2 && selectedDate !== null) ||
    (step === 3 && selectedTime !== null) ||
    (step === 4 && form.name.trim() !== "" && form.email.trim() !== "") ||
    step === 5;

  function goNext() {
    if (step < 5) setStep(step + 1);
  }

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  function changeMonth(delta: number) {
    let newMonth = viewMonth + delta;
    let newYear = viewYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }
    setViewMonth(newMonth);
    setViewYear(newYear);
  }

  // "YYYY-MM-DD" en hora local — evita el corrimiento de día que causa
  // toISOString() al convertir a UTC.
  function toISODate(date: Date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  // Determina si el pago corresponde al flujo de Chile (transferencia) o
  // al internacional (Ionix), a partir del país que la persona escribió
  // en el formulario. Normaliza tildes/mayúsculas para no fallar por
  // variaciones de escritura ("Chile", "chile", "CHILE", "chíle", etc.).
  function esChile(pais: string) {
    const normalizado = pais
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    return normalizado === "chile" || normalizado === "cl";
  }

  async function manejarSubidaComprobante() {
    if (!comprobante || !reservaCreada) return;

    setSubiendoComprobante(true);
    setErrorComprobante(null);

    try {
      const formData = new FormData();
      formData.append("comprobante", comprobante);

      const respuesta = await fetch(
        `/api/reservas/${reservaCreada.id}/comprobante`,
        { method: "POST", body: formData }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setErrorComprobante(
          data.error ?? "No pudimos subir el comprobante. Intenta nuevamente."
        );
        return;
      }

      setReservaCreada(data as Reserva);
      setComprobanteEnviado(true);
    } catch {
      setErrorComprobante(
        "No pudimos conectar con el servidor. Intenta nuevamente."
      );
    } finally {
      setSubiendoComprobante(false);
    }
  }

  async function pagarConIonix() {
    if (!reservaCreada) return;

    setEnviandoPagoIonix(true);
    setErrorPagoIonix(null);

    try {
      const respuesta = await fetch(
        `/api/reservas/${reservaCreada.id}/pago-ionix`,
        { method: "POST" }
      );

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setErrorPagoIonix(
          data.error ?? "No pudimos iniciar el pago. Intenta nuevamente."
        );
        return;
      }

      // Redirección real al link de enrolamiento de tarjeta de Ionix.
      window.location.href = data.url;
    } catch {
      setErrorPagoIonix(
        "No pudimos conectar con el servidor de pagos. Intenta nuevamente."
      );
    } finally {
      setEnviandoPagoIonix(false);
    }
  }

  async function enviarReserva() {
    if (!selectedPlanData || !selectedDate || !selectedTime) return;

    setEnviando(true);
    setErrores(null);

    try {
      const respuesta = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          servicio: "canto",
          planId: selectedPlanData.id,
          planNombre: selectedPlanData.name,
          planPrecio: selectedPlanData.price,
          fecha: toISODate(selectedDate),
          hora: selectedTime,
          duracionMinutos: 60,
          nombre: form.name,
          email: form.email,
          whatsapp: form.whatsapp,
          pais: form.country,
          comentarios: form.comments.trim() || undefined,
          origen: "reserva-canto",
        }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        setErrores(
          data.errores ?? ["Ocurrió un error inesperado. Intenta nuevamente."]
        );
        return;
      }

      setReservaCreada(data as Reserva);
    } catch {
      setErrores([
        "No pudimos conectar con el servidor. Verifica tu conexión e intenta nuevamente.",
      ]);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="w-full">
      <div className="mx-auto max-w-3xl px-6 md:px-10 py-16 md:py-24">
        {reservaCreada ? (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <div className="w-14 h-14 rounded-full bg-neutral-900 text-white flex items-center justify-center text-2xl mx-auto mb-6">
                ✓
              </div>

              <h1 className="text-3xl md:text-4xl leading-[1.15] font-medium text-neutral-900 mb-4">
                Tu horario quedó registrado.
              </h1>

              <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-xl mx-auto">
                Solo falta un paso: confirmar el pago de tu reserva.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-200 p-8 flex flex-col gap-5 max-w-md mx-auto text-left mb-10">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">
                  Número de reserva
                </span>
                <span className="text-sm font-medium text-neutral-900">
                  {reservaCreada.id.slice(0, 8)}
                </span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Plan</span>
                <span className="text-base font-medium text-neutral-900">
                  {reservaCreada.planNombre}
                </span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Fecha</span>
                <span className="text-base font-medium text-neutral-900">
                  {new Date(
                    `${reservaCreada.fecha}T00:00:00`
                  ).toLocaleDateString("es-CL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Hora</span>
                <span className="text-base font-medium text-neutral-900">
                  {reservaCreada.hora}
                </span>
              </div>
            </div>

            {esChile(reservaCreada.pais) ? (
              /* ==================== FLUJO CHILE — TRANSFERENCIA ==================== */
              <div className="max-w-md mx-auto rounded-2xl border border-neutral-200 p-8">
                <h2 className="text-lg md:text-xl font-medium text-neutral-900 mb-1">
                  Transferencia bancaria
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Tu horario queda reservado hasta las 23:59 de hoy mientras
                  validamos tu comprobante.
                </p>

                {/*
                  ⚠️ DATOS BANCARIOS PLACEHOLDER — reemplazar por los datos
                  reales de Claudio antes de publicar. Pendiente según la
                  especificación del proyecto.
                */}
                <div className="flex flex-col gap-3 mb-8 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Banco</span>
                    <span className="font-medium text-neutral-900">
                      [Nombre del banco]
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Tipo de cuenta</span>
                    <span className="font-medium text-neutral-900">
                      [Tipo de cuenta]
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Número de cuenta</span>
                    <span className="font-medium text-neutral-900">
                      [Número de cuenta]
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">RUT</span>
                    <span className="font-medium text-neutral-900">
                      [RUT]
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">Nombre</span>
                    <span className="font-medium text-neutral-900">
                      Claudio Garrido
                    </span>
                  </div>
                </div>

                {comprobanteEnviado ? (
                  <p className="text-sm text-neutral-600 text-center">
                    Hemos recibido tu comprobante. Te confirmaremos apenas
                    quede validado.
                  </p>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Sube tu comprobante de transferencia
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) =>
                        setComprobante(e.target.files?.[0] ?? null)
                      }
                      className="
                        w-full rounded-xl border border-neutral-300 px-4 py-3
                        text-sm text-neutral-600
                        mb-4
                      "
                    />
                    {errorComprobante && (
                      <p className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-4">
                        {errorComprobante}
                      </p>
                    )}

                    <button
                      type="button"
                      disabled={!comprobante || subiendoComprobante}
                      onClick={manejarSubidaComprobante}
                      className="
                        w-full inline-flex items-center justify-center
                        bg-neutral-900 text-white
                        px-7 py-3.5
                        text-sm md:text-base font-medium
                        rounded-full
                        transition-colors duration-200
                        hover:bg-neutral-800
                        disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                      "
                    >
                      {subiendoComprobante ? "Subiendo..." : "Enviar comprobante"}
                    </button>
                  </>
                )}
              </div>
            ) : (
              /* ==================== FLUJO INTERNACIONAL — IONIX ==================== */
              <div className="max-w-md mx-auto rounded-2xl border border-neutral-200 p-8 text-center">
                <h2 className="text-lg md:text-xl font-medium text-neutral-900 mb-1">
                  Pago internacional
                </h2>
                <p className="text-sm text-neutral-500 mb-6">
                  Completa tu pago de forma segura con tarjeta.
                </p>

                {errorPagoIonix && (
                  <p className="text-sm text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-4 text-left">
                    {errorPagoIonix}
                  </p>
                )}

                <button
                  type="button"
                  disabled={enviandoPagoIonix}
                  onClick={pagarConIonix}
                  className="
                    w-full inline-flex items-center justify-center
                    bg-neutral-900 text-white
                    px-7 py-3.5
                    text-sm md:text-base font-medium
                    rounded-full
                    transition-colors duration-200
                    hover:bg-neutral-800
                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                  "
                >
                  {enviandoPagoIonix ? "Redirigiendo..." : "Pagar con Ionix"}
                </button>
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/"
                className="
                  inline-flex items-center justify-center
                  border border-neutral-300 text-neutral-900
                  px-7 py-3.5
                  text-sm md:text-base font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:border-neutral-900 hover:bg-neutral-50
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                "
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        ) : (
          <>
        {/* Indicador de paso — minimalista, sin librerías */}
        <div className="flex items-center justify-center gap-2 mb-14 animate-fade-in-up">
          {stepLabels.map((label, index) => {
            const stepNumber = index + 1;
            const isActive = stepNumber === step;
            const isDone = stepNumber < step;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-neutral-900 text-white"
                        : isDone
                        ? "bg-neutral-200 text-neutral-900"
                        : "bg-neutral-100 text-neutral-400"
                    }
                  `}
                >
                  {stepNumber}
                </div>
                {stepNumber < stepLabels.length && (
                  <div className="w-6 md:w-10 h-px bg-neutral-200" />
                )}
              </div>
            );
          })}
        </div>

        {/* PASO 1 — Modalidad */}
        {step === 1 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl leading-[1.15] font-medium text-neutral-900 mb-3 text-center">
              Reserva tu primera clase
            </h1>
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed text-center mb-12">
              Selecciona la modalidad que deseas reservar.
            </p>

            <div className="flex flex-col gap-4">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`
                      w-full text-left
                      flex items-center justify-between
                      rounded-2xl border p-6
                      transition-colors duration-200
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                      ${
                        isSelected
                          ? "border-neutral-900"
                          : "border-neutral-200 hover:border-neutral-400"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`
                          w-5 h-5 rounded-full border flex items-center justify-center shrink-0
                          ${
                            isSelected
                              ? "border-neutral-900"
                              : "border-neutral-300"
                          }
                        `}
                        aria-hidden="true"
                      >
                        {isSelected && (
                          <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
                        )}
                      </span>
                      <div>
                        <p className="text-base md:text-lg font-medium text-neutral-900">
                          {plan.name}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {plan.detail}
                        </p>
                      </div>
                    </div>
                    <p className="text-base md:text-lg font-medium text-neutral-900 whitespace-nowrap ml-4">
                      {plan.price}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 2 — Calendario */}
        {step === 2 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl leading-[1.15] font-medium text-neutral-900 mb-3 text-center">
              Elige una fecha
            </h1>
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed text-center mb-12">
              Selecciona el día que prefieras para tu clase.
            </p>

            <div className="rounded-2xl border border-neutral-200 p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
                  onClick={() => changeMonth(-1)}
                  aria-label="Mes anterior"
                  className="
                    w-9 h-9 rounded-full flex items-center justify-center
                    text-neutral-600
                    transition-colors duration-200
                    hover:bg-neutral-100
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                  "
                >
                  ←
                </button>
                <p className="text-base md:text-lg font-medium text-neutral-900">
                  {monthNames[viewMonth]} {viewYear}
                </p>
                <button
                  type="button"
                  onClick={() => changeMonth(1)}
                  aria-label="Mes siguiente"
                  className="
                    w-9 h-9 rounded-full flex items-center justify-center
                    text-neutral-600
                    transition-colors duration-200
                    hover:bg-neutral-100
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                  "
                >
                  →
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="text-center text-xs font-medium text-neutral-400 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {monthCells.map((date, index) => {
                  if (!date) return <div key={`empty-${index}`} />;

                  const isPast =
                    date <
                    new Date(today.getFullYear(), today.getMonth(), today.getDate());
                  const isBlocked = isPast || isDayBlockedDemo(date);
                  const isSelected =
                    selectedDate?.toDateString() === date.toDateString();

                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      disabled={isBlocked}
                      onClick={() => setSelectedDate(date)}
                      className={`
                        aspect-square rounded-xl text-sm font-medium
                        transition-colors duration-200
                        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                        ${
                          isBlocked
                            ? "text-neutral-300 cursor-not-allowed"
                            : isSelected
                            ? "bg-neutral-900 text-white"
                            : "text-neutral-900 hover:bg-neutral-100"
                        }
                      `}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PASO 3 — Horarios */}
        {step === 3 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl leading-[1.15] font-medium text-neutral-900 mb-3 text-center">
              Elige un horario
            </h1>
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed text-center mb-12">
              Horarios disponibles para{" "}
              {selectedDate?.toLocaleDateString("es-CL", {
                day: "numeric",
                month: "long",
              })}
              .
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {timeSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTime(time)}
                    className={`
                      rounded-2xl border p-5 text-center
                      text-base md:text-lg font-medium
                      transition-colors duration-200
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                      ${
                        isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-neutral-200 text-neutral-900 hover:border-neutral-400"
                      }
                    `}
                  >
                    {time}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* PASO 4 — Formulario */}
        {step === 4 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl leading-[1.15] font-medium text-neutral-900 mb-3 text-center">
              Tus datos
            </h1>
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed text-center mb-12">
              Necesitamos algunos datos para confirmar tu reserva.
            </p>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="
                    w-full rounded-xl border border-neutral-300 px-4 py-3
                    text-base text-neutral-900
                    transition-colors duration-200
                    focus:outline-none focus:border-neutral-900
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Correo
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="
                    w-full rounded-xl border border-neutral-300 px-4 py-3
                    text-base text-neutral-900
                    transition-colors duration-200
                    focus:outline-none focus:border-neutral-900
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, whatsapp: e.target.value }))
                  }
                  className="
                    w-full rounded-xl border border-neutral-300 px-4 py-3
                    text-base text-neutral-900
                    transition-colors duration-200
                    focus:outline-none focus:border-neutral-900
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  País
                </label>
                <input
                  type="text"
                  value={form.country}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, country: e.target.value }))
                  }
                  className="
                    w-full rounded-xl border border-neutral-300 px-4 py-3
                    text-base text-neutral-900
                    transition-colors duration-200
                    focus:outline-none focus:border-neutral-900
                  "
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Comentarios (opcional)
                </label>
                <textarea
                  value={form.comments}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, comments: e.target.value }))
                  }
                  rows={4}
                  className="
                    w-full rounded-xl border border-neutral-300 px-4 py-3
                    text-base text-neutral-900
                    transition-colors duration-200
                    focus:outline-none focus:border-neutral-900
                  "
                />
              </div>
            </div>
          </div>
        )}

        {/* PASO 5 — Resumen */}
        {step === 5 && (
          <div className="animate-fade-in-up">
            <h1 className="text-3xl md:text-4xl leading-[1.15] font-medium text-neutral-900 mb-3 text-center">
              Resumen de tu reserva
            </h1>
            <p className="text-base md:text-lg text-neutral-600 leading-relaxed text-center mb-12">
              Revisa que todo esté correcto antes de continuar.
            </p>

            <div className="rounded-2xl border border-neutral-200 p-8 flex flex-col gap-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Plan elegido</span>
                <span className="text-base font-medium text-neutral-900">
                  {selectedPlanData?.name ?? "—"}
                </span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Fecha</span>
                <span className="text-base font-medium text-neutral-900">
                  {selectedDate
                    ? selectedDate.toLocaleDateString("es-CL", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Hora</span>
                <span className="text-base font-medium text-neutral-900">
                  {selectedTime ?? "—"}
                </span>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500">Precio</span>
                <span className="text-base font-medium text-neutral-900">
                  {selectedPlanData?.price ?? "—"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Errores de validación o de conexión con la API */}
        {errores && (
          <div className="rounded-2xl border border-neutral-300 bg-neutral-50 p-5 mt-8">
            <p className="text-sm font-medium text-neutral-900 mb-2">
              Revisa lo siguiente antes de continuar:
            </p>
            <ul className="list-disc list-inside text-sm text-neutral-600 space-y-1">
              {errores.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Navegación entre pasos */}
        <div className="flex items-center justify-between mt-12">
          {step > 1 ? (
            <button
              type="button"
              onClick={goBack}
              disabled={enviando}
              className="
                inline-flex items-center justify-center
                border border-neutral-300 text-neutral-900
                px-7 py-3.5
                text-sm md:text-base font-medium
                rounded-full
                transition-colors duration-200
                hover:border-neutral-900 hover:bg-neutral-50
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                disabled:opacity-40 disabled:cursor-not-allowed
              "
            >
              Volver
            </button>
          ) : (
            <span />
          )}

          <button
            type="button"
            disabled={!canGoNext || enviando}
            onClick={step === 5 ? enviarReserva : goNext}
            className="
              inline-flex items-center justify-center
              bg-neutral-900 text-white
              px-8 py-4
              text-base md:text-lg font-medium
              rounded-full
              transition-colors duration-200
              hover:bg-neutral-800
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
            "
          >
            {step < 5
              ? "Continuar"
              : enviando
              ? "Enviando..."
              : "Continuar al pago"}
          </button>
        </div>
          </>
        )}
      </div>
    </main>
  );
}
