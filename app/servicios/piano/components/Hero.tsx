import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section id="piano-hero" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-12 py-16 md:py-24">
          <div
            className="
              order-2 md:order-1
              w-full md:w-[45%]
              flex flex-col items-center text-center
              md:items-start md:text-left
            "
          >
            <p
              className="
                text-sm md:text-base tracking-[0.2em] uppercase text-neutral-500 mb-5
                animate-fade-in-up
              "
              style={{ animationDelay: "0ms" }}
            >
              Clases de Piano
            </p>

            <h1
              className="
                text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.15] font-medium text-neutral-900 mb-6
                animate-fade-in-up
              "
              style={{ animationDelay: "80ms" }}
            >
              Aprende piano de una forma práctica, musical y entretenida.
            </h1>

            <p
              className="
                text-base md:text-lg text-neutral-600 leading-relaxed max-w-md mb-10
                animate-fade-in-up
              "
              style={{ animationDelay: "160ms" }}
            >
              Descubre una metodología diseñada para que puedas comprender
              acordes, progresiones y acompañamientos desde las primeras
              clases, desarrollando habilidades que podrás aplicar
              inmediatamente en tus canciones favoritas.
            </p>

            <div
              className="
                flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto
                animate-fade-in-up
              "
              style={{ animationDelay: "240ms" }}
            >
              <Link
                href="/servicios/piano/reserva"
                className="
                  w-full sm:w-auto
                  inline-flex items-center justify-center
                  bg-neutral-900 text-white
                  px-8 py-4
                  text-base md:text-lg font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:bg-neutral-800
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                "
              >
                Reservar mi primera clase
              </Link>

              <a
                href="#piano-como-funcionan"
                className="
                  w-full sm:w-auto
                  inline-flex items-center justify-center
                  border border-neutral-300 text-neutral-900
                  px-8 py-4
                  text-base md:text-lg font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:border-neutral-900 hover:bg-neutral-50
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                "
              >
                Conocer la metodología
              </a>
            </div>
          </div>

          <div
            className="order-1 md:order-2 w-full md:w-[55%] animate-fade-in-up"
            style={{ animationDelay: "120ms" }}
          >
            <div
              className="
                relative w-full
                aspect-[4/5]
                bg-neutral-100
                overflow-hidden
              "
            >
              <Image
                src="/images/piano-hero.jpg"
                alt="Claudio Garrido enseñando piano"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}