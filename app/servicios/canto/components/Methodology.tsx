const steps = [
  {
    number: "1",
    title: "Reserva tu horario.",
    text: "Escoge el plan que prefieras y agenda el horario disponible que mejor se adapte a ti.",
  },
  {
    number: "2",
    title: "Comenzamos a trabajar.",
    text: "Cada clase dura 60 minutos y combina entrenamiento técnico, ejercicios prácticos y aplicación directa al repertorio.",
  },
  {
    number: "3",
    title: "Entrena durante la semana.",
    text: "Después de cada clase recibirás material personalizado para continuar practicando hasta la siguiente sesión.",
  },
  {
    number: "4",
    title: "Mide tu evolución.",
    text: "Cada etapa del proceso permite identificar tus avances y definir los próximos objetivos de trabajo.",
  },
];

export default function Methodology() {
  return (
    <section id="canto-como-funcionan" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            ¿Cómo funcionan las clases?
          </h2>
          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Todo el proceso está pensado para que avances de manera
            constante, con objetivos claros y un acompañamiento
            completamente personalizado.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={step.number}
              className="flex gap-6 animate-fade-in-up"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center text-sm font-medium shrink-0">
                  {step.number}
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px flex-1 bg-neutral-200 my-2" />
                )}
              </div>

              <div className={index < steps.length - 1 ? "pb-10" : ""}>
                <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center max-w-xl mx-auto mt-16 md:mt-24 animate-fade-in-up">
          <p className="text-lg md:text-xl text-neutral-900 leading-relaxed mb-8">
            Cada clase tiene un propósito claro: ayudarte a convertirte en el
            cantante que quieres ser.
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
