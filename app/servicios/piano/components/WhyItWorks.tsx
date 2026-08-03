import Link from "next/link";

const pillars = [
  {
    number: "01",
    title: "Metodología práctica",
    text: "Desde la primera clase comenzarás a comprender cómo funcionan los acordes, las progresiones y los acompañamientos que utilizan cientos de canciones.",
  },
  {
    number: "02",
    title: "Aprendizaje personalizado",
    text: "Cada estudiante aprende a un ritmo diferente. Las clases se adaptan a tus objetivos, experiencia y estilo musical para que avances con seguridad.",
  },
  {
    number: "03",
    title: "Material de apoyo exclusivo",
    text: "Después de cada clase recibirás ejercicios, apuntes y recursos para seguir practicando de manera organizada entre una sesión y otra.",
  },
  {
    number: "04",
    title: "Aplicación inmediata",
    text: "Todo lo que aprendas podrás utilizarlo directamente en canciones reales, desarrollando herramientas que permanecerán contigo mucho más allá de una sola clase.",
  },
];

export default function WhyItWorks() {
  return (
    <section id="piano-por-que-funciona" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            ¿Por qué este proceso funciona?
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Aprender piano no consiste únicamente en memorizar canciones.
            Consiste en comprender el instrumento para poder tocar con libertad,
            seguridad y confianza.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.number}
              className="
                flex items-start gap-5
                rounded-2xl border border-neutral-200
                p-8
                animate-fade-in-up
              "
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="text-sm font-medium text-neutral-400 mt-1">
                {pillar.number}
              </span>

              <div>
                <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-2">
                  {pillar.title}
                </h3>

                <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                  {pillar.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-xl mx-auto mt-16 md:mt-24 animate-fade-in-up">
          <p className="text-lg md:text-xl text-neutral-900 leading-relaxed mb-8">
            No importa si hoy no sabes tocar una sola nota.
            <br />
            Lo importante es comenzar correctamente.
          </p>

          <Link
            href="/servicios/piano/reserva"
            className="
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
        </div>
      </div>
    </section>
  );
}