import Image from "next/image";

const benefits = [
  "Acceso inmediato",
  "Clases grabadas",
  "Aprende a tu ritmo",
  "Actualizaciones futuras",
];

export default function ProgramSection() {
  return (
    <section id="piano-funcional" className="w-full scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-12">
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
                src="/images/programa.jpg"
                alt="Programa Piano Funcional"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2">
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
              Programa Piano Funcional
            </h2>

            <div className="text-base md:text-lg text-neutral-600 leading-relaxed space-y-4 mb-8">
              <p>
                Un programa diseñado especialmente para personas que desean
                aprender piano desde cero, comprendiendo la música de manera
                práctica, simple y progresiva.
              </p>
              <p>
                Aprenderás acordes, progresiones, acompañamiento y
                herramientas para interpretar cientos de canciones, sin
                necesidad de conocimientos previos.
              </p>
            </div>

            <ul className="flex flex-col gap-3 mb-10">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-sm md:text-base text-neutral-600"
                >
                  <span className="text-neutral-400" aria-hidden="true">
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

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
              Conocer el Programa
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}