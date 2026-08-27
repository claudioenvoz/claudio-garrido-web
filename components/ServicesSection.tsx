import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Clases de Piano",
    text: "Clases individuales para quienes desean avanzar de forma personalizada.",
    buttonLabel: "Más información",
    image: "/images/service-piano.jpg",
  },
  {
    title: "Clases de Canto",
    text: "Desarrolla tu voz con clases personalizadas orientadas a técnica vocal, interpretación y repertorio.",
    buttonLabel: "Más información",
    image: "/images/service-canto.jpg",
  },
  {
    title: "Masterclasses",
    text: "Clases abiertas donde aprenderás herramientas prácticas sobre música, piano e interpretación.",
    buttonLabel: "Ver próximas fechas",
    image: "/images/private-piano.jpg",
  },
];

export default function ServicesSection() {
  return (
    <section className="w-full bg-[#f9f9f9]">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-[120px]">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-[-0.02em] font-semibold text-neutral-950 mb-6">
            ¿Cómo puedo ayudarte?
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Cada persona vive un proceso musical distinto. Por eso he
            desarrollado diferentes formas de aprender, según tus objetivos y
            experiencia.
          </p>
        </div>

        <div id="servicios" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group flex flex-col rounded-2xl border border-neutral-200 overflow-hidden bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5"
            >
              <div
                className="
                  relative w-full
                  aspect-[4/3]
                  bg-neutral-100
                  overflow-hidden
                "
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col flex-1 p-7">
                <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-6 flex-1">
                  {service.text}
                </p>

                {service.title === "Clases de Canto" ? (
                  <Link
                    href="/servicios/canto"
                    className="
                      self-start
                      text-neutral-900
                      py-2
                      text-sm font-medium
                      rounded-sm
                      transition-colors duration-200
                      hover:text-yellow-700
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                    "
                  >
                    {service.buttonLabel} <span aria-hidden="true">→</span>
                  </Link>
                ) : service.title === "Clases de Piano" ? (
                  <Link
                    href="/servicios/piano"
                    className="
                      self-start
                      text-neutral-900 py-2
                      text-sm font-medium
                      rounded-sm
                      transition-colors duration-200
                      hover:text-yellow-700
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                    "
                  >
                    {service.buttonLabel} <span aria-hidden="true">→</span>
                  </Link>
                ) : service.title === "Masterclasses" ? (
                  <Link
                    href="/masterclasses"
                    className="
                      self-start
                      text-neutral-900 py-2
                      text-sm font-medium
                      rounded-sm
                      transition-colors duration-200
                      hover:text-yellow-700
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                    "
                  >
                    {service.buttonLabel} <span aria-hidden="true">→</span>
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="
                      self-start
                      border border-neutral-300 text-neutral-900
                      px-5 py-2.5
                      text-sm font-medium
                      rounded-full
                      transition-colors duration-200
                      hover:border-neutral-900 hover:bg-neutral-50
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                    "
                  >
                    {service.buttonLabel}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
