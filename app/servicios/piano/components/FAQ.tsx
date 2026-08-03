"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
  {
    question: "¿Necesito conocimientos previos?",
    answer:
      "No. Las clases están diseñadas para personas que comienzan desde cero, así como para estudiantes con experiencia previa.",
  },
  {
    question: "¿Necesito tener piano en casa?",
    answer:
      "Lo ideal es contar con un piano o teclado para practicar entre clases. Si aún no tienes uno, puedo orientarte para escoger el instrumento que mejor se adapte a tus necesidades y presupuesto.",
  },
  {
    question: "¿Las clases son online o presenciales?",
    answer:
      "Actualmente las clases se realizan principalmente en modalidad online, permitiendo estudiar desde cualquier lugar.",
  },
  {
    question: "¿Recibiré material de estudio?",
    answer:
      "Sí. Después de cada clase recibirás ejercicios, partituras, recursos y material personalizado para continuar avanzando durante la semana.",
  },
  {
    question: "¿Qué estilos musicales puedo aprender?",
    answer:
      "Trabajaremos principalmente repertorio popular: pop, rock, baladas, R&B, soul, música latina y cualquier estilo que contribuya a tus objetivos musicales.",
  },
  {
    question: "¿Qué ocurre si no puedo asistir a una clase?",
    answer:
      "Las clases pueden reagendarse avisando con la anticipación correspondiente para que no pierdas tu sesión.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="piano-faq" className="w-full">
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