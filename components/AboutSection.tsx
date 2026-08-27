import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="w-full bg-white border-y border-neutral-200">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="py-16 md:py-[120px]">
          <div id="sobre-mi" className="grid grid-cols-1 md:grid-cols-2 items-center gap-12 md:gap-16">
          <div className="w-full">
            <div
              className="
                relative w-full
                aspect-[4/5]
                bg-neutral-100
                overflow-hidden rounded-2xl border border-neutral-200
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

          <div className="w-full">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-neutral-500 mb-5">
              Conoce a Claudio
            </p>

            <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-[-0.02em] font-semibold text-neutral-950 mb-6">
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

            <div className="grid grid-cols-3 gap-5 md:gap-8 border-t border-neutral-200 pt-8 mb-10">
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

            <Link
  href="/sobre-mi"
  className="
    inline-flex items-center justify-center
    bg-neutral-900 text-white
    px-7 py-3.5
    text-sm md:text-base font-medium
                rounded-lg
    transition-colors duration-200
    hover:bg-neutral-800
    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
  "
>
  Conocer mi historia
</Link>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
