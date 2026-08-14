import Image from "next/image";

const testimonials = [
  {
    name: "Edgar De La Vega",
    text: "Recomiendo 100% a Claudio como Profesor porque, con el tiempo he notado mi evolución y, ademas de su conocimiento musical, él sabe bien cómo entregarlo a sus estudiantes",
    image: "/images/testimonial-1.jpg",
  },
  {
    name: "Marisol Calderón",
    text: "Claudio es un Profesor que te ayuda a crecer ‘de la mano’, siempre te acompaña con cercanía, sensibilidad y comprensión",
    image: "/images/testimonial-2.jpg",
  },
  {
    name: "Giorgio Soncini",
    text: "Claudio es muy metódico y desafiante; tiene un plan de trabajo que te permite evidenciar tus avances y siempre te motiva a seguir creciendo.",
    image: "/images/testimonial-3.jpg",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            Lo que dicen mis estudiantes
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Cada proceso de aprendizaje es distinto, pero todos tienen algo en
            común: descubrir que aprender música sí puede ser una experiencia
            cercana, clara y entretenida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="flex flex-col items-center text-center rounded-2xl border border-neutral-200 p-8"
            >
              <div className="relative w-16 h-16 rounded-full bg-neutral-100 overflow-hidden mb-5">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>

              <p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-5">
                {testimonial.text}
              </p>

              <div
                className="flex items-center justify-center gap-1 mb-3"
                aria-label="5 estrellas de 5"
              >
                <span className="text-neutral-900 text-sm">★</span>
                <span className="text-neutral-900 text-sm">★</span>
                <span className="text-neutral-900 text-sm">★</span>
                <span className="text-neutral-900 text-sm">★</span>
                <span className="text-neutral-900 text-sm">★</span>
              </div>

              <p className="text-sm font-medium text-neutral-900">
                {testimonial.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}