import Link from "next/link";
import Image from "next/image";

const modules = [
  "Fundamentos del Piano",
  "Intervalos",
  "Escala Mayor",
  "Construcción de Acordes",
  "Grados Armónicos",
  "Especies de Grados",
  "Inversiones",
  "Progresiones Armónicas",
  "Relativos Menores",
  "II-V-I Mayor y Menor",
  "Aplicación al Repertorio Popular",
];

export default function ProgramaPianoFuncionalPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">

          <div className="grid md:grid-cols-2 gap-14 items-center">

            <div>

              <p className="uppercase tracking-[0.2em] text-neutral-500 text-sm mb-5">
                Programa Online
              </p>

              <h1 className="text-4xl md:text-6xl leading-[1.1] font-medium text-neutral-900 mb-7">
                Piano Funcional
              </h1>

              <p className="text-lg text-neutral-600 leading-relaxed mb-10">
                Aprende piano desde cero mediante una metodología práctica,
                clara y diseñada para comprender cómo funcionan las canciones
                del repertorio popular.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">

                <button
                  className="
                    bg-neutral-900
                    text-white
                    px-8
                    py-4
                    rounded-full
                    text-lg
                    font-medium
                  "
                >
                  Comprar Programa
                </button>

                <Link
                  href="/"
                  className="
                    border
                    border-neutral-300
                    px-8
                    py-4
                    rounded-full
                    text-lg
                    font-medium
                    text-center
                  "
                >
                  Volver
                </Link>

              </div>

            </div>

            <div className="relative aspect-[4/5]">

              <Image
                src="/images/programa.jpg"
                alt="Programa Piano Funcional"
                fill
                className="object-cover rounded-2xl"
              />

            </div>

          </div>

        </div>
      </section>

      {/* DESCRIPCIÓN */}

      <section className="w-full border-t border-neutral-200">

        <div className="mx-auto max-w-5xl px-6 md:px-10 py-20">

          <h2 className="text-3xl md:text-4xl font-medium text-neutral-900 mb-8">
            ¿Qué es Piano Funcional?
          </h2>

          <p className="text-lg text-neutral-600 leading-relaxed mb-6">
            Piano Funcional nace con un objetivo muy simple:
            ayudarte a comprender el piano de una forma práctica,
            sin años de teoría innecesaria.
          </p>

          <p className="text-lg text-neutral-600 leading-relaxed">
            El programa está pensado especialmente para adultos,
            principiantes y cantantes que desean acompañarse mientras cantan,
            comprendiendo acordes, progresiones y estructura musical.
          </p>

        </div>

      </section>

      {/* CONTENIDOS */}

      <section className="w-full bg-neutral-50">

        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20">

          <h2 className="text-3xl md:text-4xl font-medium text-center mb-14">
            Contenido del Programa
          </h2>

          <div className="grid md:grid-cols-2 gap-5">

            {modules.map((module) => (

              <div
                key={module}
                className="
                  bg-white
                  border
                  border-neutral-200
                  rounded-2xl
                  p-6
                "
              >
                {module}
              </div>

            ))}

          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="w-full">

        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 text-center">

          <h2 className="text-3xl md:text-5xl leading-tight font-medium mb-8">
            Comienza hoy tu aprendizaje.
          </h2>

          <p className="text-lg text-neutral-600 max-w-2xl mx-auto mb-12">
            Accede inmediatamente al programa completo y comienza a desarrollar
            tus habilidades pianísticas a tu propio ritmo.
          </p>

          <button
            className="
              bg-neutral-900
              text-white
              px-10
              py-5
              rounded-full
              text-lg
              font-medium
            "
          >
            Comprar Programa
          </button>

        </div>

      </section>

    </main>
  );
}