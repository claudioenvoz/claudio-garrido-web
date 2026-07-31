const faqs = [
  "¿Necesito conocimientos previos?",
  "¿Las clases son online o presenciales?",
  "¿Qué necesito para comenzar?",
  "¿Cómo puedo reservar una clase?",
  "¿Qué incluye Piano Funcional?",
];

export default function FAQSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-14 md:mb-20 text-center">
          Preguntas frecuentes
        </h2>

        <div className="max-w-3xl mx-auto flex flex-col">
          {faqs.map((question) => (
            <div
              key={question}
              className="flex items-center justify-between py-6 border-b border-neutral-200"
            >
              <span className="text-base md:text-lg text-neutral-900 font-medium">
                {question}
              </span>
              <span className="text-neutral-400 text-xl" aria-hidden="true">
                +
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}