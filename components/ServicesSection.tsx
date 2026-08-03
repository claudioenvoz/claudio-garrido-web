import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Clases de Canto",
    text: "Desarrolla tu voz con clases personalizadas orientadas a técnica vocal, interpretación y repertorio.",
    buttonLabel: "Más información",
    image: "/images/service-canto.jpg",
  },
  {
    title: "Programa Piano Funcional",
    text: "Aprende piano desde cero mediante un programa estructurado especialmente para adultos y principiantes.",
    buttonLabel: "Conocer programa",
    image: "/images/service-piano-funcional.jpg",
  },
  {
    title: "Clases de Piano",
    text: "Clases individuales para quienes desean avanzar de forma personalizada.",
    buttonLabel: "Más información",
    image: "/images/service-piano.jpg",
  },
  {
    title: "Masterclasses",
    text: "Clases abiertas donde aprenderás herramientas prácticas sobre música, piano e interpretación.",
    buttonLabel: "Ver próximas fechas",
    image: "/images/service-masterclass.jpg",
  },
];

export default function ServicesSection() {
  return (
    <section id="servicios" className="w-full scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            ¿Cómo puedo ayudarte?
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Cada persona vive un proceso musical distinto. Por eso he
            desarrollado diferentes formas de aprender, según tus objetivos y
            experiencia.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="flex flex-col rounded-2xl border border-neutral-200 overflow-hidden"
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
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-6 flex-1">
                  {service.text}
                </p>

                {service.title === "Clases de Canto" ? (
                  <Link
                    href="/servicios/canto/reserva"
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