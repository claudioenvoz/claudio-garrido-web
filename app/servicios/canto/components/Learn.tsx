const topics = [
  "Técnica de Canto Popular",
  "Afinación",
  "Respiración",
  "Biomecánica de la Voz",
  "Interpretación",
  "Improvisación",
  "Repertorio",
  "Estética Vocal",
  "Trabajo de Estilos",
  "Preparación para Escenarios",
  "Preparación para Grabaciones",
  "Preparación para Audiciones",
];

export default function Learn() {
  return (
    <section id="canto-que-aprenderas" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            ¿Qué aprenderás?
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Durante las clases desarrollaremos todas las herramientas
            necesarias para construir una voz sana, segura y expresiva.
          </p>
        </div>

        <div
          className="
            rounded-2xl border border-neutral-200
            p-8 md:p-12
            animate-fade-in-up
          "
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7">
            {topics.map((topic, index) => (
              <div key={topic} className="flex items-start gap-4">
                <span className="text-sm font-medium text-neutral-400 mt-1">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-base md:text-lg text-neutral-900 leading-relaxed">
                  {topic}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16 md:mt-24 animate-fade-in-up">
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
