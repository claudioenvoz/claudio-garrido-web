import Image from "next/image";

export default function AboutSection() {
  return (
    <section id="sobre-mi" className="w-full scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-12 pt-20 md:pt-32 pb-16 md:pb-24">
          <div className="w-full md:w-1/2">
            <div
              className="
                relative w-full
                aspect-[4/5]
                bg-neutral-100
                overflow-hidden
              "
            >
              <Image
                src="/images/about.jpg"
                alt="Claudio Garrido"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <p className="text-sm md:text-base tracking-[0.2em] uppercase text-neutral-500 mb-5">
              Conoce a Claudio
            </p>

            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
              Más de siete años ayudando a personas a descubrir su potencial
              musical.
            </h2>

            <div className="text-base md:text-lg text-neutral-600 leading-relaxed space-y-4 mb-10">
              <p>
                La música ha sido el centro de mi vida durante años. Como
                cantante, pianista y docente, he acompañado a estudiantes de
                distintos niveles a desarrollar sus habilidades de manera
                práctica, cercana y personalizada.
              </p>
              <p>
                Mi objetivo no es solo enseñar técnica, sino ayudarte a
                comprender la música para que puedas disfrutarla,
                interpretarla y hacerla parte de tu vida.
              </p>
            </div>

            <div className="flex items-start gap-8 md:gap-12 mb-10">
              <div>
                <p className="text-3xl md:text-4xl font-medium text-neutral-900 mb-1">
                  7+
                </p>
                <p className="text-sm text-neutral-500">Años enseñando</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-medium text-neutral-900 mb-1">
                  100+
                </p>
                <p className="text-sm text-neutral-500">Estudiantes</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-medium text-neutral-900 mb-1">
                  4
                </p>
                <p className="text-sm text-neutral-500">
                  Programas de formación
                </p>
              </div>
            </div>

            <button
              type="button"
              className="
                bg-neutral-900 text-white
                px-7 py-3.5
                text-sm md:text-base font-medium
                rounded-full
                transition-colors duration-200
                hover:bg-neutral-800
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
              "
            >
              Conocer mi historia
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}