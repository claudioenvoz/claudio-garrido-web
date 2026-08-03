import Link from "next/link";

export default function CTA() {
  return (
    <section id="piano-cta-final" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl leading-[1.15] font-medium text-neutral-900 mb-6">
            Todo comienza con una primera clase.
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-10">
            Si llegaste hasta aquí, probablemente ya decidiste que quieres
            aprender piano.
            <br />
            Será un gusto acompañarte durante ese proceso.
            <br />
            Estoy listo cuando tú lo estés.
          </p>

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

          <p className="text-sm text-neutral-500 mt-6">
            ¿Tienes dudas antes de comenzar?
            <br />
            Escríbeme directamente por{" "}
            <a
              href="https://wa.me/56948507518"
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-neutral-900 underline underline-offset-2
                transition-colors duration-200
                hover:text-neutral-600
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
              "
            >
              WhatsApp
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}