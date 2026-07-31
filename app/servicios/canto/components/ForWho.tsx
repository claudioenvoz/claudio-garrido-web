const audiences = [
  {
    number: "01",
    text: "Nunca has cantado. Quieres comenzar correctamente, sin adquirir malos hábitos y desarrollando una técnica sólida desde el primer día.",
  },
  {
    number: "02",
    text: "Ya tienes experiencia. Llevaremos tu voz al siguiente nivel trabajando específicamente aquello que hoy limita tu desarrollo vocal.",
  },
  {
    number: "03",
    text: "Quieres dedicarte profesionalmente. Prepararemos tu voz para escenarios, grabaciones, audiciones, concursos y cualquier desafío artístico que quieras alcanzar.",
  },
  {
    number: "04",
    text: "Un proceso completamente personalizado. Cada voz es distinta. Cada alumno tiene objetivos diferentes. Por eso cada proceso de aprendizaje se adapta completamente a ti.",
  },
];

export default function ForWho() {
  return (
    <section id="canto-para-quien" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            ¿Estas clases son para ti?
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Trabajo con estudiantes de todos los niveles, desde quienes jamás
            han tomado una clase de canto hasta cantantes que buscan
            perfeccionar una técnica profesional.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {audiences.map((item, index) => (
            <div
              key={item.number}
              className="
                flex items-start gap-5
                rounded-2xl border border-neutral-200
                p-8
                animate-fade-in-up
              "
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <span className="text-sm font-medium text-neutral-400 mt-1">
                {item.number}
              </span>
              <p className="text-base md:text-lg text-neutral-900 leading-relaxed">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center max-w-xl mx-auto mt-16 md:mt-24 animate-fade-in-up">
          <p className="text-lg md:text-xl text-neutral-900 leading-relaxed mb-8">
            Sea cual sea tu punto de partida, mi trabajo es ayudarte a llegar
            exactamente hasta donde tú quieras.
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
