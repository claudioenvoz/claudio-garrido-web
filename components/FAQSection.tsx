"use client";

import { useState } from "react";

const faqs = [
  {
    question: "¿Qué necesito para las clases de canto?",
    answer:
      "Un computador, tablet o celular. Si no percibes bien el audio, la recomendación es utilizar audífonos o parlantes.",
  },
  {
    question: "¿Recibiré material para estudiar y practicar en casa?",
    answer:
      "Sí, después de cada clase, recibirás audios, videos, imágenes y PDF’s para apoyar tu aprendizaje y entrenar.",
  },
  {
    question:
      "¿Puedo llegar a cantar de forma Profesional, con las Clases de Canto?",
    answer:
      "Sí. Las Clases de Canto te brindarán todas las herramientas para que avances hasta el nivel que tu desees.",
  },
  {
    question:
      "¿Puedo cantar lo que yo quiera, o tengo que seguir lo que el Profesor me indique?",
    answer:
      "Sí, puedes cantar lo que tu quieras y, a su vez, el Profesor te aconsejará estudiar un repertorio propicio para evolucionar.",
  },
  {
    question: "¿Qué pasa si me ausento a una o más clases?",
    answer:
      "Las clases siempre se recuperan. El motivo de la ausencia y la respectiva recuperación, deben ser oportunamente informadas al Profesor. Si se acumulan 3 o más ausencias en un mismo periodo, esta debe venir justificada con un Certificado Médico, un Certificado de Defunción de Familia cercano u otro documento que justifique la ausencia.",
  },
  {
    question:
      "Si contraté un Pack Mensual o Bimensual y no quiero continuar tomando las clases que quedaron pagadas, ¿Puedo pedir la devolución del dinero?",
    answer:
      "No. Las clases pagadas no tienen devolución de dinero, pero el Profesor tiene la obligación de llevar a cabo todas las clases que hayan sido contratadas. Cada estudiante tiene el derecho de exigir que sus clases sean hechas en los horarios agendados.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="w-full bg-white border-t border-neutral-200 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-[120px]">
        <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-[-0.02em] font-semibold text-neutral-950 mb-12 text-center">
          Preguntas frecuentes
        </h2>

        <div className="max-w-3xl mx-auto flex flex-col">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-neutral-200"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="
                    w-full
                    flex items-center justify-between
                    gap-6
                      py-7
                    text-left
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-2
                    focus-visible:outline-neutral-900
                  "
                  aria-expanded={isOpen}
                >
                  <span className="text-base md:text-lg text-neutral-950 font-semibold transition-colors hover:text-yellow-700">
                    {faq.question}
                  </span>

                  <span
                    className="
                      flex-shrink-0
                      text-neutral-400
                      text-2xl
                      font-light
                      transition-transform
                      duration-200
                    "
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-6 pr-10">
                    <p className="text-base text-neutral-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
