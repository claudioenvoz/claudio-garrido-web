import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="inicio" className="w-full scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:h-screen md:items-stretch gap-10 md:gap-12 pt-10 md:pt-0 pb-4 md:pb-0">
          <div
            className="
              order-2 md:order-1
              w-full md:w-[40%]
              flex flex-col items-center text-center
              md:items-start md:text-left
              md:justify-center
            "
          >
            <p className="text-sm md:text-base tracking-[0.2em] uppercase text-neutral-500 mb-5">
              Claudio En Voz
            </p>

            <h1 className="text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] font-medium text-neutral-900 mb-6">
              Aprende música con una metodología clara, práctica y cercana.
            </h1>

            <p className="text-base md:text-lg text-neutral-600 leading-relaxed max-w-md mb-10">
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
                  rounded-full
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
                  rounded-full
                  transition-colors duration-200
                  hover:border-neutral-900 hover:bg-neutral-50
                "
              >
                Conocer Piano Funcional
              </Link>
            </div>

            <ul className="flex flex-col items-center md:items-start gap-3">
              <li className="flex items-center gap-2 text-sm md:text-base text-neutral-600">
                <span className="text-neutral-400" aria-hidden="true">✓</span>
                Más de 7 años enseñando música
              </li>
              <li className="flex items-center gap-2 text-sm md:text-base text-neutral-600">
                <span className="text-neutral-400" aria-hidden="true">✓</span>
                Clases online y presenciales
              </li>
              <li className="flex items-center gap-2 text-sm md:text-base text-neutral-600">
                <span className="text-neutral-400" aria-hidden="true">✓</span>
                Formación personalizada
              </li>
            </ul>
          </div>

          <div
            className="
              order-1 md:order-2
              w-full md:w-[60%]
              relative
              aspect-[4/5] md:aspect-auto
              md:h-full
              overflow-hidden
            "
          >
            <Image
              src="/images/hero.jpg"
              alt="Claudio Garrido"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
