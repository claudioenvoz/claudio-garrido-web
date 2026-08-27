import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="inicio" className="w-full scroll-mt-20 bg-[#f9f9f9]">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center pt-0.5 pb-16 md:pt-[18px] md:pb-24 lg:min-h-[calc(100vh-80px)]">
          <div
            className="
              order-2 lg:order-1
              flex flex-col items-center text-center
              lg:items-start lg:text-left
            "
          >
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-neutral-500 mb-6">
              Claudio En Voz
            </p>

            <h1 className="text-[2rem] md:text-5xl lg:text-[3rem] leading-[1.1] tracking-[-0.02em] font-semibold text-neutral-950 mb-7">
              Aprende música con una metodología clara, práctica y cercana.
            </h1>

            <p className="text-base md:text-lg text-neutral-600 leading-[1.65] max-w-xl mb-9">
              Clases de canto, piano y formación musical para personas que
              desean desarrollar sus habilidades musicales con un
              acompañamiento profesional y personalizado.
            </p>

            <div className="order-3 md:order-none flex flex-col sm:flex-row items-center gap-4 mb-10 w-full sm:w-auto">
              <Link
                href="/reservar"
                className="
                  w-full sm:w-auto
                  inline-flex items-center justify-center
                  bg-neutral-900 text-white
                  px-8 py-4
                  text-base md:text-lg font-medium
                  rounded-lg
                  transition-all duration-200 hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/10
                "
              >
                Reservar una clase
              </Link>

              <Link
                href="#piano-funcional"
                className="
                  w-full sm:w-auto
                  inline-flex items-center justify-center
                  border border-neutral-300 text-neutral-900
                  px-8 py-4
                  text-base md:text-lg font-medium
                  rounded-lg
                  transition-colors duration-200
                  hover:border-neutral-900 hover:bg-neutral-50
                "
              >
                Conocer Piano Funcional
              </Link>
            </div>

            <ul className="flex flex-col items-center lg:items-start gap-3">
              <li className="flex items-center gap-2 text-sm md:text-base text-neutral-600">
                <span className="text-yellow-500" aria-hidden="true">✓</span>
                Más de 7 años enseñando música
              </li>
              <li className="flex items-center gap-2 text-sm md:text-base text-neutral-600">
                <span className="text-yellow-500" aria-hidden="true">✓</span>
                Clases online y presenciales
              </li>
              <li className="flex items-center gap-2 text-sm md:text-base text-neutral-600">
                <span className="text-yellow-500" aria-hidden="true">✓</span>
                Formación personalizada
              </li>
            </ul>
          </div>

          <div
            className="
              order-1 lg:order-2
              w-full
              relative
              aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]
              overflow-hidden
              rounded-2xl border border-neutral-200
              group
            "
          >
            <Image
              src="/images/hero.jpg"
              alt="Claudio Garrido"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
