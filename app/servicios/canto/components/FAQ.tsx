"use client";

import { useState } from "react";

const faqs = [
  {
    question: "¿Qué necesito para las clases?",
    answer:
      "Un computador, tablet o teléfono. Si es posible, utilizar audífonos o parlantes externos para escuchar mejor.",
  },
  {
    question: "¿Recibiré material para practicar?",
    answer:
      "Sí. Después de cada clase recibirás ejercicios, audios, videos, imágenes y PDFs para continuar trabajando durante la semana.",
  },
  {
    question: "¿Puedo llegar a cantar profesionalmente?",
    answer:
      "Sí. El proceso está diseñado para acompañarte desde tu nivel actual hasta el nivel que quieras alcanzar.",
  },
  {
    question: "¿Puedo escoger el repertorio?",
    answer:
      "Sí. Tú puedes proponer el repertorio que deseas trabajar y yo también te recomendaré canciones que favorezcan tu desarrollo.",
  },
  {
    question: "¿Qué ocurre si falto a una clase?",
    answer:
      "Las clases pueden recuperarse avisando oportunamente. En casos de múltiples ausencias podrá solicitarse documentación de respaldo.",
  },
  {
    question: "¿Existe devolución de dinero?",
    answer:
      "No. Las clases pagadas no son reembolsables, pero todas las clases contratadas deben ser realizadas.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="canto-faq" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-14 md:mb-20 text-center animate-fade-in-up">
          Preguntas frecuentes
        </h2>

        <div className="max-w-3xl mx-auto flex flex-col animate-fade-in-up">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-expanded={isOpen}
                  className="
                    w-full flex items-center justify-between
                    py-6 text-left
                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                  "
                >
                  <span className="text-base md:text-lg text-neutral-900 font-medium pr-6">
                    {faq.question}
                  </span>
                  <span
                    className={`
                      text-neutral-400 text-xl shrink-0
                      transition-transform duration-300
                      ${isOpen ? "rotate-45" : "rotate-0"}
                    `}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>

                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <p className="text-sm md:text-base text-neutral-600 leading-relaxed pb-6 pr-10">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
