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
    <section id="testimonios" className="w-full bg-[#f9f9f9] scroll-mt-20">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-[120px]">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20">
          <h2 className="text-3xl md:text-4xl leading-[1.2] tracking-[-0.02em] font-semibold text-neutral-950 mb-6">
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
              className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-8"
            >
              <div className="flex gap-1 text-yellow-500 mb-6" aria-label="5 estrellas de 5">
                {[1, 2, 3, 4, 5].map((star) => <span key={star}>★</span>)}
              </div>

              <p className="text-base text-neutral-600 leading-relaxed italic flex-1 mb-7">
                “{testimonial.text}”
              </p>

              <div className="flex items-center gap-4 border-t border-neutral-200 pt-6">
                <div className="relative w-12 h-12 rounded-full bg-neutral-100 overflow-hidden">
                  <Image src={testimonial.image} alt={testimonial.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-neutral-950">{testimonial.name}</p>
                  <p className="text-xs uppercase tracking-wider text-neutral-500 mt-1">Estudiante</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
