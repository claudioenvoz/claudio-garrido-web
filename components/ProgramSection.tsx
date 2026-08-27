import Image from "next/image";
import Link from "next/link";

const benefits = [
  "Acceso inmediato",
  "Clases grabadas",
  "Aprende a tu ritmo",
  "Actualizaciones futuras",
];

export default function ProgramSection() {
  return (
    <section id="piano-funcional" className="w-full bg-neutral-950 text-white">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-16">
          <div className="w-full order-2 lg:order-1">
            <div
              className="
                relative w-full
                aspect-[4/5]
                bg-neutral-100
                overflow-hidden rounded-2xl border border-white/10
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

          <div className="w-full order-1 lg:order-2">
            <p className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white mb-7">
              <span className="text-yellow-400" aria-hidden="true">★</span>
              Programa destacado
            </p>
            <h2 className="text-3xl md:text-5xl leading-[1.1] tracking-[-0.02em] font-semibold text-white mb-7">
              Programa Piano Funcional
            </h2>

            <div className="text-base md:text-lg text-neutral-300 leading-relaxed space-y-4 mb-8">
              <p>
                Un programa diseñado especialmente para personas que desean
                aprender piano desde cero, comprendiendo la música de manera
                práctica, simple y progresiva.
              </p>

              <p>
                Aprenderás acordes, progresiones, acompañamiento y herramientas
                para interpretar cientos de canciones, sin necesidad de
                conocimientos previos.
              </p>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-3 text-sm md:text-base text-neutral-100"
                >
                  <span className="text-yellow-400" aria-hidden="true">
                    ✓
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>

            <Link
              href="/programa-piano-funcional"
              className="
                inline-flex items-center justify-center
                bg-white text-neutral-950
                px-7 py-3.5
                text-sm md:text-base font-medium
                rounded-lg
                transition-colors duration-200
                hover:bg-neutral-200 hover:-translate-y-0.5
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white
              "
            >
              Conocer el Programa
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
