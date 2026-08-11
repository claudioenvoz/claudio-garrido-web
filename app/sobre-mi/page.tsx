import Image from "next/image";
import Link from "next/link";

export default function SobreMiPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* HERO */}

      <section className="w-full">
        <div className="mx-auto max-w-7xl px-6 md:px-10 py-20 md:py-28">

          <div className="grid md:grid-cols-2 gap-14 items-center">

            <div>

              <p className="uppercase tracking-[0.2em] text-neutral-500 text-sm mb-5">
                Claudio Garrido
              </p>

              <h1 className="text-4xl md:text-6xl leading-[1.1] font-medium text-neutral-900 mb-7">
                Más de veinte años dedicados al estudio, la interpretación y la enseñanza de la voz.
              </h1>

              <p className="text-lg text-neutral-600 leading-relaxed mb-10">
                Mi trabajo consiste en ayudar a otras personas a descubrir y desarrollar
                su verdadera voz mediante una enseñanza cercana, práctica y profundamente
                respetuosa del proceso individual de cada alumno.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">

                <Link
                  href="/reservar"
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
                  Reservar una clase
                </Link>

                <a
                  href="https://wa.me/56948507518"
                  target="_blank"
                  rel="noopener noreferrer"
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
                  Escribirme por WhatsApp
                </a>

              </div>

            </div>

            <div className="relative aspect-[4/5]">

              <Image
                src="/images/sobre-mi.jpg"
                alt="Claudio Garrido"
                fill
                className="object-cover rounded-2xl"
              />

            </div>

          </div>

        </div>

      </section>

      {/* MI HISTORIA */}

      <section className="w-full border-t border-neutral-200">

        <div className="mx-auto max-w-5xl px-6 md:px-10 py-20">

          <h2 className="text-3xl md:text-4xl font-medium text-neutral-900 mb-8">
            Mi historia profesional
          </h2>

          <p className="text-lg text-neutral-600 leading-relaxed mb-6">
            Mi formación comenzó hace más de dos décadas, impulsada por una
            profunda curiosidad por comprender cómo funciona realmente la voz
            humana y cómo desarrollar una técnica que permita cantar con libertad,
            seguridad y salud vocal.
          </p>

          <p className="text-lg text-neutral-600 leading-relaxed mb-6">
            Durante estos años he estudiado interpretación vocal, técnica,
            fisiología de la voz, repertorio popular y pedagogía musical,
            complementando permanentemente mi formación mediante cursos,
            investigación y experiencia práctica tanto en escenarios como en el aula.
          </p>

          <p className="text-lg text-neutral-600 leading-relaxed">
            Mi objetivo nunca ha sido únicamente enseñar canciones, sino ayudar a
            que cada alumno comprenda su propio instrumento y desarrolle herramientas
            que le permitan cantar con confianza durante toda la vida.
          </p>

        </div>

      </section>
            {/* FILOSOFÍA */}

      <section className="w-full bg-neutral-50">

        <div className="mx-auto max-w-5xl px-6 md:px-10 py-20">

          <h2 className="text-3xl md:text-4xl font-medium text-neutral-900 mb-10">
            Mi forma de enseñar
          </h2>

          <div className="space-y-8 text-lg text-neutral-600 leading-relaxed">

            <p>
              Creo profundamente que cualquier persona puede aprender a cantar
              cuando recibe una guía adecuada, un ambiente de confianza y una
              metodología clara.
            </p>

            <p>
              Durante años observé que muchos estudiantes abandonaban porque
              recibían clases excesivamente técnicas o, por el contrario,
              simplemente imitaban canciones sin comprender realmente lo que
              estaban haciendo.
            </p>

            <p>
              Por esa razón desarrollé una metodología que combina técnica,
              comprensión musical e interpretación desde la primera clase,
              permitiendo que el aprendizaje tenga sentido desde el comienzo.
            </p>

            <p>
              Mi trabajo consiste en acompañar a cada alumno respetando su ritmo,
              sus objetivos y su personalidad artística, construyendo un proceso
              sólido que permita desarrollar una voz libre, segura y auténtica.
            </p>

          </div>

        </div>

      </section>

      {/* EXPERIENCIA */}

      <section className="w-full">

        <div className="mx-auto max-w-6xl px-6 md:px-10 py-20">

          <h2 className="text-3xl md:text-4xl font-medium text-neutral-900 text-center mb-14">
            Lo que encontrarás en mis clases
          </h2>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="border border-neutral-200 rounded-2xl p-8 bg-white">
              <h3 className="text-xl font-medium text-neutral-900 mb-4">
                Técnica Vocal
              </h3>

              <p className="text-neutral-600 leading-relaxed">
                Respiración, apoyo, afinación, resonancia, registro,
                colocación y desarrollo de una emisión vocal saludable.
              </p>
            </div>

            <div className="border border-neutral-200 rounded-2xl p-8 bg-white">
              <h3 className="text-xl font-medium text-neutral-900 mb-4">
                Interpretación
              </h3>

              <p className="text-neutral-600 leading-relaxed">
                Aprenderás a comunicar emociones, comprender el texto,
                desarrollar presencia y construir una interpretación propia.
              </p>
            </div>

            <div className="border border-neutral-200 rounded-2xl p-8 bg-white">
              <h3 className="text-xl font-medium text-neutral-900 mb-4">
                Repertorio
              </h3>

              <p className="text-neutral-600 leading-relaxed">
                Trabajaremos canciones que realmente te motiven,
                adaptándolas a tu nivel y objetivos musicales.
              </p>
            </div>

            <div className="border border-neutral-200 rounded-2xl p-8 bg-white">
              <h3 className="text-xl font-medium text-neutral-900 mb-4">
                Seguimiento
              </h3>

              <p className="text-neutral-600 leading-relaxed">
                Después de cada clase recibirás material de estudio,
                ejercicios y recomendaciones para continuar avanzando
                durante la semana.
              </p>
            </div>

          </div>

        </div>

      </section>
            {/* CTA FINAL */}

      <section className="bg-neutral-900">

        <div className="mx-auto max-w-5xl px-6 md:px-10 py-24 text-center">

          <h2 className="text-3xl md:text-5xl leading-tight font-medium text-white mb-8">
            La voz no es un talento reservado para unos pocos.
          </h2>

          <p className="text-lg text-neutral-300 leading-relaxed max-w-3xl mx-auto mb-12">
            Con una metodología adecuada, acompañamiento constante y práctica
            consciente, cualquier persona puede desarrollar una voz más libre,
            segura y expresiva.
            <br />
            <br />
            Si decides comenzar este proceso conmigo, mi compromiso será
            acompañarte paso a paso, respetando tu ritmo y ayudándote a
            descubrir todo el potencial que ya existe en tu propia voz.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">

            <Link
              href="/reservar"
              className="
                bg-white
                text-neutral-900
                px-8
                py-4
                rounded-full
                text-lg
                font-medium
              "
            >
              Reservar una clase
            </Link>

            <a
              href="https://wa.me/56948507518"
              target="_blank"
              rel="noopener noreferrer"
              className="
                border
                border-white/40
                text-white
                px-8
                py-4
                rounded-full
                text-lg
                font-medium
              "
            >
              Escribirme por WhatsApp
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}