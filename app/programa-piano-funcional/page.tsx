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

const benefits = [
  "Acceso inmediato después de la compra.",
  "Más de 10 módulos organizados paso a paso.",
  "Clases grabadas en alta calidad.",
  "Acceso desde computador, tablet o teléfono.",
  "Estudia completamente a tu ritmo.",
  "Acceso permanente al contenido.",
  "Actualizaciones futuras incluidas.",
];

export default function ProgramaPianoFuncionalPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}

      <section className="w-full">

        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">

          <div className="grid md:grid-cols-2 gap-16 items-center">

            <div>

              <p className="uppercase tracking-[0.2em] text-neutral-500 text-sm mb-6">
                Programa Online
              </p>

              <h1 className="text-4xl md:text-6xl leading-[1.08] font-medium text-neutral-900 mb-8">
                Aprende a tocar canciones en piano aunque hoy estés comenzando desde cero.
              </h1>

              <p className="text-lg md:text-xl text-neutral-600 leading-relaxed mb-10">
                Piano Funcional fue creado para personas que desean comprender la música
                de una forma práctica, desarrollar independencia en el instrumento y
                aprender a acompañar canciones reales sin pasar años estudiando teoría
                innecesaria.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">

                <a
                  href="https://pay.hotmart.com/N105731398K?sck=HOTMART_PRODUCT_PAGE&off=e2g7qfq2&hotfeature=32,34&_gl=1*usfdp1*_ga*NDkzNzM1MjA4LjE3NzgxNjUzNDc.*_ga_GQH2V1F11Q*czE3ODU4NjUwNzkkbzk5JGcxJHQxNzg1ODY1MDg2JGo2MCRsMCRoOTg5MDEwMjE3*_gcl_aw*R0NMLjE3Nzg4ODk1NDguQ2owS0NRandpSnZRQmhDWUFSSXNBTWp0czNMcTl0enJzUGpEejNzcFc4MVNKZkJfOGZ0cHN1QzdqVmtkU0hnSkRYS2Z3XzBLTjV3clE3d2FBZzNVRUFMd193Y0I.*_gcl_au*MjAwMjQ5MDcxOC4xNzc4MTY1MzQ3*FPAU*MjAwMjQ5MDcxOC4xNzc4MTY1MzQ3&bid=1785865086994"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    bg-neutral-900
                    text-white
                    px-8
                    py-4
                    rounded-full
                    text-lg
                    font-medium
                    transition-colors
                    hover:bg-neutral-800
                  "
                >
                  Comprar Programa
                </a>

                <Link
                  href="/"
                  className="
                    inline-flex
                    items-center
                    justify-center
                    border
                    border-neutral-300
                    px-8
                    py-4
                    rounded-full
                    text-lg
                    font-medium
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

      {/* TRANSFORMACIÓN */}

      <section className="border-t border-neutral-200">

        <div className="mx-auto max-w-5xl px-6 md:px-10 py-20">

          <h2 className="text-3xl md:text-4xl font-medium text-neutral-900 mb-8">
            Mucho más que aprender acordes.
          </h2>

          <div className="space-y-6 text-lg leading-relaxed text-neutral-600">

            <p>
              El verdadero objetivo de Piano Funcional no es memorizar ejercicios,
              sino entregarte las herramientas necesarias para comprender cómo
              funcionan las canciones y que puedas sentarte frente al piano con
              seguridad y autonomía.
            </p>

            <p>
              Al finalizar el programa comprenderás escalas, intervalos,
              construcción de acordes, progresiones armónicas e inversiones,
              desarrollando una base sólida que te permitirá aprender nuevas
              canciones con mucha mayor facilidad.
            </p>

            <p>
              Todo el contenido fue diseñado para que cualquier persona,
              incluso sin conocimientos musicales previos, pueda avanzar de
              forma progresiva y disfrutar el proceso desde la primera clase.
            </p>

          </div>

        </div>

      </section>
      {/* ¿CÓMO FUNCIONA? */}

      <section className="bg-neutral-50">

        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20">

          <div className="grid md:grid-cols-2 gap-14">

            <div>

              <h2 className="text-3xl md:text-4xl font-medium text-neutral-900 mb-8">
                ¿Cómo funciona el programa?
              </h2>

              <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">

                <p>
                  Piano Funcional se encuentra alojado completamente en la
                  plataforma educativa <strong>Hotmart</strong>.
                </p>

                <p>
                  Una vez realizada la compra recibirás automáticamente un
                  correo con tus credenciales de acceso.
                </p>

                <p>
                  Desde ese momento podrás ingresar a tu área de alumnos,
                  donde encontrarás todas las clases organizadas por módulos,
                  disponibles las 24 horas del día.
                </p>

                <p>
                  No necesitas instalar programas especiales ni esperar el
                  inicio de un curso.
                </p>

                <p>
                  Compras hoy y puedes comenzar a estudiar inmediatamente.
                </p>

              </div>

            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-8">

              <h3 className="text-2xl font-medium text-neutral-900 mb-8">
                ¿Qué recibirás?
              </h3>

              <ul className="space-y-4">

                {benefits.map((benefit) => (

                  <li
                    key={benefit}
                    className="flex items-start gap-3 text-neutral-700"
                  >

                    <span className="text-neutral-400 mt-[2px]">
                      ✓
                    </span>

                    <span className="leading-relaxed">
                      {benefit}
                    </span>

                  </li>

                ))}

              </ul>

            </div>

          </div>

        </div>

      </section>

      {/* CONTENIDOS */}

      <section className="w-full">

        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20">

          <h2 className="text-3xl md:text-4xl font-medium text-center text-neutral-900 mb-14">
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
      {/* CTA FINAL */}

      <section className="bg-neutral-900">

        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 text-center">

          <h2 className="text-3xl md:text-5xl leading-tight font-medium text-white mb-8">
            Hoy puedes comenzar a tocar el piano de verdad.
          </h2>

          <p className="text-lg text-neutral-300 max-w-3xl mx-auto leading-relaxed mb-12">
            Cuando presiones <strong>Comprar Programa</strong> serás dirigido
            directamente a la plataforma segura de Hotmart, donde podrás
            realizar el pago utilizando tarjeta de crédito u otros medios
            disponibles según tu país.
            <br />
            <br />
            Una vez confirmada la compra, Hotmart habilitará inmediatamente tu
            acceso para que puedas comenzar a estudiar ese mismo día.
          </p>

          <Link
            href="https://pay.hotmart.com/N105731398K?sck=HOTMART_PRODUCT_PAGE&off=e2g7qfq2&hotfeature=32,34&_gl=1*usfdp1*_ga*NDkzNzM1MjA4LjE3NzgxNjUzNDc.*_ga_GQH2V1F11Q*czE3ODU4NjUwNzkkbzk5JGcxJHQxNzg1ODY1MDg2JGo2MCRsMCRoOTg5MDEwMjE3*_gcl_aw*R0NMLjE3Nzg4ODk1NDguQ2owS0NRandpSnZRQmhDWUFSSXNBTWp0czNMcTl0enJzUGpEejNzcFc4MVNKZkJfOGZ0cHN1QzdqVmtkU0hnSkRYS2Z3XzBLTjV3clE3d2FBZzNVRUFMd193Y0I.*_gcl_au*MjAwMjQ5MDcxOC4xNzc4MTY1MzQ3*FPAU*MjAwMjQ5MDcxOC4xNzc4MTY1MzQ3&bid=1785865086994"
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              bg-white
              text-neutral-900
              px-10
              py-5
              rounded-full
              text-lg
              font-medium
              transition-colors duration-200
              hover:bg-neutral-100
            "
          >
            Comprar Programa
          </Link>

          <p className="text-sm text-neutral-400 mt-8">
            Pago seguro procesado por Hotmart.
          </p>

        </div>

      </section>

    </main>
  );
}