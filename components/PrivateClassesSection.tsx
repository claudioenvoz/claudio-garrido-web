import Image from "next/image";
import Link from "next/link";

const classes = [
  {
    title: "Clases de Canto",
    text: "Técnica vocal, interpretación y repertorio, adaptado a tu nivel.",
    image: "/images/private-canto.jpg",
  },
  {
    title: "Clases de Piano",
    text: "Avanza de forma individual, a tu propio ritmo y objetivos.",
    image: "/images/private-piano.jpg",
  },
  {
    title: "Masterclasses",
    text: "Sesiones puntuales con herramientas prácticas de música e interpretación.",
    image: "/images/private-masterclass.jpg",
  },
];

export default function PrivateClassesSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-2xl mb-14 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            Clases personalizadas
          </h2>

          <div className="text-base md:text-lg text-neutral-600 leading-relaxed space-y-4">
            <p>
              Trabajo de manera individual con cada estudiante, adaptando los
              contenidos según sus objetivos musicales.
            </p>

            <p>
              Puedes tomar clases de canto, piano o formación musical, tanto
              online como presencial.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((item) => (
            <div
              key={item.title}
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
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-3">
                  {item.title}
                </h3>

                <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-6 flex-1">
                  {item.text}
                </p>

                {item.title === "Clases de Canto" ? (
                  <Link
                    href="/servicios/canto/reserva"
                    className="
                      self-start
                      inline-flex items-center justify-center
                      border border-neutral-300 text-neutral-900
                      px-5 py-2.5
                      text-sm font-medium
                      rounded-full
                      transition-colors duration-200
                      hover:border-neutral-900 hover:bg-neutral-50
                      focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                    "
                  >
                    Más información
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
                    Más información
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