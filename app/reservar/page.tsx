import Link from "next/link";

export default function ReservarPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col items-center justify-center px-6 py-16 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">
          Reserva tu clase
        </p>

        <h1 className="max-w-3xl text-4xl font-medium tracking-tight text-neutral-900 md:text-5xl">
          ¿Qué clase quieres reservar?
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-neutral-600 md:text-lg">
          Elige el tipo de clase que quieres reservar para continuar con el
          proceso de selección de horario.
        </p>

        <div className="mt-12 grid w-full max-w-3xl gap-6 md:grid-cols-2">
          <Link
            href="/servicios/piano/reserva"
            className="group rounded-2xl border border-neutral-200 p-8 text-left transition-all duration-200 hover:border-neutral-400 hover:shadow-sm"
          >
            <div className="text-4xl">🎹</div>

            <h2 className="mt-6 text-2xl font-medium text-neutral-900">
              Clases de Piano
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Reserva una clase de piano y elige el horario que mejor se
              adapte a ti.
            </p>

            <span className="mt-8 inline-block text-sm font-medium text-neutral-900 transition-transform duration-200 group-hover:translate-x-1">
              Continuar →
            </span>
          </Link>

          <Link
            href="/servicios/canto/reserva"
            className="group rounded-2xl border border-neutral-200 p-8 text-left transition-all duration-200 hover:border-neutral-400 hover:shadow-sm"
          >
            <div className="text-4xl">🎤</div>

            <h2 className="mt-6 text-2xl font-medium text-neutral-900">
              Clases de Canto
            </h2>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Reserva una clase de canto y elige el horario que mejor se
              adapte a ti.
            </p>

            <span className="mt-8 inline-block text-sm font-medium text-neutral-900 transition-transform duration-200 group-hover:translate-x-1">
              Continuar →
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}