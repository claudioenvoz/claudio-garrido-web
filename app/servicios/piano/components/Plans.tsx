import Link from "next/link";

const plans = [
  {
    slug: "individual",
    name: "Clase Individual",
    price: "$40.000 CLP",
    badge: null,
    features: ["1 clase de 60 minutos"],
  },
  {
    slug: "mensual",
    name: "Pack Mensual",
    price: "$120.000 CLP",
    badge: "Más elegido",
    features: [
      "4 clases",
      "Una clase semanal",
      "Mismo horario reservado",
    ],
  },
  {
    slug: "bimensual",
    name: "Pack Bimensual",
    price: "$200.000 CLP",
    badge: null,
    features: [
      "8 clases",
      "Continuidad de trabajo",
      "Seguimiento prolongado",
    ],
  },
];

export default function Plans() {
  return (
    <section id="piano-planes" className="w-full">
      <div className="mx-auto max-w-7xl px-6 md:px-10 py-16 md:py-24">
        <div className="text-center max-w-2xl mx-auto mb-14 md:mb-20 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-medium text-neutral-900 mb-6">
            Planes
          </h2>

          <p className="text-base md:text-lg text-neutral-600 leading-relaxed">
            Elige la modalidad que mejor se adapte a tu proceso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className="
                flex flex-col
                rounded-2xl border border-neutral-200
                p-8
                animate-fade-in-up
              "
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {plan.badge && (
                <span className="inline-block self-start bg-neutral-900 text-white text-xs font-medium px-3 py-1 rounded-full mb-5">
                  {plan.badge}
                </span>
              )}

              <h3 className="text-lg md:text-xl font-medium text-neutral-900 mb-2">
                {plan.name}
              </h3>

              <p className="text-2xl md:text-3xl font-medium text-neutral-900 mb-6">
                {plan.price}
              </p>

              <p className="text-sm font-medium text-neutral-500 mb-3">
                Incluye
              </p>

              <ul className="flex flex-col gap-2 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm md:text-base text-neutral-600"
                  >
                    <span className="text-neutral-400" aria-hidden="true">
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={`/servicios/piano/reserva?plan=${plan.slug}`}
                className="
                  inline-flex items-center justify-center
                  bg-neutral-900 text-white
                  px-7 py-3.5
                  text-sm md:text-base font-medium
                  rounded-full
                  transition-colors duration-200
                  hover:bg-neutral-800
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900
                "
              >
                Reservar horario
              </Link>
            </div>
          ))}
        </div>

        <div className="max-w-2xl mx-auto text-center mt-16 md:mt-20 animate-fade-in-up">
          <p className="text-sm font-medium text-neutral-500 mb-3">
            Métodos de pago
          </p>

          <p className="text-base text-neutral-600 leading-relaxed">
            Transferencia bancaria Chile. Transferencia bancaria Brasil.
            Tarjetas Internacionales mediante Ionix Payments.
          </p>

          <p className="text-sm text-neutral-500 mt-4">
            Si necesitas otra alternativa de pago, puedes comunicarte
            directamente conmigo por WhatsApp.
          </p>
        </div>
      </div>
    </section>
  );
}