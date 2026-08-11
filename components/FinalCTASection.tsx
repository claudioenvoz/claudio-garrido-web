import Link from "next/link";



export default function FinalCTASection() {

  return (

    <section id="contacto" className="w-full bg-white scroll-mt-20">

      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">

        <div className="max-w-2xl mx-auto text-center">

          <h2 className="text-3xl md:text-5xl leading-[1.15] font-medium text-neutral-900 mb-6">

            Comienza hoy tu camino musical.

          </h2>



          <p className="text-base md:text-lg text-neutral-600 leading-relaxed mb-10">

            Ya sea a través de clases particulares, Piano Funcional o las

            Masterclasses, estaré encantado de acompañarte en tu proceso de

            aprendizaje.

          </p>



          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Link

              href="/reservar"

              className="

                w-full sm:w-auto

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

              Reservar una clase

            </Link>



            <a

              href="https://wa.me/56948507518"

              target="_blank"

              rel="noopener noreferrer"

              className="

                w-full sm:w-auto

                inline-flex items-center justify-center

                border border-neutral-300 text-neutral-900

                px-8 py-4

                text-base md:text-lg font-medium

                rounded-full

                transition-colors duration-200

                hover:border-neutral-900 hover:bg-neutral-50

                focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900

              "

            >

              Escribirme por WhatsApp

            </a>

          </div>

        </div>

      </div>

    </section>

  );

}