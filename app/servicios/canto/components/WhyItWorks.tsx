const pillars = [
  {
    number: "01",
    title: "Metodología personalizada",
    text: "Cada estudiante comienza desde un punto distinto. Por eso cada proceso se adapta completamente a tu voz, tus objetivos y tu ritmo de aprendizaje.",
  },
  {
    number: "02",
    title: "Material de estudio exclusivo",
    text: "Después de cada clase recibirás audios, ejercicios, imágenes y documentos que te permitirán seguir entrenando y avanzando entre una sesión y otra.",
  },
  {
    number: "03",
    title: "Seguimiento constante",
    text: "Cada etapa del proceso permite medir tu evolución para saber exactamente qué debes mejorar y cómo seguir creciendo.",
  },
  {
    number: "04",
    title: "Un espacio de confianza",
    text: "Además del desarrollo técnico, encontrarás un ambiente cercano donde podrás crecer artística y personalmente con total tranquilidad.",
  },
];

export default function WhyItWorks() {
  return (
    <section id="canto-por-que-funciona" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            ¿Por qué este proceso funciona?
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            No se trata solamente de aprender a cantar. Se trata de
            desarrollar una voz sólida mediante un proceso serio,
            personalizado y diseñado para que avances constantemente.
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
            No importa dónde estés hoy.
            <br />
            Lo importante es hasta dónde quieres llegar.
          </p>

          <a
            href="/servicios/canto/reserva"
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
          </a>
        </div>
      </div>
    </section>
  );
}
